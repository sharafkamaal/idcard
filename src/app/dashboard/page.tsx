"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import styles from './dashboard.module.css';

interface User {
  // your user interface
}

export default function DashboardPage() {
  // ... rest of your existing dashboard code
}