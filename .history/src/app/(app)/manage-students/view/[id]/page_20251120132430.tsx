'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fatherName: string;
  phone: string;
  parentPhone: string;
  gender: string;
  dob: string;
  rollNumber: string;
  bloodGroup: string;
  photoUrl: string;
  class: string;
  section: string;
  parentGuardianName: string;
  status: string;
  verified: boolean;
  school: {
    schoolName: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    phoneNo: string;
    email: string;
    website: string;
  };
}

export default function StudentViewPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [printStatus, setPrintStatus] = useState('Printed');
  const [verifyStatus, setVerifyStatus] = useState('Verified');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${params.id}`);
        if (response.ok) {
          const result = await response.json();
          setStudent(result.data);
          setPrintStatus(result.data.status || 'Not Printed');
          setVerifyStatus(result.data.verified ? 'Verified' : 'Not Verified');
        }
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStudent();
    }
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  // UPDATED: Use JSON instead of FormData for PUT
  const handleSubmit = async () => {
    try {
      const data = {
        status: printStatus,
        verified: verifyStatus === 'Verified',
      };

      const response = await fetch(`/api/students/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Status updated successfully!');
        router.push('/manage-students/list');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student');
    }
  };

  const handleEdit = () => {
    router.push(`/manage-students/edit/${params.id}`);
  };

  const handleSkip = () => {
    router.push('/manage-students/list');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Student not found</div>
      </div>
    );
  }

  const fullName = `${student.firstName} ${student.lastName}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print Button Bar - Hidden when printing */}
      <div className="no-print fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-6 py-4 flex gap-4 z-50 border border-gray-200">
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Print
        </button>
        <button
          onClick={handleSkip}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
        >
          Skip Print
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb - Hidden when printing */}
        <div className="no-print mb-4 text-sm text-gray-500">
          Dashboards / Manage Student / Student View
        </div>

        <h1 className="text-2xl font-semibold mb-6">STUDENT VIEW</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Student Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex gap-6 mb-8">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 border-4 border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                    {student.photoUrl ? (
                      <Image
                        src={student.photoUrl}
                        alt={fullName}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                        👤
                      </div>
                    )}
                  </div>
                  {/* Buttons - Hidden when printing */}
                  <div className="no-print mt-3 space-y-2">
                    <button
                      onClick={() => setPrintStatus('Printed')}
                      className="w-full px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
                    >
                      Printed
                    </button>
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{fullName}</h2>
                    {student.verified && (
                      <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">S/o, D/o :</label>
                      <p className="font-medium text-gray-800">{student.fatherName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">DOB :</label>
                      <p className="font-medium text-gray-800">
                        {new Date(student.dob).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Gender :</label>
                      <p className="font-medium text-gray-800">{student.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Blood Group :</label>
                      <p className="font-medium text-gray-800">{student.bloodGroup}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Roll No :</label>
                      <p className="font-medium text-gray-800">{student.rollNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Class :</label>
                      <p className="font-medium text-gray-800">{student.class}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Section :</label>
                      <p className="font-medium text-gray-800">{student.section}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* School Details Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">School Details:</h3>
                <div>
                  <p className="font-semibold text-gray-800 mb-2">{student.school.schoolName}</p>
                  <p className="text-sm text-gray-600">
                    # {student.school.address}, {student.school.city}
                  </p>
                  <p className="text-sm text-gray-600">Call: {student.school.phoneNo}</p>
                  <p className="text-sm text-gray-600">Email: {student.school.email}</p>
                  <p className="text-sm text-gray-600">Website: {student.school.website}</p>
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Parents/Guardian Information:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Name:</label>
                    <p className="font-medium text-gray-800">
                      {student.parentGuardianName || student.fatherName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone No. :</label>
                    <p className="font-medium text-gray-800">
                      {student.parentPhone || student.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Section - Hidden when printing */}
            <div className="no-print bg-white rounded-lg shadow p-6 mt-6">
              <div className="flex items-center gap-6">
                <span className="text-gray-700 font-medium">Status</span>
                <select
                  value={printStatus}
                  onChange={(e) => setPrintStatus(e.target.value)}
                  aria-label="Print Status"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Printed">Printed</option>
                  <option value="Not Printed">Not Printed</option>
                </select>
                <select
                  value={verifyStatus}
                  onChange={(e) => setVerifyStatus(e.target.value)}
                  aria-label="Verification Status"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Verified">Verified</option>
                  <option value="Not Verified">Not Verified</option>
                </select>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - ID Card Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Horizontal</h3>
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 text-white text-center border-4 border-dashed border-white shadow-xl">
                {/* School Logo */}
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-purple-800">
                  <span className="text-2xl font-bold text-purple-700">S</span>
                </div>
                {/* School Name */}
                <div className="text-red-400 font-bold text-lg mb-4">
                  {student.school.schoolName.toUpperCase()}
                </div>
                {/* Student Photo */}
                <div className="relative w-24 h-24 bg-green-100 rounded-lg mx-auto mb-3 border-2 border-white overflow-hidden">
                  {student.photoUrl ? (
                    <Image
                      src={student.photoUrl}
                      alt={fullName}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-500">
                      👤
                    </div>
                  )}
                </div>
                {/* Student Info */}
                <div className="text-xs mb-1 font-semibold">STUDENT ID: {student.rollNumber}</div>
                <div className="text-sm font-bold mb-1">STUDENT NAME</div>
                <div className="text-xs mb-2">
                  Father&apos;s Name : <span className="font-semibold">{student.fatherName}</span>
                </div>
                <div className="text-xs">
                  Class Name : <span className="font-semibold">{student.class}</span>
                </div>
                <div className="text-xs">
                  Class Roll : <span className="font-semibold">{student.rollNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
