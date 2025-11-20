// src/app/api/students/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch single student by id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        school: {
          select: {
            schoolName: true,
            address: true,
            city: true,
            state: true,
            pinCode: true,
            phoneNo: true,
            email: true,
            website: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// PUT: update student (with photo upload support)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const formData = await request.formData();

    // Handle uploaded photo
    const photoFile = formData.get('photo') as File | null;
    let photoUrl: string | undefined;

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

      const bytes = await photoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      photoUrl = `data:${photoFile.type};base64,${buffer.toString('base64')}`;
    }

    // Build update data
    const data: any = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      fatherName: formData.get('fatherName') as string || undefined,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      dob: formData.get('dob') ? new Date(formData.get('dob') as string) : undefined,
      gender: formData.get('gender') as string,
      bloodGroup: formData.get('bloodGroup') as string || undefined,
      rollNumber: formData.get('rollNumber') as string,
      class: formData.get('class') as string,
      section: formData.get('section') as string || undefined,
      parentGuardianName: formData.get('parentGuardianName') as string || undefined,
      parentPhone: formData.get('parentPhone') as string || undefined,
      status: formData.get('status') as string,
      verified: formData.get('verified') === 'true',
    };

    if (photoUrl) {
      data.photoUrl = photoUrl;
    }

    const student = await prisma.student.update({
      where: { id },
      data,
      include: {
        school: {
          select: {
            schoolName: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    console.error('Error updating student:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Roll Number already exists for this school' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update student' },
      { status: 500 }
    );
  }
}

// DELETE: remove student by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: 'Student deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete student' },
      { status: 500 }
    );
  }
}
