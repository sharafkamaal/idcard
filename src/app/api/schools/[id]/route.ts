import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const school = await prisma.school.findUnique({
      where: { id },
      include: { branches: true },
    });

    if (!school) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: school });
  } catch (error: any) {
    console.error('Error fetching school:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await request.json();

    // Check if school exists
    const existingSchool = await prisma.school.findUnique({
      where: { id },
      include: { branches: true },
    });

    if (!existingSchool) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      );
    }

    // Update school with branches
    const school = await prisma.school.update({
      where: { id },
      data: {
        schoolType: body.schoolType,
        schoolName: body.schoolName,
        phoneNo: body.phoneNo,
        altPhoneNo: body.altPhoneNo,
        address: body.address,
        city: body.city,
        state: body.state,
        pinCode: body.pinCode,
        schoolPointOfContact: body.schoolPointOfContact,
        pointOfContactPhone: body.pointOfContactPhone,
        status: body.status,
        verified: body.verified,
        logoUrl: body.logoUrl,
        qrCode: body.qrCode,
        idCardDesignUrl: body.idCardDesignUrl,
        selectLayoutOfIdCard: body.selectLayoutOfIdCard,
        sessionDisplayOnCard: body.sessionDisplayOnCard,
        pdfDownloadAccess: body.pdfDownloadAccess,
        idCardsNoType: body.idCardsNoType,
        session: body.session,
        email: body.email,
        website: body.website,
        code: body.code,
        term: body.term,
        branches: body.branches ? {
          deleteMany: {},
          create: body.branches.map((branch: any) => ({
            name: branch.name,
            address: branch.address,
          })),
        } : undefined,
      },
      include: { branches: true },
    });

    return NextResponse.json({ success: true, data: school });
  } catch (error: any) {
    console.error('Error updating school:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update school' },
      { status: 500 }
    );
  }
}
