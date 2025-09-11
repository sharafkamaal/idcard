import Image from "next/image";
import LoginCard from "@/components/LoginCard";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left side image */}
      <div className="hidden md:flex w-1/2 relative">
        <Image
          src="/login_download.png" // place your image in /public/login-bg.jpg
          alt="Login Background"
          fill
          className="object-cover"
        />
      </div>

      {/* Right side login form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-6">
        <LoginCard />
      </div>
    </div>
  );
}
