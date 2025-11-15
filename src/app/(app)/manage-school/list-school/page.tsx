// src/app/(app)/manage-school/list-school/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Trash2, AlertCircle, List, CreditCard } from 'lucide-react';
import VerticalIdCard from '@/components/id-cards/VerticalIdCard';
import HorizontalIdCard from '@/components/id-cards/HorizontalIdCard';

interface School {
  id: string;
  schoolName: string;
  schoolType: string;
  phoneNo?: string;
  city?: string;
  state?: string;
  status: string;
  verified: boolean;
  session?: string;
  createdAt: string;
  logo?: string;
}

export default function ListSchoolPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'

  const fetchSchools = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/schools');
      const data = await response.json();

      if (data.success) {
        setSchools(data.data);
      } else {
        setError(data.error || 'Failed to fetch schools');
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
      setError('Unable to fetch schools, please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleDelete = async (id: string, schoolName: string) => {
    if (!confirm(`Are you sure you want to delete "${schoolName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/schools/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setSchools(schools.filter(school => school.id !== id));
        alert('School deleted successfully!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting school:', error);
      alert('Failed to delete school');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Schools</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchSchools}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Dashboards / Manage Schools / <span className="text-gray-900 font-medium">List Schools</span>
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/manage-school/add-school')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New School
          </button>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {schools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No schools found</p>
            <button
              onClick={() => router.push('/manage-school/add-school')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First School
            </button>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schools.map((school) => (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{school.schoolName}</div>
                          {school.verified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {school.schoolType === 'multiBranch' ? 'Multi Branch' : 'Single'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {school.city && school.state ? `${school.city}, ${school.state}` : school.city || school.state || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{school.phoneNo || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          school.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {school.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {school.session || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(`/manage-school/view/${school.id}`)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                          title="View School"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/manage-school/edit/${school.id}`)}
                          className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                          title="Edit School"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(school.id, school.schoolName)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                          title="Delete School"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {schools.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {schools.length} school{schools.length !== 1 ? 's' : ''}
        </div>
        
      )}
    </div>
  );
}
