import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const school = await prisma.school.create({
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
        status: body.status || 'active',
        verified: body.verified || false,
        logoUrl: body.logoUrl,
        qrCode: body.qrCode,
        idCardDesignUrl: body.idCardDesignUrl,
        selectLayoutOfIdCard: body.selectLayoutOfIdCard,
        sessionDisplayOnCard: body.sessionDisplayOnCard,
        pdfDownloadAccess: body.pdfDownloadAccess,
        idCardsNoType: body.idCardsNoType,
        session: body.session,
      },
    });

    return NextResponse.json({ success: true, data: school }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating school:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create school' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: schools });
  } catch (error: any) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
