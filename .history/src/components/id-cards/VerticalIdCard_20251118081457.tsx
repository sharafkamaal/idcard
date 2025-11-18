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
    <div
      className="relative w-56 h-80 rounded-lg overflow-hidden shadow-xl"
      style={{ width: '224px', height: '320px' }}
    >
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

      {/* Content Overlay with absolute positioning */}
      <div className="absolute inset-0 text-gray-900 px-4 py-3">
        {/* Logo */}
        {logoUrl && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-12">
            <Image
              src={logoUrl}
              alt="School Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        )}

        {/* School Name */}
        <h3 className="absolute top-20 left-0 w-full text-center text-xs font-bold">
          {schoolName}
        </h3>

        {/* Student Photo */}
        {studentPhotoUrl && (
          <div className="absolute top-[110px] left-[24px] w-20 h-24 bg-white rounded-lg overflow-hidden border-2 border-white shadow-md">
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

        {/* Student Details Panel */}
        <div className="absolute top-[110px] left-[110px] w-[90px] space-y-1 text-xs leading-tight">
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
