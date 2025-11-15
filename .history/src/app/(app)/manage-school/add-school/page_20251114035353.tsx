import { AddSchoolForm } from "@/components/forms/AddSchoolForm";

export default function AddSchoolPage() {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-2">
        <p className="text-sm text-gray-500 mb-2">
          Dashboards / Manage Schools / <span className="text-gray-900 font-medium">Add School</span>
        </p>
      </div>

      <AddSchoolForm />

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">
      </div>
    </div>
  );
}