import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Get current user (first user in database for now)
// TODO: Replace with actual authentication session
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
    
    console.log('Created default user with ID:', newUser.id);
    return newUser;
  }
  
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        theme: true,
        notifications: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const formData = await request.formData();

    // Extract file
    const avatarFile = formData.get('avatar') as File | null;
    let avatarUrl: string | undefined;

    if (avatarFile && avatarFile.size > 0) {
      // Validate file
      if (avatarFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Avatar size must be less than 5MB' },
          { status: 400 }
        );
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(avatarFile.type)) {
        return NextResponse.json(
          { success: false, error: 'Avatar must be JPEG, PNG, or GIF' },
          { status: 400 }
        );
      }

      // Convert to base64 for storage
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      avatarUrl = `data:${avatarFile.type};base64,${buffer.toString('base64')}`;
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const theme = formData.get('theme') as string;
    const notifications = formData.get('notifications') === 'true';

    // Build update data object - only include fields with values
    const updateData: any = {
      name,
      email,
      theme,
      notifications,
    };

    // Only add optional fields if they have values
    if (phone) {
      updateData.phone = phone;
    }

    if (avatarUrl) {
      updateData.avatar = avatarUrl;
    }

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        theme: true,
        notifications: true,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
