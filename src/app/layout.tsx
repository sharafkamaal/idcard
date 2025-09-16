import "./globals.css";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import AuthProvider from "context/AuthProvider"; // ✅ import the client wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wezant",
  description: "Login System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-100"}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
