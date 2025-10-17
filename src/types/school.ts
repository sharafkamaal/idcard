export type SchoolType = 'SINGLE' | 'MULTI_BRANCH';

export type SchoolStatus = 'ACTIVE' | 'INACTIVE' | 'VERIFIED';

export interface School {
    id: string;
    name: string;
    type: SchoolType;
    code: string;
    phoneNo: string;
    altPhoneNo?: string | null;
    email?: string | null;
    website?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    pinCode?: string | null;
    contactName?: string | null;
    contactPhone?: string | null;
    logoUrl?: string | null;
    qrCodeUrl?: string | null;
    idCardDesignUrl?: string | null;
    status: SchoolStatus;
    isVerified: boolean;
    layoutType: string;
    sessionDisplayOnCard: boolean;
    pdfDownloadAccess: boolean;
    idCardsType: string;
    currentSession?: string | null;
    totalStudents: number;
    printedCards: number;
    rejectedCards: number;
    createdAt: string;
    updatedAt: string;
}