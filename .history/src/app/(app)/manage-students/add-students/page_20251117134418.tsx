// src/app/(app)/manage-students/add/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import VerticalIdCard from '@/components/id-cards/VerticalIdCard';
import HorizontalIdCard from '@/components/id-cards/HorizontalIdCard';

interface School {
  id: string;
  schoolName: string;
  logoUrl?: string;
  idCardDesignUrl?: string;
  selectLayoutOfIdCard?: string;
  sessionDisplayOnCard?: boolean;
  pdfDownloadAccess?: boolean;
  idCardsNoType?: string;
  session?: string;
}

export default function AddStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    bloodGroup: '',
    rollNumber: '',
    class: '',
    section: '',
    parentGuardianName: '',
    parentPhone: '',
    schoolId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    verified: false,
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolDesign, setSelectedSchoolDesign] = useState<School | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools');
      const data = await response.json();
      if (data.success) {
        setSchools(data.data);
        if (data.data.length > 0) {
          const defaultSchool = data.data[0];
          setFormData(prev => ({ ...prev, schoolId: defaultSchool.id }));
          setSelectedSchoolDesign(defaultSchool);
        }
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Update selected school design when school changes
    if (name === 'schoolId') {
      const selectedSchool = schools.find(school => school.id === value);
      setSelectedSchoolDesign(selectedSchool || null);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Photo size must be less than 5MB' }));
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, photo: 'Photo must be JPEG or PNG' }));
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    if (errors.photo) {
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }
    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    }
    if (!formData.schoolId) {
      newErrors.schoolId = 'School is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }

      const response = await fetch('/api/students', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Student added successfully!');
        router.push(`/manage-students/view/${data.data.id}`);
      } else {
        toast.error(data.error || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const defaultSchool = schools[0];
    setFormData({
      firstName: '',
      lastName: '',
      fatherName: '',
      email: '',
      phone: '',
      dob: '',
      gender: 'MALE',
      bloodGroup: '',
      rollNumber: '',
      class: '',
      section: '',
      parentGuardianName: '',
      parentPhone: '',
      schoolId: defaultSchool?.id || '',
      status: 'ACTIVE',
      verified: false,
    });
    setSelectedSchoolDesign(defaultSchool || null);
    setPhotoPreview('');
    setPhotoFile(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-4 md:py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            Dashboards / Manage Students /{' '}
            <span className="text-gray-900 font-semibold">Add Student</span>
          </p>
        </div>

        {/* Main Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Student Profile Section */}
          <div className="p-3 md:p-4 lg:p-5 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-lg">📋</span>
              </div>
              Student Profile
            </h2>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
              {/* Left Column - Photo & QR Code */}
              <div className="xl:col-span-2 flex flex-col gap-8">
                {/* Photo Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-48 rounded-xl border-4 border-gray-200 flex items-center justify-center bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    {photoPreview ? (
                      <Image
                        src={photoPreview}
                        alt="Student Photo"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="absolute bottom-3 right-3 bg-blue-600 text-white rounded-full p-2.5 hover:bg-blue-700 shadow-lg transition-all transform hover:scale-110"
                      aria-label="Edit student photo"
                      title="Edit student photo"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    aria-label="Upload student photo"
                  />
                  <p className="text-xs text-gray-700 mt-3 font-semibold">
                    PHOTO (1.5 inches x 2 inches)
                  </p>
                  <p className="text-xs text-gray-500">(W:150px * H:200px)</p>
                  {errors.photo && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.photo}
                    </p>
                  )}
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <label className="text-sm font-semibold text-gray-700 mb-3">
                    Student QR Code
                  </label>
                  <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white p-3 shadow-md">
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center rounded-lg">
                      <span className="text-xs text-gray-500 text-center px-3">
                        Generated after save
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-4 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Download QR
                  </button>
                </div>
              </div>

              {/* Middle Column - Form Fields */}
              <div className="xl:col-span-5 space-y-5">
                {/* Student Full Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="First Name"
                        required
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="Last Name"
                        required
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Father's Name */}
                <div>
                  <label htmlFor="fatherName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Father's Name
                  </label>
                  <input
                    id="fatherName"
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="Father's Name"
                  />
                </div>

                {/* Roll No & DOB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="rollNumber"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Roll No <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="rollNumber"
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.rollNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Roll Number"
                      required
                    />
                    {errors.rollNumber && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.rollNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="dob"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Gender & Blood Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="MALE"
                          checked={formData.gender === 'MALE'}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          aria-label="Male"
                        />
                        <span className="text-sm font-medium">Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="FEMALE"
                          checked={formData.gender === 'FEMALE'}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          aria-label="Female"
                        />
                        <span className="text-sm font-medium">Female</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="bloodGroup"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Class & Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="class"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Class <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="class"
                      type="text"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.class ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Class"
                      required
                    />
                    {errors.class && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.class}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="section"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Section
                    </label>
                    <input
                      id="section"
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      placeholder="Section"
                    />
                  </div>
                </div>

                {/* Parent/Guardian Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="parentGuardianName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Parent/Guardian Name
                    </label>
                    <input
                      id="parentGuardianName"
                      type="text"
                      name="parentGuardianName"
                      value={formData.parentGuardianName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      placeholder="Parent/Guardian Name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="parentPhone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Parents/Guardian Phone No
                    </label>
                    <input
                      id="parentPhone"
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.parentPhone ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="10 digit phone number"
                    />
                    {errors.parentPhone && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.parentPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <select
                      value={formData.verified ? 'verified' : 'unverified'}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          verified: e.target.value === 'verified',
                        }))
                      }
                      className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      aria-label="Verification status"
                    >
                      <option value="verified">Verified</option>
                      <option value="unverified">Unverified</option>
                    </select>

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="ACTIVE"
                          checked={formData.status === 'ACTIVE'}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          aria-label="Active status"
                        />
                        <span className="text-sm font-medium">Active</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="INACTIVE"
                          checked={formData.status === 'INACTIVE'}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          aria-label="Inactive status"
                        />
                        <span className="text-sm font-medium">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - ID Card Preview */}
              <div className="flex-2 space-y-2">
                <div className="flex flex-col items-center sticky top-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">
                    Your School ID Card Design
                  </h3>
                  <div className="w-64 h-80 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6 shadow-inner">
                    {selectedSchoolDesign ? (
                      selectedSchoolDesign.selectLayoutOfIdCard === 'horizontal_id' ? (
                        <HorizontalIdCard
                          schoolName={selectedSchoolDesign.schoolName || 'School Name'}
                          logoUrl={selectedSchoolDesign.logoUrl}
                          studentPhotoUrl={photoPreview}
                          designUrl={selectedSchoolDesign.idCardDesignUrl}
                          studentName={`${formData.firstName} ${formData.lastName}`.trim() || 'STUDENT NAME'}
                          rollNumber={formData.rollNumber || 'N/A'}
                          fatherName={formData.fatherName || 'FATHER NAME'}
                        />
                      ) : (
                        <VerticalIdCard
                          schoolName={selectedSchoolDesign.schoolName || 'School Name'}
                          logoUrl={selectedSchoolDesign.logoUrl}
                          studentPhotoUrl={photoPreview}
                          designUrl={selectedSchoolDesign.idCardDesignUrl}
                          studentName={`${formData.firstName} ${formData.lastName}`.trim() || 'STUDENT NAME'}
                          rollNumber={formData.rollNumber || 'N/A'}
                          fatherName={formData.fatherName || 'FATHER NAME'}
                        />
                      )
                    ) : (
                      <div className="text-center">
                        <div className="w-36 h-56 mx-auto bg-gradient-to-b from-purple-300 via-blue-300 to-blue-400 rounded-xl shadow-xl flex flex-col items-center justify-start p-4">
                          <div className="text-purple-800 font-bold text-xs mb-3">
                            SCHOOL NAME
                          </div>
                          {photoPreview ? (
                            <div className="w-20 h-24 bg-white rounded-lg mb-3 overflow-hidden shadow-md">
                              <Image
                                src={photoPreview}
                                alt="Student"
                                width={80}
                                height={96}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-24 bg-white rounded-lg mb-3 shadow-md"></div>
                          )}
                          <div className="text-xs font-bold text-gray-900">
                            {formData.firstName || 'STUDENT NAME'}
                          </div>
                          <div className="text-xs text-gray-800 mt-1.5">
                            Roll: {formData.rollNumber || 'N/A'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {!selectedSchoolDesign && (
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Select a school to see the ID card design
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* School Selection */}
          <div className="p-6 md:p-8 lg:p-10 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-lg">🏫</span>
              </div>
              School Details
            </h2>

            <div className="max-w-md">
              <label
                htmlFor="schoolId"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Select School <span className="text-red-500">*</span>
              </label>
              <select
                id="schoolId"
                name="schoolId"
                value={formData.schoolId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.schoolId ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                required
              >
                <option value="">Select a school</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.schoolName}
                  </option>
                ))}
              </select>
              {errors.schoolId && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.schoolId}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 md:p-8 lg:p-10 bg-white">
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">
              {/* Footer Text */}
              <div className="text-center md:text-left text-sm text-gray-500">
                2025 © Wezant. Design & Developed with ❤️ by Zenoids
              </div>
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors shadow-md hover:shadow-lg"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}