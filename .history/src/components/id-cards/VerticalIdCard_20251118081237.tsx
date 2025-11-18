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
}

export default function VerticalIdCard({
  schoolName,
  logoUrl,
  studentPhotoUrl,
  designUrl,
  studentName,
  rollNumber,
  fatherName,
}: VerticalIdCardProps) {
  return (
    <div className="relative w-56 h-80 rounded-lg overflow-hidden shadow-xl">
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

      {/* Content Overlay absolute positioned */}
      <div className="absolute inset-0">
        {/* Logo top center */}
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
        <h3 className="absolute top-20 left-0 w-full text-center text-xs font-bold text-gray-900">
          {schoolName}
        </h3>

        {/* Student Photo */}
        {studentPhotoUrl && (
          <div className="absolute top-[110px] left-[32px] w-20 h-24 bg-white rounded-lg overflow-hidden border-2 border-white shadow-md">
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

        {/* Student Name */}
        <p className="absolute top-[220px] left-0 w-full text-center text-xs font-bold text-gray-900">
          {studentName}
        </p>

        {/* Roll Number */}
        <p className="absolute top-[240px] left-0 w-full text-center text-xs text-gray-800">
          Roll: {rollNumber}
        </p>

        {/* Father's Name */}
        <p className="absolute top-[260px] left-0 w-full text-center text-xs text-gray-700">
          {fatherName}
        </p>
      </div>
    </div>
  );
}
