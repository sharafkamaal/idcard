'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import IdCardPreviewModal from '@/components/IdCardPreviewModal';
import { MultiBranchFields } from '@components//MultiBranchFields';
export default function AddSchoolPage() {
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
    idCardDesignUrl: '',
    selectLayoutOfIdCard: 'vertical_id',
    sessionDisplayOnCard: true,
    pdfDownloadAccess: true,
    idCardsNoType: 'Roll No',
    session: '',
  });

  const [logoPreview, setLogoPreview] = useState('');
  const [idCardPreview, setIdCardPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setShowModal(true);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to add school');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
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
      idCardDesignUrl: '',
      selectLayoutOfIdCard: 'vertical_id',
      sessionDisplayOnCard: true,
      pdfDownloadAccess: true,
      idCardsNoType: 'Roll No',
      session: '',
    });
    setLogoPreview('');
    setIdCardPreview('');
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-2">
        <p className="text-sm text-gray-500 mb-2">
          Dashboards / Manage Schools / <span className="text-gray-900 font-medium">Add School</span>
        </p>

      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
        {/* School Profile Section */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-blue-600 mb-6">School Profile</h2>
          <div className="flex gap-4 flex-col md:flex-row">
            {/* Left Column - Logo */}
            <div className="flex flex-col gap-4 items-center md:items-start w-full md:w-60">
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
                />
                <p className="text-xs text-gray-500 mt-3">Logo Size</p>
                <p className="text-xs text-gray-400">(W:200px * H:200px)</p>
              </div>
            </div>

            {/* Middle Column - Form Fields */}
            <div className="flex-1 space-y-1">
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="schoolType"
                        value="single"
                        checked={formData.schoolType === 'single'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                        aria-label="Single school type"
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
                      />
                      <span className="text-sm">Multi Branch</span>
                    </label>
                  </div>
                </div>



                <div>
                  <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="schoolName"
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone No <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phoneNo"
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
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
                    placeholder=""
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                </div>
                <div>
                  <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Pin Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="pinCode"
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                </div>
              </div>

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
                    placeholder=""
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
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <label htmlFor="verificationStatus" className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
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
                    />
                    <span className="text-sm">Inactive</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - ID Card Design */}
            <div className="w-64 mt-8 md:mt-0">
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Live ID Card Preview</h3>
                <div className="w-56 h-80 p-3 rounded-3xl bg-white shadow-md border border-gray-100">
                  <div className="relative w-full h-full rounded-3xl bg-white overflow-hidden">
                    <div className="absolute inset-y-0 -left-14 w-40 bg-gradient-to-b from-green-500 via-green-400 to-emerald-300 opacity-80 -skew-x-6"></div>
                    <div className="absolute inset-y-0 -right-14 w-40 bg-gradient-to-b from-purple-700 via-purple-500 to-purple-400 opacity-80 skew-x-6"></div>
                    <div className="relative z-10 flex flex-col items-center h-full px-5 pt-6 pb-5 gap-4">
                      <div className="w-[72px] h-[72px] rounded-full border-[5px] border-green-500 bg-white flex items-center justify-center shadow-md">
                        {logoPreview ? (
                          <Image src={logoPreview} alt="School Logo" width={68} height={68} className="rounded-full object-cover" />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                        )}
                      </div>
                      <div className="text-center w-full">
                        <div className="text-sm font-bold text-gray-900 uppercase tracking-wide leading-tight">
                          {formData.schoolName || 'School Name'}
                        </div>
                        <div className="mt-1 h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-purple-500"></div>
                      </div>
                      <div className="w-28 h-28 rounded-lg border-[5px] border-purple-500 bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                        {idCardPreview ? (
                          <Image src={idCardPreview} alt="Student" width={96} height={96} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200"></div>
                        )}
                      </div>
                      <div className="w-full space-y-3 text-left">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Student Name</span>
                          <span className="text-xs font-semibold text-gray-900">STUDENT NAME</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Roll Number</span>
                          <span className="text-xs font-semibold text-gray-900">MPS-M-001</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Father's Name</span>
                          <span className="text-xs font-semibold text-gray-900">ARMAN AMAN</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">Upload a student photo to preview inside the card</p>
                <button
                  type="button"
                  onClick={() => idCardInputRef.current?.click()}
                  className="mt-3 px-6 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 flex items-center gap-2"
                  aria-label="Upload student photo"
                >
                  <span>Choose file</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  ref={idCardInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleIdCardUpload}
                  className="hidden"
                  aria-label="Upload student photo"
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
                Select Layout of ID Card <span className="text-red-500">*</span>
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
                  />
                  <span className="text-sm">Disable</span>
                </label>
              </div>
            </div>
            {/* ID Card Number Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ID Cards No type <span className="text-red-500">*</span>
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
                  />
                  <span className="text-sm">Admission No</span>
                </label>
              </div>
            </div>
          </div>
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
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
              aria-label="Reset form"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
              aria-label="Submit school information"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>

      {/* ID Card Preview Modal */}
      <IdCardPreviewModal
        isOpen={showModal}
        onClose={handleModalClose}
        schoolData={{
          schoolName: formData.schoolName,
          logoUrl: logoPreview,
          idCardDesignUrl: idCardPreview,
        }}
      />
      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">

      </div>
    </div>
  );
}