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
import { ClientOnly } from '@/components/ClientOnly';

// Sample data for charts
const workStatusData = [
  { name: 'Approved', value: 45, color: '#3B82F6', className: 'bg-blue-500' },
  { name: 'Completed', value: 30, color: '#10B981', className: 'bg-green-500' },
  { name: 'Pending', value: 25, color: '#EF4444', className: 'bg-red-500' },
];

const printingTurnaroundData = [
  { month: 'Jan', time: 12 },
  { month: 'Feb', time: 15 },
  { month: 'Mar', time: 8 },
  { month: 'Apr', time: 18 },
  { month: 'May', time: 10 },
  { month: 'Jun', time: 14 },
  { month: 'Jul', time: 9 },
  { month: 'Aug', time: 16 },
  { month: 'Sep', time: 11 },
  { month: 'Oct', time: 13 },
  { month: 'Nov', time: 7 },
  { month: 'Dec', time: 12 },
];

const entriesOverviewData = [
  { month: 'Jan', invalid: 20, missing: 15, incomplete: 10 },
  { month: 'Feb', invalid: 25, missing: 18, incomplete: 12 },
  { month: 'Mar', invalid: 15, missing: 12, incomplete: 8 },
  { month: 'Apr', invalid: 30, missing: 20, incomplete: 15 },
  { month: 'May', invalid: 18, missing: 14, incomplete: 9 },
  { month: 'Jun', invalid: 22, missing: 16, incomplete: 11 },
  { month: 'Jul', invalid: 28, missing: 19, incomplete: 13 },
  { month: 'Aug', invalid: 16, missing: 11, incomplete: 7 },
  { month: 'Sep', invalid: 24, missing: 17, incomplete: 12 },
  { month: 'Oct', invalid: 19, missing: 13, incomplete: 8 },
  { month: 'Nov', invalid: 26, missing: 18, incomplete: 14 },
  { month: 'Dec', invalid: 21, missing: 15, incomplete: 10 },
];

const studentRequestsData = [
  {
    id: 1,
    date: '04-08-2025',
    verifiedBatch: true,
    schoolName: 'Canadian International School',
    studentName: 'Neel Madhave',
    schoolLocation: 'Cambodia',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 2,
    date: '04-08-2025',
    verifiedBatch: true,
    schoolName: 'Canadian International School',
    studentName: 'Jamiul Burnett',
    schoolLocation: 'Cambodia',
    status: 'Pending',
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
    statusColor: 'bg-red-100 text-red-800'
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
  },
];

export default function Home() {
  return (
    <ClientOnly
      fallback={
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-36 bg-white rounded-lg shadow-sm" />
            ))}
          </div>
        </div>
      }
    >
      <section className="space-y-6" aria-live="polite">
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
              <div className="h-64 min-h-[200px] min-w-[200px]" role="presentation">
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
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="#3B82F6"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Entries Overview Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Entries Overview</CardTitle>
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
                    <Bar dataKey="invalid" fill="#EF4444" />
                    <Bar dataKey="missing" fill="#F59E0B" />
                    <Bar dataKey="incomplete" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Student Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentRequestsData.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.schoolName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.schoolLocation}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={request.statusColor}>{request.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </ClientOnly>
  );
}
