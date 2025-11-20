'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SchoolReport {
  id: string;
  schoolName: string;
  schoolCode: string;
  schoolLocation: string;
  schoolType: string;
  status: string;
  lastExport: string;
  totalStudents: number;
}

interface StudentReport {
  id: string;
  rollNumber: string;
  studentName: string;
  idCardsStatus: string;
  lastExport: string;
  verified: boolean;
  schoolLocation: string;
}

export default function ReportsPage() {
  const [schoolReports, setSchoolReports] = useState<SchoolReport[]>([]);
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'schools' | 'students'>('schools');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [schoolsRes, studentsRes] = await Promise.all([
        fetch('/api/reports/schools'),
        fetch('/api/reports/students'),
      ]);

      if (schoolsRes.ok) {
        const schoolsData = await schoolsRes.json();
        setSchoolReports(schoolsData.data);
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudentReports(studentsData.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportSchoolsToCSV = () => {
    const headers = ['#', 'School Name', 'School Location', 'Schools Export', 'Last Export', 'School Type', 'School Code'];
    const rows = schoolReports.map((school, index) => [
      index + 1,
      school.schoolName,
      school.schoolLocation,
      school.status,
      school.lastExport,
      school.schoolType,
      school.schoolCode,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    downloadCSV(csvContent, 'schools-report.csv');
  };

  const exportStudentsToCSV = () => {
    const headers = ['#', 'Roll Number', 'Student Name', 'Id Cards Students', 'Last Export', 'Verified Batch', 'School Location'];
    const rows = studentReports.map((student, index) => [
      index + 1,
      student.rollNumber,
      student.studentName,
      student.idCardsStatus,
      student.lastExport,
      student.verified ? 'Verified' : 'Not Verified',
      student.schoolLocation,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    downloadCSV(csvContent, 'students-report.csv');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'printed':
        return 'bg-green-500';
      case 'inactive':
      case 'not printed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Dashboard / Reports</div>
          <h1 className="text-2xl font-semibold">REPORTS</h1>
        </div>

        {/* Export Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Export School Card */}
          <button
            onClick={() => setActiveView('schools')}
            className={`bg-white rounded-lg shadow p-8 text-center hover:shadow-lg transition-shadow ${
              activeView === 'schools' ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Export School</h3>
            </div>
          </button>

          {/* Export Students Card */}
          <button
            onClick={() => setActiveView('students')}
            className={`bg-blue-600 rounded-lg shadow p-8 text-center hover:shadow-lg transition-shadow ${
              activeView === 'students' ? 'ring-2 ring-blue-800' : ''
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Export Students</h3>
            </div>
          </button>
        </div>

        {/* Schools Report Table */}
        {activeView === 'schools' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Export School</h2>
              <button
                onClick={exportSchoolsToCSV}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" className="rounded" aria-label="Select all schools" />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">School Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">School Location</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Schools Export</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Export</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">School Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">School Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schoolReports.map((school, index) => (
                    <tr key={school.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded" aria-label={`Select ${school.schoolName}`} />
                      </td>
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium">{school.schoolName}</td>
                      <td className="px-4 py-3 text-sm">{school.schoolLocation}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(school.status)}`}>
                          {school.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{school.lastExport}</td>
                      <td className="px-4 py-3 text-sm">{school.schoolType}</td>
                      <td className="px-4 py-3 text-sm">{school.schoolCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {schoolReports.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No school reports available.
              </div>
            )}
          </div>
        )}

        {/* Students Report Table */}
        {activeView === 'students' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Export Students</h2>
              <button
                onClick={exportStudentsToCSV}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" className="rounded" aria-label="Select all students" />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Roll Number</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Id Cards Students</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Export</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Verified Batch</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">School Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {studentReports.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded" aria-label={`Select ${student.studentName}`} />
                      </td>
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">{student.rollNumber}</td>
                      <td className="px-4 py-3 text-sm font-medium">{student.studentName}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(student.idCardsStatus)}`}>
                          {student.idCardsStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{student.lastExport}</td>
                      <td className="px-4 py-3">
                        {student.verified ? (
                          <span className="text-blue-500">✓</span>
                        ) : (
                          <span className="text-gray-400">✗</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">{student.schoolLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {studentReports.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No student reports available.
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          2025 © Wezant. Design & Develop by ❤️ Zenoids
        </div>
      </div>
    </div>
  );
}
