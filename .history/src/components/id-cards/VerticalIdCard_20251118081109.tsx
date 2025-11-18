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
    <div
      className="relative w-56 h-80 rounded-lg overflow-hidden shadow-xl"
      style={{ width: '224px', height: '320px' }} // fix exact size if needed
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

      {/* Absolute positioned content overlay */}
      <div className="absolute inset-0">
        {/* Logo positioned top-center */}
        {logoUrl && (
          <div
            className="absolute"
            style={{ top: 24, left: '50%', transform: 'translateX(-50%)', width: 48, height: 48 }}
          >
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
        <h3
          className="absolute text-xs font-bold text-gray-900 text-center w-full"
          style={{ top: 80, left: 0 }}
        >
          {schoolName}
        </h3>

        {/* Student Photo */}
        {studentPhotoUrl && (
          <div
            className="absolute bg-white rounded-lg overflow-hidden shadow-md border-2 border-white"
            style={{ top: 110, left: 32, width: 80, height: 96 }}
          >
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
        <p
          className="absolute text-xs font-bold text-gray-900 w-full text-center"
          style={{ top: 220, left: 0 }}
        >
          {studentName}
        </p>

        {/* Roll Number */}
        <p
          className="absolute text-xs text-gray-800 w-full text-center"
          style={{ top: 240, left: 0 }}
        >
          Roll: {rollNumber}
        </p>

        {/* Father's Name */}
        <p
          className="absolute text-xs text-gray-700 w-full text-center"
          style={{ top: 260, left: 0 }}
        >
          {fatherName}
        </p>
      </div>
    </div>
  );
}
