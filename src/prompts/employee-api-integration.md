[
    {
        "id": 5,
        "name": "Ahmad",
        "phone": "",
        "email": "ahmad@gmail.com",
        "hire_date": "2025-07-23",
        "status": "active",
        "current_position": null,
        "current_salary": 0,
        "service_years": -0.0
    },
    ...
]

endpoint: apiClient.get(/hr/employees/)
get and post
post format (name, email, phone)

react tsx file

import {
  User,
  PlusCircle,
  XCircle,
  MonitorCheck,
  Phone,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { initialEmployees, type Employee } from "../../../data/employees";
import RouteBox from "../../../components/RouteBox";
import {
  employeeSchema,
  type EmployeeFormData,
} from "../../../schemas/employeeValidation";

// Mock data for employees (replace with actual data fetching later)

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const routename = [
    { path: "/finance", name: "Finance" },
    { path: "", name: "Employees" },
  ];
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
    reset(); // Reset form fields when opening for a new entry
  };

  const closeAddEmployeeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmitForm = (data: EmployeeFormData) => {
    const newEmployee: Employee = {
      id: Date.now(), // Simple unique ID
      name: data.name,
      position: "Manager", // Default role for new employees
      phone: data.phone,
      email: data.email,
    };
    setEmployees((prev) => [...prev, newEmployee]);
    closeAddEmployeeModal(); // Close modal after submission
  };

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-sans">
        {/* Add New Employee Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={openAddEmployeeModal}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center space-x-2 rtl:space-x-reverse"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add New Employee</span>
          </button>
        </div>

        {/* Employee Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105"
              dir="rtl" // Set direction to Right-to-Left for Arabic text
            >
              {/* Employee Icon/Avatar */}
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              {/* Employee Name */}
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {employee.name}
              </h3>
              {/* Employee Role */}
              <p className="text-gray-600 text-sm mb-2">{employee.position}</p>
              {/* Employee Phone Number */}
              <p className="text-gray-700 font-medium text-lg">
                {employee.phone}
              </p>
              {/* Employee Email (newly added) */}
              <p className="text-gray-700 font-medium text-sm">
                {employee.email}
              </p>
            </div>
          ))}
        </div>

        {/* Add Employee Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={closeAddEmployeeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="Close"
              >
                <XCircle className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Add New Employee
              </h2>

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
                    <MonitorCheck className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    placeholder="e.g., John Doe"
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
                    <Phone className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
                    Phone
                  </label>
                  <input
                    type="text" // Changed to text to allow for various phone formats, but validation ensures digits
                    id="phone"
                    {...register("phone")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                    <Mail className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    placeholder="e.g., john.doe@example.com"
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
                  className="mt-4 py-2 w-full bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                >
                  Add Employee
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


hey bro, integrate these for me using @tanstack/react-query and that apiClient (axios).
also if you want add some hire date to the employee card too.
if you have any question ask