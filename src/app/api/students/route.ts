// src/app/api/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract file
    const photoFile = formData.get('photo') as File | null;
    let photoUrl = '';

    if (photoFile && photoFile.size > 0) {
      // Validate file
      if (photoFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Photo size must be less than 5MB' },
          { status: 400 }
        );
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(photoFile.type)) {
        return NextResponse.json(
          { success: false, error: 'Photo must be JPEG or PNG' },
          { status: 400 }
        );
      }

      // Convert to base64 for storage
      const bytes = await photoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      photoUrl = `data:${photoFile.type};base64,${buffer.toString('base64')}`;
    }

    // Extract form data
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      fatherName: formData.get('fatherName') as string || undefined,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      dob: formData.get('dob') as string || undefined,
      gender: formData.get('gender') as string,
      bloodGroup: formData.get('bloodGroup') as string || undefined,
      rollNumber: formData.get('rollNumber') as string,
      class: formData.get('class') as string,
      section: formData.get('section') as string || undefined,
      parentGuardianName: formData.get('parentGuardianName') as string || undefined,
      parentPhone: formData.get('parentPhone') as string || undefined,
      schoolId: formData.get('schoolId') as string,
      status: formData.get('status') as string || 'ACTIVE',
      verified: formData.get('verified') === 'true',
    };

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.rollNumber || !data.class || !data.schoolId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate QR Code
    const qrData = JSON.stringify({
      studentName: `${data.firstName} ${data.lastName}`,
      rollNumber: data.rollNumber,
      class: data.class,
      schoolId: data.schoolId,
    });
    const qrCode = await QRCode.toDataURL(qrData);

    // Create student
    const student = await prisma.student.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fatherName: data.fatherName,
        email: data.email,
        phone: data.phone,
        dob: data.dob ? new Date(data.dob) : undefined,
        gender: data.gender as any,
        bloodGroup: data.bloodGroup,
        rollNumber: data.rollNumber,
        class: data.class,
        section: data.section,
        parentGuardianName: data.parentGuardianName,
        parentPhone: data.parentPhone,
        photoUrl,
        qrCode,
        status: data.status as any,
        verified: data.verified,
        schoolId: data.schoolId,
      },
      include: {
        school: {
          select: {
            schoolName: true,
            city: true,
            state: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: student },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating student:', error);

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Roll Number already exists for this school' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create student' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    const students = await prisma.student.findMany({
      where: schoolId ? { schoolId } : undefined,
      include: {
        school: {
          select: {
            schoolName: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: students });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
