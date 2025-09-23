"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: call your API here
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/dashboard") // redirect after success
    }, 1500)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Full image */}
      <div className="hidden lg:flex w-1/2 bg-gray-100">
        <img
          src="/login_download.png"
          alt="Sign in illustration"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Wezant*</h1>
          </div>

          {/* Welcome message */}
          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              Welcome Back !
            </h2>
            <p className="text-sm text-gray-500">
              Sign in to continue to Wezant.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter username" required />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
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

          {/* Social login */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">Sign in with</p>
            <div className="flex justify-center space-x-4">
              <button className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                f
              </button>
              <button className="w-9 h-9 rounded-full bg-sky-400 text-white flex items-center justify-center">
                t
              </button>
              <button className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center">
                G
              </button>
            </div>
          </div>

          {/* Signup link */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Signup now
            </Link>
          </p>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8">
            © 2025 Wezant Crafted with ❤️ by Zenoids
          </div>
        </div>
      </div>
    </div>
  )
}
