// src/components/id-cards/VerticalIdCard.tsx
import Image from 'next/image';
import React from 'react';

interface VerticalIdCardProps {
  schoolName?: string;
  logoUrl?: string;
  studentPhotoUrl?: string;
  studentName?: string;
  rollNumber?: string;
  fatherName?: string;
  designUrl?: string;
}

const VerticalIdCard: React.FC<VerticalIdCardProps> = ({
  schoolName = 'School Name',
  logoUrl,
  studentPhotoUrl,
  studentName = 'STUDENT NAME',
  rollNumber = 'MPS-M-001',
  fatherName = 'FATHER NAME',
  designUrl,
}) => {
  return (
    <div className="w-56 h-80 p-3 rounded-3xl bg-white shadow-md border border-gray-100">
      <div className="relative w-full h-full rounded-3xl bg-white overflow-hidden">
        {designUrl ? (
          <Image src={designUrl} alt="ID Card Design" width={224} height={320} className="w-full h-full object-contain" />
        ) : (
          <>
            <div className="absolute inset-y-0 -left-14 w-40 bg-gradient-to-b from-green-500 via-green-400 to-emerald-300 opacity-80 -skew-x-6"></div>
            <div className="absolute inset-y-0 -right-14 w-40 bg-gradient-to-b from-purple-700 via-purple-500 to-purple-400 opacity-80 skew-x-6"></div>
            <div className="relative z-10 flex flex-col items-center h-full px-5 pt-6 pb-5 gap-4">
              <div className="w-[72px] h-[72px] rounded-full border-[5px] border-green-500 bg-white flex items-center justify-center shadow-md">
                {logoUrl ? (
                  <Image src={logoUrl} alt="School Logo" width={68} height={68} className="rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                )}
              </div>
              <div className="text-center w-full">
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wide leading-tight">
                  {schoolName}
                </div>
                <div className="mt-1 h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-purple-500"></div>
              </div>
              <div className="w-28 h-28 rounded-lg border-[5px] border-purple-500 bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                {studentPhotoUrl ? (
                  <Image src={studentPhotoUrl} alt="Student" width={96} height={96} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-20 h-20 bg-gray-200"></div>
                )}
              </div>
              <div className="w-full space-y-3 text-left">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Student Name</span>
                  <span className="text-xs font-semibold text-gray-900">{studentName}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Roll Number</span>
                  <span className="text-xs font-semibold text-gray-900">{rollNumber}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Father's Name</span>
                  <span className="text-xs font-semibold text-gray-900">{fatherName}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerticalIdCard;
