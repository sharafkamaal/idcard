// src/components/IdCardPreviewModal.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface IdCardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolData: {
    schoolName: string;
    logoUrl?: string;
    idCardDesignUrl?: string;
  };
}

export default function IdCardPreviewModal({ isOpen, onClose, schoolData }: IdCardPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add School - Card Design Popup</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* ID Card Preview */}
          <div className="flex justify-center mb-6">
            <div className="relative w-80 h-[500px] bg-white rounded-3xl shadow-xl overflow-hidden px-10 pt-12 pb-14 flex flex-col items-center">
              <div className="absolute inset-y-0 -left-16 w-48 bg-gradient-to-b from-green-500 via-green-400 to-emerald-300 opacity-80 -skew-x-6"></div>
              <div className="absolute inset-y-0 -right-16 w-48 bg-gradient-to-b from-purple-700 via-purple-500 to-purple-400 opacity-80 skew-x-6"></div>
              <div className="relative flex flex-col items-center w-full z-10 gap-8">
                <div className="w-[100px] h-[100px] rounded-full border-[6px] border-green-500 bg-white flex items-center justify-center shadow-md">
                  {schoolData.logoUrl ? (
                    <Image
                      src={schoolData.logoUrl}
                      alt="School Logo"
                      width={88}
                      height={88}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                  )}
                </div>
                <div className="w-full text-center space-y-2">
                  <div className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
                    {schoolData.schoolName || 'SCHOOL NAME'}
                  </div>
                  <div className="mx-auto h-1 w-28 rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-purple-500"></div>
                </div>
                <div className="w-44 h-44 rounded-lg border-[6px] border-purple-500 bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                  {schoolData.idCardDesignUrl ? (
                    <Image
                      src={schoolData.idCardDesignUrl}
                      alt="Student"
                      width={132}
                      height={132}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200"></div>
                  )}
                </div>
                <div className="w-full space-y-4 text-base">
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Student Name</span>
                    <span className="text-lg font-semibold text-gray-900">STUDENT NAME</span>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Roll Number</span>
                    <span className="text-lg font-semibold text-gray-900">MPS-M-001</span>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Father&apos;s Name</span>
                    <span className="text-lg font-semibold text-gray-900">ARMAN AMAN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center text-gray-600 mb-6">
            <p>Your school ID card design has been saved successfully!</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                // Navigate to view page or list
                window.location.href = '/manage-school/list-school';
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Schools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
