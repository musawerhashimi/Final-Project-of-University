import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  Loader2,
  Mail,
  MonitorCheck,
  Phone,
  PlusCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import RouteBox from "../../../components/RouteBox";
import apiClient from "../../../lib/api";
import {
  employeeSchema,
  type EmployeeFormData,
} from "../../../schemas/employeeValidation";
import { EmployeeGrid } from "./EmployeeCard";
import { useTranslation } from "react-i18next";
// import { apiClient } from "../../../services/api"; // Adjust the import path as needed

// Updated Employee type to match API response
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

// API functions
const employeeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await apiClient.get("/hr/employees/");
    return response.data;
  },

  createEmployee: async (employeeData: EmployeeFormData): Promise<Employee> => {
    const response = await apiClient.post("/hr/employees/", employeeData);
    return response.data;
  },
};

// Utility function to format date

export default function Employees() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const routename = [
    { path: "/finance", name: t("Finance") },
    { path: "", name: t("Employees") },
  ];

  // React Query for fetching employees
  const {
    data: employees = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeApi.getEmployees,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // React Query mutation for creating employee
  const createEmployeeMutation = useMutation({
    mutationFn: employeeApi.createEmployee,
    onSuccess: () => {
      // Invalidate and refetch employees data
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      closeAddEmployeeModal();
      reset();
      toast.success(t("Employee added successfully!"));
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(t("Failed to create employee:"), error);
      toast.error(
        error.response?.data?.message ||
          t("Failed to add employee. Please try again.")
      );
      // You can add toast notification here
    },
  });

  // useForm hook for the Add Employee Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const openAddEmployeeModal = () => {
    setIsModalOpen(true);
    reset();
  };

  const closeAddEmployeeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmitForm = (data: EmployeeFormData) => {
    createEmployeeMutation.mutate(data);
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <RouteBox items={routename} routlength={routename.length} />
        <div className="mt-[-15px] min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">
              {t("Loading employees...")}
            </span>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (isError) {
    return (
      <>
        <RouteBox items={routename} routlength={routename.length} />
        <div className="mt-[-15px] min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t("Failed to load employees")}
            </h2>
            <p className="text-gray-600">
              {error instanceof Error ? error.message : t("An error occurred")}
            </p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["employees"] })
              }
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              {t("Try Again")}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />
      <div className="mt-[-15px]  bg-gray-100 p-4 sm:p-6 font-sans">
        {/* Add New Employee Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={openAddEmployeeModal}
            disabled={createEmployeeMutation.isPending}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center space-x-2 rtl:space-x-reverse"
          >
            {createEmployeeMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <PlusCircle className="h-5 w-5" />
            )}
            <span>
              {createEmployeeMutation.isPending
                ? t("Adding...")
                : t("Add New Employee")}
            </span>
          </button>
        </div>

        <EmployeeGrid employees={employees} />

        {/* Add Employee Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={closeAddEmployeeModal}
                disabled={createEmployeeMutation.isPending}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Close"
              >
                <XCircle className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {t("Add New Employee")}
              </h2>

              {/* Error message */}
              {createEmployeeMutation.isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <span className="text-sm">
                    {t("Failed to add employee. Please try again.")}
                  </span>
                </div>
              )}

              {/* Employee Add Form */}
              <form
                onSubmit={handleSubmit(onSubmitForm)}
                className="grid grid-cols-1 gap-4"
              >
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <MonitorCheck className="inline-block mr-1 h-4 w-4 text-gray-500" />
                    {t("Name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    disabled={createEmployeeMutation.isPending}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-100"
                    placeholder="e.g., Ali Ahmadi"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <Phone className="inline-block mr-1 h-4 w-4 text-gray-500" />
                    {t("Phone")}
                  </label>
                  <input
                    type="text"
                    id="phone"
                    {...register("phone")}
                    disabled={createEmployeeMutation.isPending}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-100"
                    placeholder="e.g., 0781234567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <Mail className="inline-block mr-1 h-4 w-4 text-gray-500" />
                    {t("Email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    disabled={createEmployeeMutation.isPending}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-100"
                    placeholder="e.g., ali.ahmadi@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={createEmployeeMutation.isPending}
                  className="mt-4 py-2 w-full bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-400 transition duration-300 ease-in-out flex items-center justify-center space-x-2"
                >
                  {createEmployeeMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span>
                    {createEmployeeMutation.isPending
                      ? t("Adding...")
                      : t("Add New Employee")}
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
