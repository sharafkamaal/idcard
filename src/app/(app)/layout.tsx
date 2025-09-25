import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata = {
  title: "Wezant Dashboard",
  description: "Admin dashboard for student management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <Sidebar />
        {/* Main content */}
        <div className="flex flex-col flex-1">
          <Header />
          <main className="p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}