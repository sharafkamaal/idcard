'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Users, GraduationCap, Clock, CheckCircle, Eye, Edit } from 'lucide-react';

// Work Status Data for Pie Chart
const workStatusData = [
  { name: 'Approved', value: 45, color: '#3B82F6' },
  { name: 'Completed', value: 35, color: '#22C55E' },
  { name: 'Pending', value: 20, color: '#EF4444' },
];

// Printing Turnaround Time Data for Line Chart
const printingTurnaroundData = [
  { month: 'Jan', time: 12 },
  { month: 'Feb', time: 15 },
  { month: 'Mar', time: 8 },
  { month: 'Apr', time: 18 },
  { month: 'May', time: 14 },
  { month: 'Jun', time: 10 },
  { month: 'Jul', time: 16 },
  { month: 'Aug', time: 12 },
  { month: 'Sep', time: 9 },
  { month: 'Oct', time: 13 },
  { month: 'Nov', time: 11 },
  { month: 'Dec', time: 14 },
];

// Error/Rejected Entries Overview Data for Bar Chart
const entriesOverviewData = [
  { month: 'Jan', invalid: 12, missing: 8, incomplete: 5 },
  { month: 'Feb', invalid: 15, missing: 10, incomplete: 7 },
  { month: 'Mar', invalid: 8, missing: 6, incomplete: 4 },
  { month: 'Apr', invalid: 18, missing: 12, incomplete: 9 },
  { month: 'May', invalid: 14, missing: 9, incomplete: 6 },
  { month: 'Jun', invalid: 10, missing: 7, incomplete: 5 },
];

// Student Requests Data for Table
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

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">DASHBOARDS</h1>
          <p className="dashboard-subtitle">School Branches</p>
        </div>
        <div className="breadcrumb">
          <span>Dashboards</span>
          <span>/</span>
          <span className="breadcrumb-current">Dashboards</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <Card>
          <CardContent className="p-6">
            <div className="kpi-card-content">
              <div>
                <p className="kpi-label">Students Register</p>
                <p className="kpi-value">1,235</p>
              </div>
              <div className="kpi-icon kpi-icon-blue">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="kpi-card-content">
              <div>
                <p className="kpi-label">Export Submit Printing</p>
                <p className="kpi-value">35,723</p>
              </div>
              <div className="kpi-icon kpi-icon-blue">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="kpi-card-content">
              <div>
                <p className="kpi-label">Pending Verification</p>
                <p className="kpi-value">1000</p>
              </div>
              <div className="kpi-icon kpi-icon-blue">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="kpi-card-content">
              <div>
                <p className="kpi-label">Completed Printing</p>
                <p className="kpi-value">1000</p>
              </div>
              <div className="kpi-icon kpi-icon-blue">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Work Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="chart-title">Work Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
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
            <div className="chart-legend">
              {workStatusData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div className="legend-item-content">
                    <div
                      className={`legend-indicator ${
                        item.name === 'Approved' ? 'legend-approved' :
                        item.name === 'Completed' ? 'legend-completed' :
                        'legend-pending'
                      }`}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Printing Turnaround Time Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="chart-title">Printing Turnaround Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
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
            <CardTitle className="chart-title">Error/Rejected Entries Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={entriesOverviewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="invalid" fill="#EF4444" name="Invalid Entries" />
                  <Bar dataKey="missing" fill="#F59E0B" name="Missing Entries" />
                  <Bar dataKey="incomplete" fill="#3B82F6" name="Incomplete Entries" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="chart-title">Student Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-600">ID</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date</th>
                  <th className="text-left p-4 font-medium text-gray-600">School Name</th>
                  <th className="text-left p-4 font-medium text-gray-600">Student Name</th>
                  <th className="text-left p-4 font-medium text-gray-600">Location</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentRequestsData.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{request.id}</td>
                    <td className="p-4">{request.date}</td>
                    <td className="p-4">{request.schoolName}</td>
                    <td className="p-4">{request.studentName}</td>
                    <td className="p-4">{request.schoolLocation}</td>
                    <td className="p-4">
                      <Badge className={request.statusColor}>
                        {request.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
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