'use client';

import React from 'react';
import Image from 'next/image';

interface VerticalIdCardProps {
  schoolName: string;
  logoUrl?: string;
  studentPhotoUrl?: string;
  designUrl?: string;
  studentName: string;
  rollNumber: string;
  fatherName: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  classValue?: string;
  section?: string;
  parentGuardianName?: string;
  parentPhone?: string;
  status?: string;
  verified?: boolean;
}

export default function VerticalIdCard({
  schoolName,
  logoUrl,
  studentPhotoUrl,
  designUrl,
  studentName,
  rollNumber,
  fatherName,
  dob,
  gender,
  bloodGroup,
  classValue,
  section,
  parentGuardianName,
  parentPhone,
  status,
  verified,
}: VerticalIdCardProps) {
  return (
    <div className="relative w-56 h-80 rounded-lg overflow-hidden shadow-xl bg-white">

      {/* Background Design */}
      {designUrl && (
        <Image
          src={designUrl}
          alt="ID Card Design"
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 px-0 py-0 flex flex-col items-center">

        {/* Logo + School Name */}
        <div className="w-full pt-5 flex flex-col items-center">
          {logoUrl && (
            <div className="w-12 h-12 mb-1 relative">
              <Image
                src={logoUrl}
                alt="School Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
          <h3 className="text-sm font-bold text-gray-900 mb-2 text-center tracking-wide">
            {schoolName}
          </h3>
        </div>

        {/* Student Photo */}
        {studentPhotoUrl && (
          <div className="w-28 h-92 rounded-md mb-3 bg-white overflow-hidden shadow-md border-2 border-blue-700">
            <Image
              src={studentPhotoUrl}
              alt="Student"
              width={112}
              height={128}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        )}

        {/* Details */}
        <div className="w-40 mx-auto flex flex-col items-start justify-start pl-2 pr-2 pt-36 space-y-0.5">

          <p className="text-sm font-bold text-gray-900 leading-tight">
            {studentName}
          </p>

          <p className="text-[11px] text-gray-700 leading-tight">
            Roll No: <span className="font-medium">{rollNumber}</span>
          </p>

          <p className="text-[11px] text-gray-700 leading-tight">
            Father: <span className="font-medium">{fatherName}</span>
          </p>

          {dob && (
            <p className="text-[11px] text-gray-700 leading-tight">
              DOB: <span className="font-medium">{dob}</span>
            </p>
          )}

          {gender && (
            <p className="text-[11px] text-gray-700 leading-tight">
              Gender: <span className="font-medium">{gender}</span>
            </p>
          )}

          {bloodGroup && (
            <p className="text-[11px] text-gray-700 leading-tight">
              Blood: <span className="font-medium">{bloodGroup}</span>
            </p>
          )}

          {classValue && (
            <p className="text-[11px] text-gray-700 leading-tight">
              Class: <span className="font-medium">{classValue}</span>
            </p>
          )}

          {section && (
            <p className="text-[11px] text-gray-700 leading-tight">
              Section: <span className="font-medium">{section}</span>
            </p>
          )}

          {parentGuardianName && (
            <p className="text-[11px] text-gray-700 leading-tight">
              Guardian: <span className="font-medium">{parentGuardianName}</span>
            </p>
          )}

          {parentPhone && (
            <p className="text-[11px] text-gray-700 leading-tight">
              Phone: <span className="font-medium">{parentPhone}</span>
            </p>
          )}

          
        </div> {/* <- details div close */}

      </div> {/* <- overlay close */}

    </div> /* <- main wrapper close */
  );
}
