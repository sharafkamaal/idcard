'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Users, GraduationCap, FileCheck, Clock } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// Sample data for charts
const workStatusData = [
  { name: 'Approved', value: 45, color: '#10B981', className: 'bg-green-500' },
  { name: 'Completed', value: 30, color: '#3B82F6', className: 'bg-blue-500' },
  { name: 'Pending', value: 25, color: '#EF4444', className: 'bg-red-500' }
];

const printingTurnaroundData = [
  { month: 'Jan', time: 65 },
  { month: 'Feb', time: 59 },
  { month: 'Mar', time: 80 },
  { month: 'Apr', time: 81 },
  { month: 'May', time: 56 },
  { month: 'Jun', time: 55 },
  { month: 'Jul', time: 40 },
  { month: 'Aug', time: 65 },
  { month: 'Sep', time: 59 },
  { month: 'Oct', time: 80 },
  { month: 'Nov', time: 81 },
  { month: 'Dec', time: 56 }
];

const entriesOverviewData = [
  { month: 'Jan', invalid: 20, missing: 15, incomplete: 10 },
  { month: 'Feb', invalid: 25, missing: 18, incomplete: 12 },
  { month: 'Mar', invalid: 30, missing: 20, incomplete: 15 },
  { month: 'Apr', invalid: 22, missing: 16, incomplete: 11 },
  { month: 'May', invalid: 28, missing: 19, incomplete: 14 },
  { month: 'Jun', invalid: 35, missing: 22, incomplete: 18 },
  { month: 'Jul', invalid: 32, missing: 21, incomplete: 16 },
  { month: 'Aug', invalid: 29, missing: 18, incomplete: 13 },
  { month: 'Sep', invalid: 26, missing: 17, incomplete: 12 },
  { month: 'Oct', invalid: 31, missing: 20, incomplete: 15 },
  { month: 'Nov', invalid: 33, missing: 21, incomplete: 17 },
  { month: 'Dec', invalid: 27, missing: 18, incomplete: 14 }
];

const studentRequestsData = [
  {
    id: 1,
    date: '04-08-2025',
    verifiedBatch: true,
    schoolName: 'Canadian International School',
    studentName: 'Neil Matthews',
    schoolLocation: 'Cambodia',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 2,
    date: '04-08-2025',
    verifiedBatch: true,
    schoolName: 'Canadian International School',
    studentName: 'Jamal Burnett',
    schoolLocation: 'Cambodia',
    status: 'Declined',
    statusColor: 'bg-red-100 text-red-800'
  },
  {
    id: 3,
    date: '04-08-2025',
    verifiedBatch: true,
    schoolName: 'Canadian International School',
    studentName: 'Juan Mitchell',
    schoolLocation: 'Cambodia',
    status: 'Approved',
    statusColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 4,
    date: '04-08-2025',
    verifiedBatch: true,
    schoolName: 'Canadian International School',
    studentName: 'Barry Dick',
    schoolLocation: 'Cambodia',
    status: 'Pending',
    statusColor: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 5,
    date: '04-08-2025',
    verifiedBatch: true,
    schoolName: 'Canadian International School',
    studentName: 'Ronald Taylor',
    schoolLocation: 'Cambodia',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 6,
    date: '04-08-2025',
    verifiedBatch: true,
    schoolName: 'Canadian International School',
    studentName: 'Jacob Hunter',
    schoolLocation: 'Cambodia',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-800'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DASHBOARDS</h1>
          <p className="text-sm text-gray-500 mt-1">School Branches</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Dashboards</span>
          <span>/</span>
          <span className="text-gray-900">Dashboards</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Students Register</p>
                <p className="text-2xl font-bold text-gray-900">1,235</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Export Submit Printing</p>
                <p className="text-2xl font-bold text-gray-900">35,723</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-2xl font-bold text-gray-900">1000</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Printing</p>
                <p className="text-2xl font-bold text-gray-900">1000</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Work Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Work Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {workStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {workStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-2 ${item.className}`}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Printing Turnaround Time Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Printing Turnaround Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={printingTurnaroundData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="time" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Error/Rejected Entries Overview Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Error/Rejected Entries Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={entriesOverviewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="invalid" stackId="a" fill="#3B82F6" name="Invalid Entries" />
                  <Bar dataKey="missing" stackId="a" fill="#F59E0B" name="Missing Photo" />
                  <Bar dataKey="incomplete" stackId="a" fill="#EF4444" name="Incomplete Fields" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Latest Student Requests & Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Verified Batch</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">School Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Student name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">School Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {studentRequestsData.map((request) => (
                  <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <label className="sr-only" htmlFor={`checkbox-${request.id}`}>
                        Select row {request.id}
                      </label>
                      <input 
                        type="checkbox" 
                        id={`checkbox-${request.id}`}
                        className="rounded border-gray-300" 
                        aria-label={`Select request for ${request.studentName}`}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{request.date}</td>
                    <td className="py-3 px-4">
                      {request.verifiedBatch && (
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{request.schoolName}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{request.studentName}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{request.schoolLocation}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${request.statusColor} border-0`}>
                        {request.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}