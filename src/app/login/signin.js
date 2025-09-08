// app/login/page.tsx (Next.js 13+ with App Router)
"use client";

import { useState } from "react";
import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side Image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <img
          src="/login-bg.png" // replace with your image (put in /public folder)
          alt="Login Illustration"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-10 border border-blue-200">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
            Wezant
          </h1>

          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Welcome Back !
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to continue to Wezant.
          </p>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="remember"
              className="mr-2"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold">
            Log in
          </button>

          {/* Social Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Sign in with</p>
            <div className="flex justify-center gap-4">
              <button className="p-2 rounded-full border hover:bg-gray-100">
                <FaFacebookF className="text-blue-600" />
              </button>
              <button className="p-2 rounded-full border hover:bg-gray-100">
                <FaTwitter className="text-blue-400" />
              </button>
              <button className="p-2 rounded-full border hover:bg-gray-100">
                <FaGoogle className="text-red-500" />
              </button>
            </div>
          </div>

          {/* Signup */}
          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 font-medium">
              Signup now
            </a>
          </p>

          {/* Footer */}
          <p className="mt-6 text-xs text-center text-gray-400">
            © 2025 Wezant. Crafted with ❤️ by Zenolds
          </p>
        </div>
      </div>
    </div>
  );
}
