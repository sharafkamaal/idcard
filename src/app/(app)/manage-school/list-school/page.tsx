'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    School,
    SchoolStatus,
    SchoolType,
} from '@/types/school';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    Filter,
    Loader2,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Trash2,
} from 'lucide-react';

interface SchoolWithMetrics extends School {
    _count?: {
        students: number;
    };
}

interface PaginatedResponse {
    schools: SchoolWithMetrics[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const statusBadges: Record<SchoolStatus, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    INACTIVE: 'bg-red-100 text-red-700 border border-red-200',
    VERIFIED: 'bg-blue-100 text-blue-700 border border-blue-200',
};

const typeLabels: Record<SchoolType, string> = {
    SINGLE: 'Single Branch',
    MULTI_BRANCH: 'Multi Branch',
};

const statusOptions: { label: string; value: SchoolStatus | 'ALL' }[] = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Verified', value: 'VERIFIED' },
];

export default function ListSchoolPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [schools, setSchools] = useState<SchoolWithMetrics[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<SchoolStatus | 'ALL'>('ALL');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchSchools = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (debouncedSearch.trim()) {
                params.set('search', debouncedSearch.trim());
            }

            if (statusFilter !== 'ALL') {
                params.set('status', statusFilter);
            }

            const response = await fetch(`/api/school?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Unable to fetch schools, please try again.');
            }

            const data: PaginatedResponse = await response.json();
            setSchools(data.schools);
            setTotalPages(data.pagination.totalPages);
            setTotalResults(data.pagination.total);
        } catch (err: any) {
            setError(err.message || 'Failed to load schools.');
            toast({
                title: 'Error',
                description: err.message || 'Failed to load schools.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, limit, page, statusFilter, toast]);

    useEffect(() => {
        fetchSchools();
    }, [fetchSchools]);

    const handleDelete = useCallback(
        async (schoolId: string) => {
            const confirmed = window.confirm('Are you sure you want to delete this school? This action cannot be undone.');
            if (!confirmed) return;

            try {
                const response = await fetch(`/api/school/${schoolId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Unable to delete school, please try again.');
                }

                toast({
                    title: 'Deleted',
                    description: 'School deleted successfully.',
                });

                fetchSchools();
            } catch (err: any) {
                toast({
                    title: 'Error',
                    description: err.message || 'Failed to delete school.',
                    variant: 'destructive',
                });
            }
        },
        [fetchSchools, toast]
    );

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('ALL');
        setPage(1);
    };

    useEffect(() => {
        if (statusFilter === 'ALL' && !debouncedSearch) return;
        setPage(1);
    }, [debouncedSearch, statusFilter]);

    const renderStatusBadge = useCallback(
        (status: SchoolStatus) => (
            <Badge className={`${statusBadges[status]} text-xs px-3 py-1`}>{status === 'ACTIVE' ? 'Approved' : status === 'INACTIVE' ? 'Inactive' : 'Completed'}</Badge>
        ),
        []
    );

    const paginationInfo = useMemo(() => {
        const start = totalResults === 0 ? 0 : (page - 1) * limit + 1;
        const end = Math.min(page * limit, totalResults);
        return `${start}-${end} of ${totalResults}`;
    }, [limit, page, totalResults]);

    return (
        <div className="flex-1 min-h-screen bg-gray-50 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 uppercase">List Schools</h1>
                        <p className="text-sm text-gray-500 mt-1">Dashboards / Manage Schools / List School</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            asChild
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center"
                        >
                            <Link href="/manage-school/add-school">
                                <Plus className="w-4 h-4 mr-2" />
                                Add School
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="shadow-sm border border-gray-200">
                    <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="relative w-full lg:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder="Search by school name, code, or city"
                                    className="pl-10 pr-4"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative">
                                    <label htmlFor="status-filter" className="sr-only">
                                        Filter schools by status
                                    </label>
                                    <select
                                        id="status-filter"
                                        className="appearance-none pl-4 pr-10 py-2 text-sm rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={statusFilter}
                                        onChange={(event) => setStatusFilter(event.target.value as SchoolStatus | 'ALL')}
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>

                                <Button variant="outline" size="icon" onClick={resetFilters}>
                                    <RefreshCw className="w-4 h-4" />
                                </Button>

                                <Button variant="outline" size="icon" disabled>
                                    <Filter className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Overview Table */}
                <Card className="shadow-sm border border-gray-200">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            <Checkbox aria-label="Select all schools" />
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            School Type
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            School Code
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            School Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            School Location
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Students
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Last Updated
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={10} className="py-12">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <Loader2 className="w-8 h-8 animate-spin mb-3" />
                                                    <span className="text-sm">Loading schools...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={10} className="py-12">
                                                <div className="flex flex-col items-center justify-center text-red-500 space-y-2">
                                                    <span className="text-sm font-medium">{error}</span>
                                                    <Button variant="outline" size="sm" onClick={fetchSchools}>
                                                        Retry
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : schools.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="py-12">
                                                <div className="flex flex-col items-center justify-center text-gray-500 space-y-2">
                                                    <p className="text-sm font-medium">No schools found</p>
                                                    <p className="text-xs text-gray-400">Try adjusting your filters or add a new school.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        schools.map((school, index) => (
                                            <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Checkbox aria-label={`Select ${school.name}`} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {(page - 1) * limit + (index + 1)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {typeLabels[school.type]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                    {school.code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {school.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {school.city || '—'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                                                    {school._count?.students ?? 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {school.updatedAt ? new Date(school.updatedAt).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderStatusBadge(school.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center justify-center space-x-3 text-gray-500">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:text-blue-600"
                                                            onClick={() => router.push(`/manage-school/${school.id}`)}
                                                            aria-label={`View ${school.name}`}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:text-amber-600"
                                                            onClick={() => router.push(`/manage-school/edit/${school.id}`)}
                                                            aria-label={`Edit ${school.name}`}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:text-red-600"
                                                            onClick={() => handleDelete(school.id)}
                                                            aria-label={`Delete ${school.name}`}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {!loading && schools.length > 0 && (
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-t border-gray-200 gap-3">
                                <p className="text-sm text-gray-500">Showing {paginationInfo}</p>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === 1}
                                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </Button>
                                    <span className="text-sm text-gray-500">
                                        Page <span className="font-semibold text-gray-900">{page}</span> of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === totalPages}
                                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}