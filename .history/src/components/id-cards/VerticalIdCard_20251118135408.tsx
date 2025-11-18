"use client";

import React from "react";
import Image from "next/image";

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
}) {
  return (
    <div className="relative w-56 h-80 rounded-lg overflow-hidden shadow-xl">
      {/* Background Design */}
      {designUrl && (
        <Image
          src={designUrl}
          alt="Design"
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col px-3 py-3 bg-black/5">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-2">
          {logoUrl && (
            <div className="w-12 h-12 relative mb-1">
              <Image
                src={logoUrl}
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}

          <h3 className="text-sm font-bold text-center">{schoolName}</h3>
        </div>

        {/* Student Photo */}
        {studentPhotoUrl && (
          <div className="w-20 h-24 mx-auto bg-white rounded-md shadow-md border overflow-hidden mb-3">
            <Image
              src={studentPhotoUrl}
              alt="Student Photo"
              width={80}
              height={96}
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Details */}
        <div className="flex-1 flex flex-col text-xs gap-1 mt-1">
          <p className="font-semibold text-center">{studentName}</p>

          <div className="text-left space-y-0.5">
            <p><span className="font-semibold">Roll No:</span> {rollNumber}</p>
            <p><span className="font-semibold">Father:</span> {fatherName}</p>
            {dob && <p><span className="font-semibold">DOB:</span> {dob}</p>}
            {gender && <p><span className="font-semibold">Gender:</span> {gender}</p>}
            {bloodGroup && <p><span className="font-semibold">Blood:</span> {bloodGroup}</p>}
            {classValue && <p><span className="font-semibold">Class:</span> {classValue}</p>}
            {section && <p><span className="font-semibold">Section:</span> {section}</p>}
            {parentGuardianName && (
              <p><span className="font-semibold">Guardian:</span> {parentGuardianName}</p>
            )}
            {parentPhone && (
              <p><span className="font-semibold">Phone:</span> {parentPhone}</p>
            )}
            {status && (
              <p><span className="font-semibold">Status:</span> {status}</p>
            )}
            <p>
              <span className="font-semibold">Verified:</span>{" "}
              {verified ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
