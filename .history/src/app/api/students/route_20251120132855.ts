import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch a single student by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch student' }, { status: 500 });
  }
}

// PUT: Update status/verified for a student
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { status, verified } = await request.json();

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        status,                  // String, e.g. 'Printed'
        verified: !!verified,    // Boolean
      },
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

    return NextResponse.json({ success: true, data: updatedStudent }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating student:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update student' }, { status: 500 });
  }
}
