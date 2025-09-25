'use client';

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signUpSchema } from "@/schemas/signUpSchema"
import { useEffect, useState } from "react"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import Link from "next/link"
import { useDebounceValue } from "usehooks-ts"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Toaster } from "@/components/ui/toaster"

const Page = () => {
  const [username, setUsername] = useState("")
  const [userMessage, setUserMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fix the debounce usage
  const [debouncedUsername] = useDebounceValue(username, 300)
  const { toast } = useToast()
  const router = useRouter()

  // form setup
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  // check username availability
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername || debouncedUsername.length < 2) {
        setUserMessage("")
        return
      }
      
      setIsCheckingUsername(true)
      setUserMessage("")

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${encodeURIComponent(debouncedUsername)}`
        )
        setUserMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUserMessage(
          axiosError.response?.data.message ?? "Error checking username"
        )
      } finally {
        setIsCheckingUsername(false)
      }
    }

    checkUsernameUnique()
  }, [debouncedUsername])

  // handle form submit
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, data)

      toast({
        title: "Success",
        description: response.data.message ?? "You have signed up successfully!",
        variant: "default",
        duration: 5000,
      })

      router.replace(`/verify/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Signup Failed",
        description: axiosError.response?.data.message ?? "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Mystery Message
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>

          {/* form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setUsername(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-gray-500">
                      {isCheckingUsername ? "Checking username..." : userMessage}
                    </p>
                  </FormItem>
                )}
              />

              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Must be at least 6 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* submit button */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <p>
              Already a member?{" "}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* global toaster */}
      <Toaster />
    </>
  )
}

export default Page