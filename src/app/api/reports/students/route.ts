import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const students = await prisma.student.findMany({
      include: {
        school: {
          select: {
            schoolName: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const studentReports = students.map(student => ({
      id: student.id,
      rollNumber: student.rollNumber,
      studentName: `${student.firstName} ${student.lastName}`,
      idCardsStatus: student.status || 'Not Printed',
      lastExport: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      verified: student.verified,
      schoolLocation: `${student.school.city}`,
    }));

    return NextResponse.json({ success: true, data: studentReports });
  } catch (error: any) {
    console.error('Error fetching student reports:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch student reports' },
      { status: 500 }
    );
  }
}
