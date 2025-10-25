'use client'

import { signIn } from "next-auth/react"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    remember: false
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const result = await signIn('credentials', {
        identifier: formData.identifier,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        // Successful login - redirect to dashboard
        router.push('/dashboard')
        router.refresh() // Refresh to update session
      }
    } catch (error) {
      console.error('Login error:', error)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Full image */}
      <div className="hidden lg:flex w-1/2 bg-gray-100">
        <Image
          src="/login_download.png"
          alt="Sign in illustration"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold text-blue-600">True Feedback</h1>
          </div>

          {/* Welcome message */}
          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              Welcome Back !
            </h2>
            <p className="text-sm text-gray-500">
              Sign in to continue to True Feedback.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username/Email */}
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input
                id="identifier"
                name="identifier"
                placeholder="Enter username or email"
                value={formData.identifier}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                name="remember"
                checked={formData.remember}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, remember: checked as boolean }))
                }
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          {/* Forgot password */}
          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>

          {/* Signup link */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Sign up now
            </Link>
          </p>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8">
            © 2025 True Feedback. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}