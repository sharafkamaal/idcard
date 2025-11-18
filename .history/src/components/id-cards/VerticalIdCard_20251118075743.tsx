// src/components/id-cards/VerticalIdCard.tsx
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
        />
      )}
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-start p-4 bg-black/5">
        {/* Logo */}
        {logoUrl && (
          <div className="w-12 h-12 mb-2 relative">
            <Image
              src={logoUrl}
              alt="School Logo"
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* School Name */}
        <h3 className="text-xs font-bold text-gray-900 mb-3 text-center">
          {schoolName}
        </h3>

        {/* Student Photo */}
        {studentPhotoUrl && (
          <div className="w-20 h-24 bg-white rounded-lg mb-3 overflow-hidden shadow-md border-2 border-white">
            <Image
              src={studentPhotoUrl}
              alt="Student"
              width={80}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Student Details */}
        <div className="text-center space-y-1">
          <p className="text-xs font-bold text-gray-900">
            {studentName}
          </p>
          <p className="text-xs text-gray-800">
            Roll: {rollNumber}
          </p>
          <p className="text-xs text-gray-700">
            {fatherName}
          </p>
        </div>
      </div>
    </div>
  );
}
