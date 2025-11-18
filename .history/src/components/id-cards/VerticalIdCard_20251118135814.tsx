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
      {/* Background Design Image */}
      {designUrl && (
        <Image
          src={designUrl}
          alt="ID Card Design"
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 px-0 py-0 flex flex-col items-center">
        {/* Logo & School Name at Top */}
        <div className="w-full pt-5 flex flex-col items-center">
          {logoUrl && (
            <div className="w-12 h-12 mb-1 flex items-center justify-center">
              <Image
                src={logoUrl}
                alt="School Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
          <h3 className="text-sm font-bold text-gray-900 mb-2 text-center tracking-wide">{schoolName}</h3>
        </div>

        {/* Student Photo */}
        {studentPhotoUrl && (
          <div className="w-28 h-32 rounded-md mb-3 bg-white overflow-hidden shadow-md border-2 border-blue-700 flex items-center justify-center">
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

        {/* Details block, start just below photo, left-aligned */}
        <div className="w-48 mx-auto flex flex-col items-start justify-start pl-2 pr-2 pt- space-y-1">
          <p className="text-base font-semibold text-gray-900">{studentName}</p>
          <p className="text-sm text-gray-700">Roll No: <span className="font-medium">{rollNumber}</span></p>
          <p className="text-sm text-gray-700">Father's Name: <span className="font-medium">{fatherName}</span></p>
          {dob && <p className="text-sm text-gray-700">DOB: <span className="font-medium">{dob}</span></p>}
          {gender && <p className="text-sm text-gray-700">Gender: <span className="font-medium">{gender}</span></p>}
          {bloodGroup && <p className="text-sm text-gray-700">Blood Group: <span className="font-medium">{bloodGroup}</span></p>}
          {classValue && <p className="text-sm text-gray-700">Class: <span className="font-medium">{classValue}</span></p>}
          {section && <p className="text-sm text-gray-700">Section: <span className="font-medium">{section}</span></p>}
          {parentGuardianName && <p className="text-sm text-gray-700">Parent/Guardian: <span className="font-medium">{parentGuardianName}</span></p>}
          {parentPhone && <p className="text-sm text-gray-700">Phone: <span className="font-medium">{parentPhone}</span></p>}
          {status && <p className="text-sm text-gray-700">Status: <span className="font-medium">{status}</span></p>}
          <p className="text-sm text-gray-700">Verified: <span className="font-medium">{verified ? 'Yes' : 'No'}</span></p>
        </div>
      </div>
    </div>
  );
}
