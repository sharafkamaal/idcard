// app/(app)/manage-school/view/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

export default function SchoolViewPage() {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await fetch(`/api/schools/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setSchool(data.data);
        }
      } catch (error) {
        console.error('Error fetching school:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSchool();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!school) {
    return <div>School not found</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Dashboards / Manage Schools / <span className="text-gray-900 font-medium">Add School</span>
        </p>
        <h1 className="text-xl font-semibold text-gray-800">ADD SCHOOL</h1>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* School Profile Section */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-blue-600 mb-6">School Profile</h2>

          <div className="flex gap-8">
            {/* Left Column - Logo & QR Code */}
            <div className="flex flex-col gap-6">
              {/* Logo */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white overflow-hidden">
                  {school.logoUrl ? (
                    <Image src={school.logoUrl} alt="School Logo" width={140} height={140} className="object-cover rounded-full" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                  )}
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 mb-3">School QR Code</label>
                <div className="w-40 h-40 border-2 border-blue-400 rounded-lg flex items-center justify-center bg-white p-2">
                  {school.qrCode ? (
                    <Image src={school.qrCode} alt="QR Code" width={140} height={140} className="object-contain" />
                  ) : (
                    <div className="w-full h-full bg-black opacity-80"></div>
                  )}
                </div>
                <button
                  type="button"
                  className="mt-3 px-6 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Download QR
                </button>
              </div>
            </div>

            {/* Middle Column - School Details */}
            <div className="flex-1">
              {/* School Name & Status */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-semibold text-gray-800">{school.schoolName}</h3>
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {school.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Type: </span>
                    <span className="font-medium">{school.schoolType === 'single' ? 'Single' : 'Multi Branch'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Term: </span>
                    <span className="font-medium">{school.session || '2025 - 2026'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Code: </span>
                    <span className="font-medium">{school.code || school.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* Address Section */}
              <div className="mb-4">
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Address: </span>{school.address || 'N/A'}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">City: </span>{school.city || 'N/A'}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">State: </span>{school.state || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Pincode: </span>{school.pinCode || 'N/A'}
                  </p>
                </div>
              </div>

              <hr className="my-4" />

              {/* Contact Section */}
              <div className="mb-4">
                <div className="text-sm space-y-1">
                  <p className="text-gray-600">
                    <span className="font-medium">Email: </span>{school.email || 'info@school.com'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone: </span>{school.phoneNo || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Cell: </span>{school.altPhoneNo || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Website: </span>{school.website || 'www.school.com'}
                  </p>
                </div>
              </div>

              <hr className="my-4" />

              {/* Point of Contacts */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Point of Contacts</h4>
                <div className="text-sm space-y-1">
                  <p className="text-gray-600">
                    <span className="font-medium">Name: </span>{school.schoolPointOfContact || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone No: </span>{school.pointOfContactPhone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - ID Card & Stats */}
            <div className="w-64">
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Your School ID Card Design</h3>
                <div className="w-56 h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 p-4 mb-4">
                  {school.idCardDesignUrl ? (
                    <Image src={school.idCardDesignUrl} alt="ID Card Design" width={200} height={300} className="object-contain" />
                  ) : (
                    <div className="text-center">
                      <div className="w-32 h-48 mx-auto bg-gradient-to-b from-purple-300 via-blue-300 to-blue-400 rounded-lg shadow-md flex flex-col items-center justify-start p-3">
                        <div className="text-purple-700 font-bold text-xs mb-2">SCHOOL NAME</div>
                        <div className="w-16 h-16 bg-white rounded mb-2"></div>
                        <div className="text-xs font-semibold">STUDENT NAME</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Statistics Cards */}
                <div className="w-full space-y-3">
                  <div className="border border-gray-300 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total No of Students:</span>
                    <span className="text-sm font-bold">822</span>
                  </div>
                  <div className="border border-green-300 rounded-lg p-3 flex justify-between items-center bg-green-50">
                    <span className="text-sm font-medium text-gray-700">Printed Id Cards</span>
                    <span className="text-sm font-bold">22</span>
                  </div>
                  <div className="border border-red-300 rounded-lg p-3 flex justify-between items-center bg-red-50">
                    <span className="text-sm font-medium text-gray-700">Rejected Id Cards</span>
                    <span className="text-sm font-bold">800</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-6">Permissions</h2>

          <div className="grid grid-cols-4 gap-8">
            {/* Layout of ID Card */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Layout of ID Card</label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={school.selectLayoutOfIdCard === 'vertical_id'}
                  readOnly
                  className="w-4 h-4 text-blue-600"
                  aria-label="Vertical ID card layout"
                  title="ID card layout type"
                />
                <span className="text-sm text-blue-600">Vertical id</span>
              </div>
            </div>

            {/* Session Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Session Display on ID Card</label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={school.sessionDisplayOnCard}
                  readOnly
                  className="w-4 h-4 text-blue-600"
                  aria-label="Session display on ID card"
                  title="Session display setting"
                />
                <span className="text-sm text-blue-600">{school.sessionDisplayOnCard ? 'Yes' : 'No'}</span>
              </div>
            </div>

            {/* PDF Download Access */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">PDF Download Access</label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={school.pdfDownloadAccess}
                  readOnly
                  className="w-4 h-4 text-blue-600"
                  aria-label="PDF download access"
                  title="PDF download permission"
                />
                <span className="text-sm text-blue-600">{school.pdfDownloadAccess ? 'Enable' : 'Disable'}</span>
              </div>
            </div>

            {/* ID Cards No type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ID Cards No type <span className="text-blue-400">⚡</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={school.idCardsNoType === 'Roll No'}
                  readOnly
                  className="w-4 h-4 text-blue-600"
                  aria-label="ID card number type"
                  title="ID card numbering system"
                />
                <span className="text-sm text-blue-600">{school.idCardsNoType}</span>
              </div>
            </div>
          </div>

          {/* Session */}
          <div className="mt-6">
            <label htmlFor="sessionInput" className="block text-sm font-medium text-gray-700 mb-2">Session</label>
            <input
              id="sessionInput"
              type="text"
              value={school.session || '2025-2026'}
              readOnly
              className="w-64 px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
              aria-label="Academic session"
              title="Academic session year"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.push('/manage-school')}
              className="px-8 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => router.push(`/manage-school/edit/${school.id}`)}
              className="px-8 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
