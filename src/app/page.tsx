
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    // your form data
  });

  return (
    <div className={styles.container}>
      <form className={styles.loginForm}>
        {/* your form content */}
      </form>
    </div>
  );
}
