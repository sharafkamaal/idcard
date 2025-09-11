"use client";
import { useState } from "react";

export default function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full max-w-md border border-gray-200 rounded-lg shadow-sm bg-white p-8">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Wezant
      </h1>

      {/* Welcome Text */}
      <p className="text-gray-600 text-center mb-6">
        <span className="font-semibold text-gray-800">Welcome Back !</span>
        <br />
        Sign in to continue to Wezant.
      </p>

      {/* Username Input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Password Input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 text-blue-600" />
          <span className="text-gray-600 text-sm">Remember me</span>
        </label>
      </div>

      {/* Login Button */}
      <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
        Log in
      </button>

      {/* Social Login */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-3 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex justify-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100">
          <span className="text-blue-600">F</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100">
          <span className="text-sky-500">T</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100">
          <span className="text-red-500">G</span>
        </button>
      </div>

      {/* Signup link */}
      <p className="text-center text-gray-600 text-sm mt-6">
        Don&apos;t have an account?{" "}
        <a href="#" className="text-blue-600 font-semibold">
          Signup now
        </a>
      </p>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        © 2025 Wezant Crafted with ❤️ by Zenoids
      </p>
    </div>
  );
}
