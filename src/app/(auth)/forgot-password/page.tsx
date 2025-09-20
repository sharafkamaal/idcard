"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import axios, { AxiosError } from "axios"

import { forgotPasswordSchema } from "@/schemas/signInSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// shadcn/ui components
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    // form setup
    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    // handle form submit
    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/forgot-password', data)

            toast({
                title: "Email Sent",
                description: response.data.message ?? "Password reset link has been sent to your email.",
                variant: "default",
                duration: 5000,
            })

            setEmailSent(true)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message ?? "Something went wrong. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (emailSent) {
        return (
            <>
                <div className="min-h-screen flex">
                    {/* Left side - Image */}
                    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-50 to-emerald-100 items-center justify-center p-12">
                        <div className="max-w-md text-center">
                            <div className="w-96 h-64 bg-white rounded-lg shadow-lg mb-8 flex items-center justify-center">
                                <CheckCircle className="text-green-500 text-6xl h-24 w-24" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Email Sent Successfully
                            </h2>
                            <p className="text-gray-600">
                                Check your inbox for password reset instructions.
                            </p>
                        </div>
                    </div>

                    {/* Right side - Success Message */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                        <div className="w-full max-w-md space-y-8 text-center">
                            <div className="lg:hidden mb-8">
                                <CheckCircle className="text-green-500 h-16 w-16 mx-auto mb-4" />
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    Check Your Email
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    We've sent a password reset link to your email address.
                                    Please check your inbox and follow the instructions to reset your password.
                                </p>
                                <p className="text-sm text-gray-500 mb-8">
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    onClick={() => setEmailSent(false)}
                                    variant="outline"
                                    className="w-full h-12"
                                >
                                    Try Again
                                </Button>

                                <Link href="/sign-in">
                                    <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                                        Back to Sign In
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster />
            </>
        )
    }

    return (
        <>
            <div className="min-h-screen flex">
                {/* Left side - Image */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-12">
                    <div className="max-w-md text-center">
                        <div className="w-96 h-64 bg-white rounded-lg shadow-lg mb-8 flex items-center justify-center">
                            <Mail className="text-blue-500 text-6xl h-24 w-24" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Forgot Your Password?
                        </h2>
                        <p className="text-gray-600">
                            No worries! Enter your email and we'll send you a reset link.
                        </p>
                    </div>
                </div>

                {/* Right side - Forgot Password Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md space-y-8">
                        {/* Back button */}
                        <Link
                            href="/sign-in"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sign In
                        </Link>

                        {/* Header */}
                        <div className="text-center">
                            <div className="lg:hidden mb-6">
                                <Mail className="text-blue-500 h-12 w-12 mx-auto" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Forgot Password
                            </h1>
                            <p className="text-gray-600">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Forgot Password Form */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700">Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    className="h-12 border-gray-300 focus:border-blue-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit button */}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Reset Link...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Send Reset Link
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        {/* Additional info */}
                        <div className="text-center space-y-4">
                            <p className="text-sm text-gray-500">
                                Remember your password?{" "}
                                <Link
                                    href="/sign-in"
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Sign in here
                                </Link>
                            </p>

                            <p className="text-sm text-gray-500">
                                Don't have an account?{" "}
                                <Link
                                    href="/sign-up"
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Sign up now
                                </Link>
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-xs text-gray-500 mt-8">
                            © 2024 Mystery Message. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>

            {/* Global toaster */}
            <Toaster />
        </>
    )
}

export default Page