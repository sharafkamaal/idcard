"use client";

import { signIn, useSession, signOut } from "next-auth/react";

export default function SignInPage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <p>You are not signed in</p>
      {/* 👇 tell NextAuth which provider */}
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}
