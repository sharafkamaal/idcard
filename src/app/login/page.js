 "use client";

 import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in ${username}`);
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Image */}
      <div className="w-1/2 relative hidden lg:block">
        <Image
          src="/login_download.png"
          alt="Login illustration"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-md rounded-md p-8 relative">
          <div className="absolute -left-6 top-6 bottom-6 w-1 bg-blue-600 rounded-tr-md rounded-br-md" />

          <div className="mb-6 text-blue-600 font-bold text-xl">
            Wezant<span className="text-sm text-gray-400">®</span>
          </div>

          <h2 className="text-lg font-semibold">Welcome Back !</h2>
          <p className="text-sm text-gray-500 mb-4">
            Sign in to continue to Wezant.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div className="flex items-center text-sm">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-md"
            >
              Log in
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Sign in with
          </div>
          <div className="flex justify-center gap-3 mt-3">
            <button className="p-2 border rounded-full">F</button>
            <button className="p-2 border rounded-full">T</button>
            <button className="p-2 border rounded-full">G</button>
          </div>

          <p className="text-center mt-6 text-sm">
            Don&apos;t have an account?{" "}
            <a className="text-blue-600 underline">Signup now</a>
          </p>
          <div className="mt-8 text-center text-xs text-gray-400">
            © 2025 Wezant Crafted with{" "}
            <span className="text-red-500">♥</span> by ZenoidS
          </div>
        </div>
      </div>
    </div>
  );
}
