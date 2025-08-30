import {
  User,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  Edit3,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Employee interface
export interface Employee {
  id: number;
  name: string;
  phone: string;
  email: string;
  hire_date: string;
  status: string;
  current_position: string | null;
  current_salary: number;
  service_years: number;
}

// Props for the component
interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employeeId: number) => void;
}

// Utility function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Utility function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Utility function to format salary
const formatSalary = (salary: number): string => {
  if (salary === 0) return "Not set";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(salary);
};

// Single Employee Card Component
export function EmployeeCard({
  employee,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  const [showActions, setShowActions] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1">
      {/* Actions Dropdown */}
      {(onEdit || onDelete) && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowActions(!showActions)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-full hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>

          {showActions && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(employee);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit3 className="h-3 w-3" />
                  {t("Edit")}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(employee.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-3 w-3" />
                  {t("Delete")}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className=" p-6 flex flex-col text-center">
        {/* Avatar and Status */}
        <div className="flex justify-center mb-4">
          <div className="relative w-16 h-16 bg-gradient-to-br bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl shadow-lg">
            {getInitials(employee.name)}

            {/* Status Indicator Dot */}
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                employee.status === "active" ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
        </div>

        {/* Employee Info */}
        <div className="space-y-3">
          {/* Name and Position */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
              {employee.name}
            </h3>
            <p className="text-sm font-medium text-gray-600">
              {employee.current_position || "No position assigned"}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 truncate">
                {employee.phone || "No phone"}
              </span>
            </div>

            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 truncate">
                {employee.email}
              </span>
            </div>
          </div>

          {/* Employment Details */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-600">{t("Hired")}</span>
              </div>
              <span className="text-xs font-semibold text-gray-800">
                {formatDate(employee.hire_date)}
              </span>
            </div>

            {employee.service_years > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{t("Experience")}</span>
                <span className="text-xs font-semibold text-gray-800">
                  {employee.service_years}{" "}
                  {employee.service_years === 1 ? "year" : "years"}
                </span>
              </div>
            )}

            {employee.current_salary > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{t("Salary")}</span>
                <span className="text-xs font-semibold text-green-600">
                  {formatSalary(employee.current_salary)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

// Grid Container Component
interface EmployeeGridProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (employeeId: number) => void;
  emptyStateMessage?: string;
}

export function EmployeeGrid({
  employees,
  onEdit,
  onDelete,
  emptyStateMessage = "No employees found",
}: EmployeeGridProps) {
  const { t } = useTranslation();
  if (employees.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {emptyStateMessage}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {t(
            "Get started by adding your first employee to build your team directory."
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
