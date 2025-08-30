
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import currencies from "../../../../../data/currencies";
import customers from "../../../../../data/customers";
import { members, expenses } from "../../../../../data/payment&recive";
import resources from "../../../../../data/resources";
import type { PaymentReceiveFormData } from "../../../../../schemas/paymentReceiveSchema";
import { paymentReceiveSchema } from "../../../../../schemas/paymentReceiveSchema";
import { FileText } from "lucide-react";
import { initialEmployees } from "../../../../../data/employees";

interface Props {
  initialData?: PaymentReceiveFormData | null;
  onSubmit: (data: PaymentReceiveFormData) => void;
}

export default function PaymentReceiveForm({ initialData, onSubmit }: Props) {
  const [localCategory, setLocalCategory] = useState(
    initialData?.transaction_category || "employees"
  );

  const getOptions = () => {
    switch (localCategory) {
      case "employees":
        return initialEmployees;
      case "members":
        return members;
      case "customers":
        return customers;
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
  } = useForm<PaymentReceiveFormData>({
    resolver: zodResolver(paymentReceiveSchema),
    defaultValues: initialData || {
      amount: 0,
      currency: "",
      transaction_category: "employees",
      transaction_name: "",
      resources: "",
      type: "pay",
      description: "",
    },
  });

  useEffect(() => {
    reset(
      initialData || {
        amount: 0,
        currency: "",
        transaction_category: "employees",
        transaction_name: "",
        resources: "",
        type: "pay",
        description: "",
      }
    );
    setLocalCategory(initialData?.transaction_category || "employees");
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div>
        <label className="font-medium">Amount</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
      </div>
      <div>
        <label className="font-medium">Currency</label>
        <select
          {...register("currency")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select Currency</option>
          {currencies.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.currency && (
          <p className="text-red-500 text-sm">{errors.currency.message}</p>
        )}
      </div>
      <div>
        <label className="font-medium">Transaction Category</label>
        <select
          {...register("transaction_category", {
            onChange: (e) => setLocalCategory(e.target.value),
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="employees">Employees</option>
          <option value="members">Members</option>
          <option value="customers">Customers</option>
          <option value="expenses">Expenses</option>
        </select>
      </div>
      <div>
        <label className="font-medium">Transaction Name</label>
        <select
          {...register("transaction_name")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select {localCategory}</option>
          {getOptions().map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        {errors.transaction_name && (
          <p className="text-red-500 text-sm">
            {errors.transaction_name.message}
          </p>
        )}
      </div>
      <div>
        <label className="font-medium">Resources</label>
        <select
          {...register("resources")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select resource</option>
          {resources.map((r) => (
            <option key={r.name} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="font-medium">Pay/Receive</label>
        <select
          {...register("type")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="pay">Pay</option>
          <option value="receive">Receive</option>
        </select>
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
      <button
        type="submit"
        className="sm:col-span-2 bg-green-600 text-white rounded py-2 font-bold"
      >
        Submit
      </button>
    </form>
  );
}



import { useState } from "react";
import { Edit, Trash2, XCircle } from "lucide-react";
import RouteBox from "../../../../../components/RouteBox";
import PaymentReceiveForm from "./PaymentReceiveForm";
import type { PaymentReceiveFormData } from "../../../../../schemas/paymentReceiveSchema";
import type { Transaction } from "../../../../../data/transactions";
import { transactions as staticTransactions } from "../../../../../data/transactions"; // <-- Import your static transactions

const initialTransactions: Transaction[] = [];

export default function PaymentsReceive() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const routename = [
    { path: "/finance", name: "Finance" },
    { path: "", name: "Payment & Receive" },
  ];

  const handleFormSubmit = (data: PaymentReceiveFormData) => {
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === editingTransaction.id
            ? {
                ...tx,
                ...data,
                transaction_category:
                  data.transaction_category as Transaction["transaction_category"],
              }
            : tx
        )
      );
      setEditingTransaction(null);
      setIsEditModalOpen(false);
    } else {
      setTransactions((prev) => [
        ...prev,
        {
          ...data,
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          transaction_category:
            data.transaction_category as Transaction["transaction_category"],
        },
      ]);
    }
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== deleteId));
      setDeleteId(null);
      setIsDeleteModalOpen(false);
    }
  };

  // Combine static and local transactions for display
  const allTransactions = [...staticTransactions, ...transactions];

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />

      <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen font-sans">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full mb-8">
          <h2 className="text-3xl font-extrabold  mb-6 text-center bg-gradient-to-r from-blue-600 to-green-200 text-white py-2 rounded-lg shadow-md">
            Add New Payment / Receive
          </h2>
          <PaymentReceiveForm onSubmit={handleFormSubmit} initialData={null} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8  overflow-auto w-96 md:w-full">
          <h2 className="text-3xl font-extrabold  mb-6 text-center bg-gradient-to-r from-blue-500 to-sky-700 p-2 rounded-md text-white">
            Payments & Receives List
          </h2>
          {allTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No Transaction recorded yet.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 whitespace-nowrap">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                {allTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        tx.type === "pay" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.transaction_category.charAt(0).toUpperCase() +
                        tx.transaction_category.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.transaction_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.amount.toFixed(2)}
                      {tx.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.resources}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.description ? tx.description : "No Description"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingTransaction(tx);
                            setIsEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-2 rounded-full hover:bg-blue-100"
                          title="Edit Transaction"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(tx.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded-full hover:bg-red-100"
                          title="Delete Transaction"
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
                Edit Payment / Receive
              </h2>
              <PaymentReceiveForm
                onSubmit={handleFormSubmit}
                initialData={editingTransaction}
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
                Are you sure you want to delete this transaction?
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


remove expense and add vendors

coming data from apiClient.get(/finance/transactions/parties)

sample data:
{
    "vendors": [
        {
            "id": 1,
            "name": "Alcozay"
        },
        {
            "id": 3,
            "name": "Amazon"
        },
        {
            "id": 2,
            "name": "Kazim"
        },
        {
            "id": 4,
            "name": "Microsoft"
        },
        {
            "id": 5,
            "name": "Tesla"
        }
    ],
    "customers": [
        {
            "id": 4,
            "name": "Nargis"
        },
        {
            "id": 3,
            "name": "Tawab"
        },
        {
            "id": 2,
            "name": "Karim"
        },
        {
            "id": 1,
            "name": "Nabi"
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
    ],
    "members": [
        {
            "id": 1,
            "name": "Ahmad"
        },
        {
            "id": 2,
            "name": "Zaman"
        },
        {
            "id": 3,
            "name": "Jamal"
        }
    ]
}

rename the transaction_category to category, transaction_name to party.


end_point to send: apiClient.post(/finance/transactions/)
expecting data

{
    "transaction_type": "pay" | "receive,
    "party_type": vendors ...,
    "party_id": number,
    "amount": number,
    "currency": number,
    "cash_drawer": number,
    "description": "",
    "transaction_date": date | optional
}

connect the fron to backend

use @tanstack/react-query with axios

do not change any styles

that's what i want
if you have any question ask me