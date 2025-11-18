// src/components/id-cards/HorizontalIdCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface HorizontalIdCardProps {
  schoolName: string;
  logoUrl?: string;
  studentPhotoUrl?: string;
  designUrl?: string;
  studentName: string;
  rollNumber: string;
  fatherName: string;
}

export default function HorizontalIdCard({
  schoolName,
  logoUrl,
  studentPhotoUrl,
  designUrl,
  studentName,
  rollNumber,
  fatherName,
}: HorizontalIdCardProps) {
  return (
    <div className="relative w-80 h-56 rounded-lg overflow-hidden shadow-xl">
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
      <div className="absolute inset-0 flex items-center justify-between p-4 bg-black/5">
        {/* Left Section - Photo */}
        <div className="flex flex-col items-center">
          {logoUrl && (
            <div className="w-10 h-10 mb-2 relative">
              <Image
                src={logoUrl}
                alt="School Logo"
                fill
                className="object-contain"
              />
            </div>
          )}
          {studentPhotoUrl && (
            <div className="w-24 h-28 bg-white rounded-lg overflow-hidden shadow-md border-2 border-white">
              <Image
                src={studentPhotoUrl}
                alt="Student"
                width={96}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Right Section - Details */}
        <div className="flex-1 pl-4 text-left space-y-2">
          <h3 className="text-xs font-bold text-gray-900">
            {schoolName}
          </h3>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-900">
              {studentName}
            </p>
            <p className="text-xs text-gray-800">
              Roll: {rollNumber}
            </p>
            <p className="text-xs text-gray-700">
              Father: {fatherName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
