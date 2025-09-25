import { Resend } from "resend";

console.log('🔧 Initializing Resend...');
console.log('🔑 API Key exists:', !!process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is not set in environment variables');
  throw new Error('RESEND_API_KEY is required');
}

export const resend = new Resend(process.env.RESEND_API_KEY);
console.log('✅ Resend initialized successfully');