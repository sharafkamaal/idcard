// src/components/id-cards/HorizontalIdCard.tsx
import Image from 'next/image';
import React from 'react';

interface HorizontalIdCardProps {
  schoolName?: string;
  logoUrl?: string;
  studentPhotoUrl?: string;
  studentName?: string;
  rollNumber?: string;
  fatherName?: string;
  designUrl?: string;
}

const HorizontalIdCard: React.FC<HorizontalIdCardProps> = ({
  schoolName = 'School Name',
  logoUrl,
  studentPhotoUrl,
  studentName = 'STUDENT NAME',
  rollNumber = 'MPS-M-001',
  fatherName = 'FATHER NAME',
  designUrl,
}) => {
  return (
    <div className="w-80 h-56 p-3 rounded-2xl bg-white shadow-md border border-gray-100">
      <div className="relative w-full h-full rounded-2xl bg-white overflow-hidden">
        {designUrl ? (
          <Image src={designUrl} alt="ID Card Design" width={320} height={224} className="w-full h-full object-contain" />
        ) : (
          <>
            <div className="absolute inset-x-0 -top-10 h-24 bg-gradient-to-r from-green-500 via-green-400 to-emerald-300 opacity-80 -skew-y-6"></div>
            <div className="absolute inset-x-0 -bottom-10 h-24 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-400 opacity-80 skew-y-6"></div>
            <div className="relative z-10 flex items-center h-full px-5 py-6 gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full border-4 border-green-500 bg-white flex items-center justify-center shadow-md">
                  {logoUrl ? (
                    <Image src={logoUrl} alt="School Logo" width={72} height={72} className="rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  )}
                </div>
                <div className="w-24 h-24 rounded-lg border-4 border-purple-500 bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                  {studentPhotoUrl ? (
                    <Image src={studentPhotoUrl} alt="Student" width={88} height={88} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200"></div>
                  )}
                </div>
              </div>
              <div className="flex-1 text-left space-y-2">
                <div className="text-center w-full">
                  <div className="text-lg font-bold text-gray-900 uppercase tracking-wide leading-tight">
                    {schoolName}
                  </div>
                  <div className="mt-1 h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-purple-500"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Student Name</span>
                    <span className="text-sm font-semibold text-gray-900">{studentName}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Roll Number</span>
                    <span className="text-sm font-semibold text-gray-900">{rollNumber}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Father's Name</span>
                    <span className="text-sm font-semibold text-gray-900">{fatherName}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HorizontalIdCard;
