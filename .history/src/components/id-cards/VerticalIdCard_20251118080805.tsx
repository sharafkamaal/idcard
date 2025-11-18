// src/components/id-cards/VerticalIdCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface Rect {
  top: number; // px
  left: number; // px
  width?: number; // px
  height?: number; // px
}
interface Positions {
  logo?: Rect;
  photo?: Rect;
  name?: Rect;
  roll?: Rect;
  father?: Rect;
}
interface VerticalIdCardProps {
  schoolName: string;
  logoUrl?: string;
  studentPhotoUrl?: string;
  designUrl?: string;
  studentName: string;
  rollNumber: string;
  fatherName: string;
  // NEW: optional positions to control exact placement (px)
  positions?: Positions;
  // NEW: optional container size in px (defaults match w-56 h-80 -> 224x320)
  width?: number;
  height?: number;
}

export default function VerticalIdCard({
  schoolName,
  logoUrl,
  studentPhotoUrl,
  designUrl,
  studentName,
  rollNumber,
  fatherName,
  positions,
  width = 224,
  height = 320,
}: VerticalIdCardProps) {
  // sensible defaults (tweak these to match your template)
  const defaults: Required<Positions> = {
    logo: { top: 12, left: (width - 40) / 2, width: 40, height: 40 },
    photo: { top: 56, left: (width - 80) / 2, width: 80, height: 96 },
    name: { top: 160, left: 12, width: width - 24 },
    roll: { top: 184, left: 12, width: width - 24 },
    father: { top: 204, left: 12, width: width - 24 },
  };

  const p = {
    logo: { ...defaults.logo, ...(positions?.logo ?? {}) },
    photo: { ...defaults.photo, ...(positions?.photo ?? {}) },
    name: { ...defaults.name, ...(positions?.name ?? {}) },
    roll: { ...defaults.roll, ...(positions?.roll ?? {}) },
    father: { ...defaults.father, ...(positions?.father ?? {}) },
  };

  const px = (n?: number) => (n === undefined ? undefined : `${n}px`);

  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-xl"
      style={{ width: px(width), height: px(height) }}
    >
      {/* Background Design (fills entire card) */}
      {designUrl && (
        <div className="absolute inset-0">
          <Image src={designUrl} alt="ID Card Design" fill className="object-cover" />
        </div>
      )}

      {/* Overlay container - transparent so absolute children sit on top of design */}
      <div className="absolute inset-0">
        {/* Logo */}
        {logoUrl && (
          <div
            style={{
              position: 'absolute',
              top: px(p.logo.top),
              left: px(p.logo.left),
              width: px(p.logo.width),
              height: px(p.logo.height),
            }}
          >
            <Image src={logoUrl} alt="School Logo" fill className="object-contain" />
          </div>
        )}

        {/* Student Photo */}
        {studentPhotoUrl && (
          <div
            style={{
              position: 'absolute',
              top: px(p.photo.top),
              left: px(p.photo.left),
              width: px(p.photo.width),
              height: px(p.photo.height),
              overflow: 'hidden',
              borderRadius: 8,
              background: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              border: '2px solid white',
            }}
          >
            <Image src={studentPhotoUrl} alt="Student" fill className="object-cover" />
          </div>
        )}

        {/* Text blocks - positioned absolutely so they don't push other elements */}
        <div
          style={{
            position: 'absolute',
            top: px(p.name.top),
            left: px(p.name.left),
            width: px(p.name.width),
            textAlign: 'left',
          }}
        >
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#111' }}>
            {studentName}
          </p>
        </div>

        <div
          style={{
            position: 'absolute',
            top: px(p.roll.top),
            left: px(p.roll.left),
            width: px(p.roll.width),
            textAlign: 'left',
          }}
        >
          <p style={{ margin: 0, fontSize: 11, color: '#333' }}>Roll: {rollNumber}</p>
        </div>

        <div
          style={{
            position: 'absolute',
            top: px(p.father.top),
            left: px(p.father.left),
            width: px(p.father.width),
            textAlign: 'left',
          }}
        >
          <p style={{ margin: 0, fontSize: 11, color: '#555' }}>{fatherName}</p>
        </div>

        {/* Optional centered school name at very top (keeps flow independent) */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: 0,
            width: px(width),
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#111' }}>{schoolName}</h3>
        </div>
      </div>
    </div>
  );
}
