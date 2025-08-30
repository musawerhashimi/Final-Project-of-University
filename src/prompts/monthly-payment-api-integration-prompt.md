
import { useState } from "react";

import { Edit, Trash2, XCircle } from "lucide-react";
import type { MonthlyPaymentType } from "../../../../../data/monthlyPay";
import initialPayments from "../../../../../data/monthlyPay";
import type { MonthlyPaymentFormData } from "../../../../../schemas/monthlypayment";
import RouteBox from "../../../../../components/RouteBox";
import MonthlyPaymentForm from "./MonthlyPaymentForm";

export default function MonthlyPayments() {
  const [monthlyPayments, setMonthlyPayments] =
    useState<MonthlyPaymentType[]>(initialPayments);
  const [editingPayment, setEditingPayment] =
    useState<MonthlyPaymentType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const routename = [
    { path: "/finance", name: "Finance" },
    { path: "", name: "Monthly Payment" },
  ];

  // Add or update payment
  const handleFormSubmit = (data: MonthlyPaymentFormData) => {
    if (editingPayment) {
      setMonthlyPayments((payments) =>
        payments.map((p) =>
          p.id === editingPayment.id ? { ...p, ...data } : p
        )
      );
      setEditingPayment(null);
      setIsEditModalOpen(false);
    } else {
      setMonthlyPayments((payments) => [
        ...payments,
        {
          ...data,
          id: Date.now(),
          endDate: data.endDate ?? "",
          description: data.description ?? "",
        },
      ]);
    }
  };

  // Open edit modal
  const openEditModal = (payment: MonthlyPaymentType) => {
    setEditingPayment(payment);
    setIsEditModalOpen(true);
  };

  // Delete payment
  const handleDelete = () => {
    if (deleteId !== null) {
      setMonthlyPayments((payments) =>
        payments.filter((p) => p.id !== deleteId)
      );
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />
      <div className=" bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-6 font-sans">
        {/* Form Section */}
        <div className="bg-white rounded-md shadow-md p-6 sm:p-8 w-full mb-8">
          <h2 className="bg-gradient-to-r from-blue-600 to-green-200 text-white py-2 rounded-lg shadow-md text-3xl font-extrabold mb-6 text-center">
            Add New Monthly Payment
          </h2>
          <MonthlyPaymentForm onSubmit={handleFormSubmit} initialData={null} />
        </div>
        {/* Table Section */}
        <div className="overflow-auto md:w-full w-96  bg-white p-6 rounded-xl shadow-lg ">
          <h2 className="text-2xl font-bold  mb-6 text-center bg-gradient-to-r from-blue-500 to-sky-700 p-2 rounded-md text-white">
            Monthly Payments List
          </h2>
          {monthlyPayments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No monthly payments recorded yet.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 whitespace-nowrap">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                    Payment Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tra. Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tra. Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resources
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.payment_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.amount.toFixed(2)} {payment.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.transaction_category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.transaction_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.resources}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.endDate || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {payment.description || "No description"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditModal(payment)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-2 rounded-full hover:bg-blue-100"
                          title="Edit Payment"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(payment.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded-full hover:bg-red-100"
                          title="Delete Payment"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Form Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Edit Monthly Payment
              </h2>
              <MonthlyPaymentForm
                onSubmit={handleFormSubmit}
                initialData={editingPayment}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this payment?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import {
  MonitorCheck,
  DollarSign,
  UserCheck,
  User,
  Calendar,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaMoneyBill } from "react-icons/fa";
import currencies from "../../../../../data/currencies";
import type { MonthlyPaymentType } from "../../../../../data/monthlyPay";
import {
  type TransactionCategory,
  expenses,
} from "../../../../../data/payment&recive";
import resources from "../../../../../data/resources";
import {
  type MonthlyPaymentFormData,
  monthlyPaymentSchema,
} from "../../../../../schemas/monthlypayment";
import { initialEmployees } from "../../../../../data/employees";

// PaymentForm component for both Add and Edit
interface PaymentFormProps {
  initialData?: MonthlyPaymentType | null;
  onSubmit: (data: MonthlyPaymentFormData) => void;
}

export default function MonthlyPaymentForm({
  initialData,
  onSubmit,
}: PaymentFormProps) {
  // Local state for category to update transaction name options
  const [localCategory, setLocalCategory] = useState<TransactionCategory>(
    (initialData?.transaction_category as TransactionCategory) ||
      ("employees" as TransactionCategory)
  );

  const getOptions = () => {
    switch (localCategory) {
      case "employees":
        return initialEmployees;
      case "expenses":
        return expenses;
      default:
        return [];
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MonthlyPaymentFormData>({
    resolver: zodResolver(monthlyPaymentSchema),
    defaultValues: initialData || {
      payment_name: "",
      amount: 0,
      currency: "",
      startDate: "",
      endDate: "",
      description: "",
      transaction_category: "employees",
      transaction_name: "",
      resources: "",
    },
  });

  // When initialData changes (edit), reset the form and localCategory
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setLocalCategory(initialData.transaction_category as TransactionCategory);
    } else {
      reset({
        payment_name: "",
        amount: 0,
        currency: "",
        startDate: "",
        endDate: "",
        description: "",
        transaction_category: "employees",
        transaction_name: "",
        resources: "",
      });
      setLocalCategory("employees");
    }
  }, [initialData, reset]);

  // If category changes, clear transaction_name
  useEffect(() => {
    reset((prev) => ({
      ...prev,
      transaction_category: localCategory,
      transaction_name: "",
    }));
    // eslint-disable-next-line
  }, [localCategory]);

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Payment Name */}
      <div>
        <label
          htmlFor="payment_name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <MonitorCheck className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
          Payment Name
        </label>
        <input
          type="text"
          id="payment_name"
          {...register("payment_name")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          placeholder="e.g., Salary"
        />
        {errors.payment_name && (
          <p className="text-red-500 text-xs mt-1">
            {errors.payment_name.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <DollarSign className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
          Amount
        </label>
        <input
          type="number"
          id="amount"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          placeholder="e.g., 3500"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Currency Select */}
      <div className="relative">
        <label
          htmlFor="currency"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <DollarSign className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
          Currency
        </label>
        <select
          id="currency"
          {...register("currency")}
          className="w-full border border-gray-300 p-3 rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 pr-10 bg-white"
        >
          <option value="">Select currency</option>
          {currencies.map((curr) => (
            <option key={curr.id} value={curr.name}>
              {curr.name}
            </option>
          ))}
        </select>
        {errors.currency && (
          <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Category Select */}
      <div className="relative">
        <label
          htmlFor="transaction_category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <UserCheck className="inline-block mr-1 h-4 w-4 text-gray-500" />
          Transaction Category
        </label>
        <select
          id="transaction_category"
          {...register("transaction_category", {
            onChange: (e) =>
              setLocalCategory(e.target.value as TransactionCategory),
          })}
          className="w-full border border-gray-300 p-3 rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 pr-10 bg-white"
        >
          <option value="employees">Employees</option>
          <option value="expenses">Expenses</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Transaction Name Select */}
      <div className="relative">
        <label
          htmlFor="transaction_name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <User className="inline-block mr-1 h-4 w-4 text-gray-500" />
          Transaction Name
        </label>
        <select
          id="transaction_name"
          {...register("transaction_name")}
          className="w-full border border-gray-300 p-3 rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 pr-10 bg-white"
        >
          <option value="">Select {localCategory}</option>
          {getOptions().map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Resources Select */}
      <div className="relative">
        <label
          htmlFor="resources"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <FaMoneyBill className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
          Resources
        </label>
        <select
          id="resources"
          {...register("resources")}
          className="w-full border border-gray-300 p-3 rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 pr-10 bg-white"
        >
          <option value="">Select resource</option>
          {resources.map((res) => (
            <option key={res.name} value={res.name}>
              {res.name.charAt(0).toUpperCase() + res.name.slice(1)}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Start Date */}
      <div>
        <label
          htmlFor="startDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <Calendar className="inline-block mr-1 h-4 w-4 text-gray-500" /> Start
          Date
        </label>
        <input
          type="date"
          id="startDate"
          {...register("startDate")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.startDate && (
          <p className="text-red-500 text-xs mt-1">
            {errors.startDate.message}
          </p>
        )}
      </div>

      {/* End Date */}
      <div>
        <label
          htmlFor="endDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <Calendar className="inline-block mr-1 h-4 w-4 text-gray-500" /> End
          Date (Optional)
        </label>
        <input
          type="date"
          id="endDate"
          {...register("endDate")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        />
      </div>

      {/* Description */}
      <div className="sm:col-span-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <FileText className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          placeholder="e.g., Monthly salary for employees"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="sm:col-span-2 py-2 w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-green-700 "
      >
        {initialData ? "Update Payment" : "Add Monthly Payment"}
      </button>
    </form>
  );
}

for currency use: useCurrencyStore(s => s.currencies) from /stores/useCurrencyStore.ts

rename transaction category to reference
rename transaction name to reference name

remove resources


coming data from apiClient.get(/finance/monthly-payments/references)

sample data:
{
    "expense_categories": [
        {
            "id": 1,
            "name": "Electricity"
        },
        {
            "id": 2,
            "name": "Central Store Rent"
        },
        {
            "id": 3,
            "name": "Internet Bill"
        },
        {
            "id": 4,
            "name": "Water Bill"
        }
    ],
    "employees": [
        {
            "id": 1,
            "name": "Qasim"
        },
        {
            "id": 2,
            "name": "Minwais"
        },
        {
            "id": 3,
            "name": "Elyas"
        },
        {
            "id": 4,
            "name": "Khadem"
        }
    ]
}


end_point to send: apiClient.post(/finance/monthly-payments/)
expecting data

{
    name: string,
    amount: number,
    currency: number,
    payment_method: "cash",
    start_date: date,
    end_date?: date,
    payment_day: 1,
    reference_type: "employee" | "expense_category",
    reference_id: number,
    description: string
}

connect the fron to backend

use @tanstack/react-query with axios

do not change any styles

that's what i want
if you have any question ask me
