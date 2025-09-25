import UserModel from '@/models/user';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendverificationEmail';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    console.log('🔄 Sign-up attempt:', { username, email });

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      console.log('❌ Username already taken:', username);
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Generated verification code:', verifyCode);

    if (existingUserByEmail) {
      console.log('📧 User exists with email, updating...');
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        existingUserByEmail.username = username; // Update username too
        await existingUserByEmail.save();
        console.log('✅ Updated existing user');
      }
    } else {
      console.log('👤 Creating new user...');
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      const savedUser = await newUser.save();
      console.log('✅ Created new user:', savedUser._id);
    }

    // Send verification email
    console.log('📧 Sending verification email...');
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    
    console.log('📧 Email response:', emailResponse);
    
    if (!emailResponse.success) {
      console.log('⚠️ Email failed, but continuing...');
      // Don't fail the signup if email fails - just log it
    }

    // Verify the user was actually saved
    const savedUser = await UserModel.findOne({ username });
    console.log('🔍 User saved verification:', {
      found: !!savedUser,
      username: savedUser?.username,
      verifyCode: savedUser?.verifyCode
    });

    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account. Check console for verification code.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}