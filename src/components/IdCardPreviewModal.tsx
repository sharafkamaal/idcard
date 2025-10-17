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
            {schoolData.idCardDesignUrl ? (
              <div className="relative w-80 h-[500px]">
                <Image
                  src={schoolData.idCardDesignUrl}
                  alt="ID Card Design"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-80 h-[500px] bg-gradient-to-b from-purple-300 via-blue-300 to-blue-400 rounded-lg shadow-lg p-6 flex flex-col items-center">
                {/* School Logo */}
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4">
                  {schoolData.logoUrl ? (
                    <Image
                      src={schoolData.logoUrl}
                      alt="School Logo"
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  )}
                </div>

                {/* School Name */}
                <div className="text-red-600 font-bold text-lg mb-6 text-center">
                  {schoolData.schoolName || 'SCHOOL NAME'}
                </div>

                {/* Student Photo Placeholder */}
                <div className="w-32 h-40 bg-white rounded-lg border-4 border-teal-400 mb-4 flex items-center justify-center">
                  <div className="w-28 h-36 bg-gray-200 rounded"></div>
                </div>

                {/* Student Info */}
                <div className="text-center space-y-1 text-sm">
                  <div className="text-blue-600 font-semibold">STUDENT ID: MPS-M-001</div>
                  <div className="font-bold text-gray-800">STUDENT NAME</div>
                  <div className="text-xs text-gray-700">Father's Name: ARMAN AMAN</div>
                  <div className="text-xs text-gray-700">Mother's Name: AMNA</div>
                  <div className="text-xs text-gray-700">Class Roll: DY25</div>
                </div>
              </div>
            )}
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
