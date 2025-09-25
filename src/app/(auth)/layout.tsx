export const metadata = {
  title: 'True Feedback - Authentication',
  description: 'Sign in to True Feedback',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}