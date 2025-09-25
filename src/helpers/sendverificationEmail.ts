import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log('🔄 Attempting to send email...');
    console.log('📧 To:', email);
    console.log('👤 Username:', username);
    console.log('🔢 Verification code:', verifyCode);
    console.log('🔑 API Key exists:', !!process.env.RESEND_API_KEY);
    
    // FOR TESTING - Log the verification code
    console.log('🚨 VERIFICATION CODE FOR TESTING:', verifyCode);
    
    const emailResult = await resend.emails.send({
      from: 'onboarding@resend.dev', // This should work for testing
      to: email,
      subject: 'True Feedback - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello ${username},</h2>
          <p>Thank you for registering. Please use the following verification code:</p>
          <div style="font-size: 24px; font-weight: bold; background: #f0f0f0; padding: 10px; margin: 20px 0; text-align: center;">
            ${verifyCode}
          </div>
          <p>This code will expire in 1 hour.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `,
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📬 Email ID:', emailResult.data?.id);
    
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('❌ Error sending verification email:', emailError);
    
    // FOR TESTING - Still return success and log the code
    console.log('🚨 EMAIL FAILED - USE THIS CODE:', verifyCode);
    
    return { 
      success: true, // Change to true for testing
      message: 'Check console for verification code (email service issue)' 
    };
  }
}