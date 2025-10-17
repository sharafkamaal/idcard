import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Get current user (first user in database for now)
// TODO: Replace with actual authentication
async function getCurrentUser() {
  const user = await prisma.user.findFirst();
  
  if (!user) {
    // Create a default user if none exists
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const newUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '+1234567890',
        role: 'ADMIN',
        theme: 'light',
        notifications: true,
      },
    });
    
    return newUser;
  }
  
  return user;
}

export async function PUT(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current and new passwords are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Get current user
    const currentUser = await getCurrentUser();

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update password' },
      { status: 500 }
    );
  }
}
