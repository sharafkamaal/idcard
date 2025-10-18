// src/app/(app)/manage-students/add/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface School {
  id: string;
  schoolName: string;
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
          setFormData(prev => ({ ...prev, schoolId: data.data[0].id }));
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
      schoolId: schools[0]?.id || '',
      status: 'ACTIVE',
      verified: false,
    });
    setPhotoPreview('');
    setPhotoFile(null);
    setErrors({});
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Dashboards / Manage Students /{' '}
          <span className="text-gray-900 font-medium">Add Student</span>
        </p>
        <h1 className="text-2xl font-semibold text-gray-800">ADD STUDENT</h1>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
        {/* Student Profile Section */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-blue-600 mb-6">
            Student Profile
          </h2>

          <div className="flex gap-8">
            {/* Left Column - Photo & QR Code */}
            <div className="flex flex-col gap-6">
              {/* Photo Upload */}
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-48 rounded-lg border-4 border-gray-200 flex items-center justify-center bg-white overflow-hidden">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Student Photo"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-red-50">
                      <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 shadow-lg"
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
                <p className="text-xs text-gray-500 mt-3">
                  PHOTO (1.5 inches x 2 inches)
                </p>
                <p className="text-xs text-gray-400">(W:150px * H:200px)</p>
                {errors.photo && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.photo}
                  </p>
                )}
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 mb-3">
                  Student QR Code
                </label>
                <div className="w-40 h-40 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white p-2">
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-400">
                      Generated after save
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-3 px-6 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Download QR
                </button>
              </div>
            </div>

            {/* Middle Column - Form Fields */}
            <div className="flex-1 space-y-6">
              {/* Student Full Name */}
              <div>
                <label
                  htmlFor="studentFullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="First Name"
                      required
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
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
                      className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Last Name"
                      required
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Father Full Name */}
              <div>
                <label
                  htmlFor="fatherName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Father Full Name
                </label>
                <input
                  id="fatherName"
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Father's Name"
                />
              </div>

              {/* Roll No & DOB */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="rollNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Roll No <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="rollNumber"
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.rollNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Roll Number"
                    required
                  />
                  {errors.rollNumber && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.rollNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Gender & Blood Group */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-4 h-4 text-blue-600"
                        aria-label="Male"
                      />
                      <span className="text-sm">Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="FEMALE"
                        checked={formData.gender === 'FEMALE'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                        aria-label="Female"
                      />
                      <span className="text-sm">Female</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bloodGroup"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Blood Group
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="class"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Class <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="class"
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.class ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Class"
                    required
                  />
                  {errors.class && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.class}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="section"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Section
                  </label>
                  <input
                    id="section"
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Section"
                  />
                </div>
              </div>

              {/* Parent/Guardian Name & Phone */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="parentGuardianName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Parent/Guardian Name
                  </label>
                  <input
                    id="parentGuardianName"
                    type="text"
                    name="parentGuardianName"
                    value={formData.parentGuardianName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Parent/Guardian Name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="parentPhone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Parents/Guardian Phone No
                  </label>
                  <input
                    id="parentPhone"
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.parentPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10 digit phone number"
                  />
                  {errors.parentPhone && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.parentPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-6">
                  <select
                    value={formData.verified ? 'verified' : 'unverified'}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        verified: e.target.value === 'verified',
                      }))
                    }
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
                      value="ACTIVE"
                      checked={formData.status === 'ACTIVE'}
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
                      value="INACTIVE"
                      checked={formData.status === 'INACTIVE'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                      aria-label="Inactive status"
                    />
                    <span className="text-sm">Inactive</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - ID Card Preview */}
            <div className="w-64">
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">
                  Your School ID Card Design
                </h3>
                <div className="w-56 h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 p-4">
                  <div className="text-center">
                    <div className="w-32 h-48 mx-auto bg-gradient-to-b from-purple-300 via-blue-300 to-blue-400 rounded-lg shadow-md flex flex-col items-center justify-start p-3">
                      <div className="text-purple-700 font-bold text-xs mb-2">
                        SCHOOL NAME
                      </div>
                      {photoPreview ? (
                        <div className="w-16 h-20 bg-white rounded mb-2 overflow-hidden">
                          <Image
                            src={photoPreview}
                            alt="Student"
                            width={64}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-20 bg-white rounded mb-2"></div>
                      )}
                      <div className="text-xs font-semibold">
                        {formData.firstName || 'STUDENT NAME'}
                      </div>
                      <div className="text-xs text-gray-700 mt-1">
                        Roll: {formData.rollNumber || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* School Selection */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-blue-600 mb-6">
            School Details
          </h2>
          
          <div className="max-w-md">
            <label
              htmlFor="schoolId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select School <span className="text-red-500">*</span>
            </label>
            <select
              id="schoolId"
              name="schoolId"
              value={formData.schoolId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.schoolId ? 'border-red-500' : 'border-gray-300'
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
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.schoolId}
              </p>
            )}
          </div>
          
          {/* School Details Display */}
          {formData.schoolId && schools.find(s => s.id === formData.schoolId) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                School Details:
              </h4>
              <div className="text-sm text-blue-800">
                <p className="mb-1">
                  <span className="font-medium">Name:</span>{' '}
                  {schools.find(s => s.id === formData.schoolId)?.schoolName}
                </p>
                <p className="text-xs text-blue-600">
                  Canadian International School
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  # South Ontario, Canada
                </p>
                <p className="text-xs text-blue-600">
                  Call: +1-2345-71909
                </p>
                <p className="text-xs text-blue-600">
                  Email: info@canadianinternationalschool.com
                </p>
                <p className="text-xs text-blue-600">
                  Website: www.canadianinternationalschool.com
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-8 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50"
            disabled={loading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-8 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          2025 © Wezant. Design & Developed by ❤️ Zenoids
        </div>
        </div>
      </form>
    </div>
  );
}
