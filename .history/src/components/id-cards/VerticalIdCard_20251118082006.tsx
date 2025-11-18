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
    <div className="relative w-56 h-80 rounded-lg overflow-hidden shadow-xl flex items-center justify-center">
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

      {/* Centered Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-900 px-4 py-2 bg-black/5">
        {/* Logo & Card Title */}
        {logoUrl && (
          <div className="w-12 h-12 mb-2 flex items-center justify-center">
            <Image
              src={logoUrl}
              alt="School Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
        <h3 className="text-xs font-bold text-gray-900 mb-2 text-center">{schoolName}</h3>

        {/* Student Photo */}
        {studentPhotoUrl && (
          <div className="w-20 h-24 bg-white rounded-lg mb-2 overflow-hidden shadow-md border-2 border-white flex items-center justify-center">
            <Image
              src={studentPhotoUrl}
              alt="Student"
              width={80}
              height={96}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        )}

        {/* Student Details, Center Aligned */}
        <div className="w-full flex flex-col items-center justify-center text-xs space-y-1 leading-tight">
          <p className="font-bold">{studentName}</p>
          <p>Roll No: {rollNumber}</p>
          <p>Father's Name: {fatherName}</p>
          {dob && <p>DOB: {dob}</p>}
          {gender && <p>Gender: {gender}</p>}
          {bloodGroup && <p>Blood Group: {bloodGroup}</p>}
          {classValue && <p>Class: {classValue}</p>}
          {section && <p>Section: {section}</p>}
          {parentGuardianName && <p>Parent/Guardian: {parentGuardianName}</p>}
          {parentPhone && <p>Phone: {parentPhone}</p>}
          {status && <p>Status: {status}</p>}
          <p>Verified: {verified ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}
