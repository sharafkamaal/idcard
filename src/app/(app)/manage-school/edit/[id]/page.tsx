// src/app/(app)/manage-school/edit/[id]/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import QRCode from 'qrcode';

export default function EditSchoolPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    schoolType: 'single',
    schoolName: '',
    phoneNo: '',
    altPhoneNo: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    schoolPointOfContact: '',
    pointOfContactPhone: '',
    status: 'active',
    verified: false,
    logoUrl: '',
    qrCode: '',
    idCardDesignUrl: '',
    selectLayoutOfIdCard: 'vertical_id',
    sessionDisplayOnCard: true,
    pdfDownloadAccess: true,
    idCardsNoType: 'Roll No',
    session: '',
  });

  const [logoPreview, setLogoPreview] = useState('');
  const [qrCodePreview, setQrCodePreview] = useState('');
  const [idCardPreview, setIdCardPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await fetch(`/api/schools/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setFormData(data.data);
          setLogoPreview(data.data.logoUrl || '');
          setQrCodePreview(data.data.qrCode || '');
          setIdCardPreview(data.data.idCardDesignUrl || '');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'radio') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
      setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleIdCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setIdCardPreview(reader.result as string);
      setFormData((prev) => ({ ...prev, idCardDesignUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const generateQRCode = async () => {
    try {
      const qrData = JSON.stringify({
        schoolName: formData.schoolName,
        phone: formData.phoneNo,
        address: formData.address,
      });
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);
      setQrCodePreview(qrCodeDataUrl);
      setFormData((prev) => ({ ...prev, qrCode: qrCodeDataUrl }));
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/schools/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert('School updated successfully!');
        router.push(`/manage-school/view/${params.id}`);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating school:', error);
      alert('Failed to update school');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Dashboards / Manage Schools / <span className="text-gray-900 font-medium">Edit School</span>
        </p>
        <h1 className="text-xl font-semibold text-gray-800">EDIT SCHOOL</h1>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
        {/* School Profile Section */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-blue-600 mb-6">School Profile</h2>

          <div className="flex gap-8">
            {/* Left Column - Logo & QR Code */}
            <div className="flex flex-col gap-6">
              {/* Logo Upload */}
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white overflow-hidden">
                  {logoPreview ? (
                    <Image src={logoPreview} alt="School Logo" width={140} height={140} className="object-cover rounded-full" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 shadow-lg"
                    aria-label="Edit school logo"
                    title="Edit school logo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  aria-label="Upload school logo"
                  title="Upload school logo file"
                />
                <p className="text-xs text-gray-500 mt-3">Logo Size</p>
                <p className="text-xs text-gray-400">(W:200px * H:200px)</p>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 mb-3">School QR Code</label>
                <div className="w-40 h-40 border-2 border-blue-400 rounded-lg flex items-center justify-center bg-white p-2">
                  {qrCodePreview ? (
                    <Image src={qrCodePreview} alt="School QR Code" width={140} height={140} className="object-contain" />
                  ) : (
                    <div className="w-full h-full bg-black opacity-80"></div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={generateQRCode}
                  className="mt-3 px-6 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  aria-label="Generate and download QR code"
                >
                  Download QR
                </button>
              </div>
            </div>

            {/* Middle Column - Form Fields */}
            <div className="flex-1 space-y-6">
              {/* School Type & Name Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Type <span className="text-blue-400">⚡</span>
                  </label>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="schoolType"
                        value="single"
                        checked={formData.schoolType === 'single'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                        aria-label="Single school type"
                        title="Single school type"
                      />
                      <span className="text-sm">Single</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="schoolType"
                        value="multiBranch"
                        checked={formData.schoolType === 'multiBranch'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                        aria-label="Multi branch school type"
                        title="Multi branch school type"
                      />
                      <span className="text-sm">Multi Branch</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
                    School Name <span className="text-blue-400">⚡</span>
                  </label>
                  <input
                    id="schoolName"
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Phone Numbers Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone No <span className="text-blue-400">⚡</span>
                  </label>
                  <input
                    id="phoneNo"
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="altPhoneNo" className="block text-sm font-medium text-gray-700 mb-2">
                    Alt - Phone No
                  </label>
                  <input
                    id="altPhoneNo"
                    type="tel"
                    name="altPhoneNo"
                    value={formData.altPhoneNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Address & City Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-blue-400">⚡</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-blue-400">⚡</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* State & Pin Code Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-blue-400">⚡</span>
                  </label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Pin Code <span className="text-blue-400">⚡</span>
                  </label>
                  <input
                    id="pinCode"
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Point of Contact Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="schoolPointOfContact" className="block text-sm font-medium text-gray-700 mb-2">
                    School Point of Contact
                  </label>
                  <input
                    id="schoolPointOfContact"
                    type="text"
                    name="schoolPointOfContact"
                    value={formData.schoolPointOfContact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="pointOfContactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Point of Contact Phone No
                  </label>
                  <input
                    id="pointOfContactPhone"
                    type="tel"
                    name="pointOfContactPhone"
                    value={formData.pointOfContactPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status Section */}
              <div>
                <label htmlFor="verificationStatus" className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-blue-400">⚡</span>
                </label>
                <div className="flex items-center gap-6">
                  <select
                    id="verificationStatus"
                    value={formData.verified ? 'verified' : 'unverified'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, verified: e.target.value === 'verified' }))}
                    className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Verification status"
                  >
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                      aria-label="Active status"
                      title="Active status"
                    />
                    <span className="text-sm">Active</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                      aria-label="Inactive status"
                      title="Inactive status"
                    />
                    <span className="text-sm">Inactive</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - ID Card Design */}
            <div className="w-64">
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Your School ID Card Design</h3>
                <div className="w-56 h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 p-4">
                  {idCardPreview ? (
                    <Image src={idCardPreview} alt="ID Card Design" width={200} height={300} className="object-contain" />
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
                <button
                  type="button"
                  onClick={() => idCardInputRef.current?.click()}
                  className="mt-3 px-6 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                  aria-label="Choose ID card design file"
                >
                  Choose file
                </button>
                <input
                  ref={idCardInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleIdCardUpload}
                  className="hidden"
                  aria-label="Upload ID card design"
                  title="Upload ID card design file"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-6">Permissions</h2>

          <div className="grid grid-cols-4 gap-6">
            {/* Layout Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Layout of ID Card <span className="text-blue-400">⚡</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="selectLayoutOfIdCard"
                    value="vertical_id"
                    checked={formData.selectLayoutOfIdCard === 'vertical_id'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                    aria-label="Vertical ID layout"
                    title="Vertical ID layout"
                  />
                  <span className="text-sm">Vertical id</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="selectLayoutOfIdCard"
                    value="horizontal_id"
                    checked={formData.selectLayoutOfIdCard === 'horizontal_id'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                    aria-label="Horizontal ID layout"
                    title="Horizontal ID layout"
                  />
                  <span className="text-sm">Horizontal id</span>
                </label>
              </div>
            </div>

            {/* Session Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Session Display on ID Card
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sessionDisplayOnCard"
                    value="yes"
                    checked={formData.sessionDisplayOnCard}
                    onChange={() => setFormData((prev) => ({ ...prev, sessionDisplayOnCard: true }))}
                    className="w-4 h-4 text-blue-600"
                    aria-label="Show session on card"
                    title="Show session on card"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sessionDisplayOnCard"
                    value="no"
                    checked={!formData.sessionDisplayOnCard}
                    onChange={() => setFormData((prev) => ({ ...prev, sessionDisplayOnCard: false }))}
                    className="w-4 h-4 text-blue-600"
                    aria-label="Hide session on card"
                    title="Hide session on card"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>

            {/* PDF Download */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                PDF Download Access
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pdfDownloadAccess"
                    value="enable"
                    checked={formData.pdfDownloadAccess}
                    onChange={() => setFormData((prev) => ({ ...prev, pdfDownloadAccess: true }))}
                    className="w-4 h-4 text-blue-600"
                    aria-label="Enable PDF download"
                    title="Enable PDF download"
                  />
                  <span className="text-sm">Enable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pdfDownloadAccess"
                    value="disable"
                    checked={!formData.pdfDownloadAccess}
                    onChange={() => setFormData((prev) => ({ ...prev, pdfDownloadAccess: false }))}
                    className="w-4 h-4 text-blue-600"
                    aria-label="Disable PDF download"
                    title="Disable PDF download"
                  />
                  <span className="text-sm">Disable</span>
                </label>
              </div>
            </div>

            {/* ID Card Number Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ID Cards No type <span className="text-blue-400">⚡</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="idCardsNoType"
                    value="Roll No"
                    checked={formData.idCardsNoType === 'Roll No'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                    aria-label="Use Roll No"
                    title="Use Roll No"
                  />
                  <span className="text-sm">Roll No</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="idCardsNoType"
                    value="Admission No"
                    checked={formData.idCardsNoType === 'Admission No'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                    aria-label="Use Admission No"
                    title="Use Admission No"
                  />
                  <span className="text-sm">Admission No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Session Dropdown */}
          <div className="mt-6">
            <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-2">
              Session
            </label>
            <select
              id="session"
              name="session"
              value={formData.session}
              onChange={handleChange}
              className="w-64 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select session"
            >
              <option value="">Select Session</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.push(`/manage-school/view/${params.id}`)}
              className="px-8 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Update'}
            </button>
            {/* Footer */}
            <div className="text-center text-sm text-gray-500">
              2025 © Wezant. Design & Developed by ❤️ Zenoids
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
