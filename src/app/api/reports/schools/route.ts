import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const schools = await prisma.school.findMany({
      include: {
        _count: {
          select: { students: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const schoolReports = schools.map(school => ({
      id: school.id,
      schoolName: school.schoolName,
      schoolCode: school.code || '',
      schoolLocation: `${school.city || ''}`,
      schoolType: school.schoolType || '',
      status: school.status || 'inactive',
      lastExport: new Date().toLocaleDateString('en-GB'),
      totalStudents: school._count.students,
    }));

    return NextResponse.json({ success: true, data: schoolReports });
  } catch (error: any) {
    console.error('Error fetching school reports:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch school reports' },
      { status: 500 }
    );
  }
}
