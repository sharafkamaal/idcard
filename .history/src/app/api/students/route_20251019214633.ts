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

    // Extract and validate required fields
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const rollNumber = formData.get('rollNumber') as string;
    const classValue = formData.get('class') as string;
    const gender = formData.get('gender') as string;
    const schoolId = formData.get('schoolId') as string;

    // Validate required fields
    if (!firstName || !lastName || !rollNumber || !classValue || !schoolId || !gender) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: firstName, lastName, rollNumber, class, gender, and schoolId are required' },
        { status: 400 }
      );
    }

    // Extract optional fields (only include if they have values)
    const dobString = formData.get('dob') as string | null;
    const fatherName = formData.get('fatherName') as string | null;
    const email = formData.get('email') as string | null;
    const phone = formData.get('phone') as string | null;
    const bloodGroup = formData.get('bloodGroup') as string | null;
    const section = formData.get('section') as string | null;
    const parentGuardianName = formData.get('parentGuardianName') as string | null;
    const parentPhone = formData.get('parentPhone') as string | null;
    const statusValue = formData.get('status') as string | null;
    const verifiedValue = formData.get('verified') as string | null;

    // Generate QR Code
    const qrData = JSON.stringify({
      studentName: `${firstName} ${lastName}`,
      rollNumber: rollNumber,
      class: classValue,
      schoolId: schoolId,
    });
    const qrCode = await QRCode.toDataURL(qrData);

    // Build data object - only include fields that have values
    const studentData: any = {
      firstName,
      lastName,
      rollNumber,
      class: classValue,
      gender,
      schoolId,
      qrCode,
      status: statusValue || 'ACTIVE',
      verified: verifiedValue === 'true',
    };

    // Add optional fields only if they have values
    if (photoUrl) studentData.photoUrl = photoUrl;
    if (fatherName) studentData.fatherName = fatherName;
    if (email) studentData.email = email;
    if (phone) studentData.phone = phone;
    if (dobString) studentData.dob = new Date(dobString);
    if (bloodGroup) studentData.bloodGroup = bloodGroup;
    if (section) studentData.section = section;
    if (parentGuardianName) studentData.parentGuardianName = parentGuardianName;
    if (parentPhone) studentData.parentPhone = parentPhone;

    // Create student
    const student = await prisma.student.create({
      data: studentData,
      include: {
        school: {
          select: {
            schoolName: true,
            address: true,
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
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};
    
    if (schoolId) {
      where.schoolId = schoolId;
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { rollNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        school: {
          select: {
            schoolName: true,
            address: true,
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
