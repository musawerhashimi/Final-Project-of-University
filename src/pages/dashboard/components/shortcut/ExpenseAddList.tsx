// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import apiClient from "../../../../lib/api";
// import { extractAxiosError } from "../../../../utils/extractError";
// import { useTranslation } from "react-i18next";
// import {
//   expenseSchema,
//   type ExpenseFormData,
// } from "../../../../schemas/addExpenseValidation";

// export interface ExpenseCategory {
//   id: number;
//   name: string;
// }

// export default function ExpenseAddList() {
//   // State for the currently edited expense
//   const [editingExpense, setEditingExpense] = useState<ExpenseCategory | null>(
//     null
//   );
//   const { t } = useTranslation();
//   const [editedExpenseName, setEditedExpenseName] = useState<string>("");

//   const queryClient = useQueryClient();

//   // React Hook Form setup
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<ExpenseFormData>({
//     resolver: zodResolver(expenseSchema),
//   });

//   // Fetch expense categories
//   const {
//     data: expenses = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["expense-categories"],
//     queryFn: async () => {
//       const response = await apiClient.get<ExpenseCategory[]>(
//         "/finance/expense-categories/"
//       );
//       return response.data.map((item) => ({
//         id: item.id,
//         name: item.name,
//       }));
//     },
//   });

//   // Create expense mutation
//   const createExpenseMutation = useMutation({
//     mutationFn: async (data: { name: string }) => {
//       const response = await apiClient.post(
//         "/finance/expense-categories/",
//         data
//       );
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
//       toast.success(t("Expense category added successfully!"));
//       reset();
//     },
//     onError: (error) => {
//       const errorMessage = extractAxiosError(error);
//       toast.error(errorMessage);
//     },
//   });

//   // Update expense mutation
//   const updateExpenseMutation = useMutation({
//     mutationFn: async ({ id, name }: { id: number; name: string }) => {
//       const response = await apiClient.put(
//         `/finance/expense-categories/${id}/`,
//         {
//           name,
//         }
//       );
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
//       toast.success(t("Expense category updated successfully!"));
//       setEditingExpense(null);
//       setEditedExpenseName("");
//     },
//     onError: (error) => {
//       const errorMessage = extractAxiosError(
//         error,
//         t("Failed to update expense")
//       );
//       toast.error(errorMessage);
//     },
//   });

//   // Delete expense mutation
//   const deleteExpenseMutation = useMutation({
//     mutationFn: async (id: number) => {
//       await apiClient.delete(`/finance/expense-categories/${id}/`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
//       toast.success(t("Expense category deleted successfully!"));
//     },
//     onError: (error) => {
//       const errorMessage = extractAxiosError(
//         error,
//         t("Failed to delete expense")
//       );
//       toast.error(errorMessage);
//     },
//   });

//   // Handle form submission
//   const onSubmit = (data: ExpenseFormData) => {
//     createExpenseMutation.mutate(data);
//   };

//   // Handle starting the edit process for an expense
//   const handleEditClick = (expense: ExpenseCategory) => {
//     setEditingExpense(expense);
//     setEditedExpenseName(expense.name);
//   };

//   // Handle canceling the edit process
//   const handleCancelEdit = () => {
//     setEditingExpense(null);
//     setEditedExpenseName("");
//   };

//   // Handle saving edited expense
//   const handleSaveEdit = () => {
//     if (!editingExpense || !editedExpenseName.trim()) {
//       toast.error(t("Expense name cannot be empty"));
//       return;
//     }

//     updateExpenseMutation.mutate({
//       id: editingExpense.id,
//       name: editedExpenseName.trim(),
//     });
//   };

//   // Handle delete expense
//   const handleDeleteExpense = (id: number) => {
//     if (
//       window.confirm(
//         t("Are you sure you want to delete this expense category?")
//       )
//     ) {
//       deleteExpenseMutation.mutate(id);
//     }
//   };

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="font-inter text-gray-800 flex justify-center items-center min-h-64">
//         <div className="text-lg text-gray-600">
//           Loading expense categories...
//         </div>
//       </div>
//     );
//   }

//   // Show error state
//   if (error) {
//     const errorMessage = extractAxiosError(error);
//     return (
//       <div className="font-inter text-gray-800 flex justify-center items-center min-h-64">
//         <div className="text-lg text-red-600">
//           Failed to load expenses: {errorMessage}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="font-inter text-gray-800 flex justify-center items-start">
//       <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-6">
//         {/* Expense Management Section */}
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//           <h2 className="text-2xl font-bold text-indigo-700 mb-5">
//             Add New Expense
//           </h2>

//           {/* Expense Name Input */}
//           <div className="mb-6">
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               New Expense Name
//             </label>
//             <div className="flex space-x-3">
//               <div className="flex-1">
//                 <input
//                   type="text"
//                   id="name"
//                   {...register("name")}
//                   className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 ${
//                     errors.name ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="e.g., Groceries, Rent, Utilities"
//                   onKeyPress={(e) => {
//                     if (e.key === "Enter") {
//                       handleSubmit(onSubmit)();
//                     }
//                   }}
//                 />
//                 {errors.name && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>
//               <button
//                 onClick={handleSubmit(onSubmit)}
//                 disabled={isSubmitting || createExpenseMutation.isPending}
//                 className="px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {createExpenseMutation.isPending ? "Adding..." : "Add Expense"}
//               </button>
//             </div>
//           </div>

//           {/* Expense List */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">
//               Your Expense List
//             </h3>
//             {expenses.length === 0 ? (
//               <p className="text-gray-500 italic">No expense added yet.</p>
//             ) : (
//               <ul className="space-y-3">
//                 {expenses.map((expense) => (
//                   <li
//                     key={expense.id}
//                     className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm"
//                   >
//                     {editingExpense?.id === expense.id ? (
//                       <div className="flex-1 flex items-center space-x-2">
//                         <input
//                           type="text"
//                           value={editedExpenseName}
//                           onChange={(e) => setEditedExpenseName(e.target.value)}
//                           className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400"
//                         />
//                         <button
//                           onClick={handleSaveEdit}
//                           disabled={updateExpenseMutation.isPending}
//                           className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition duration-150 disabled:opacity-50"
//                         >
//                           {updateExpenseMutation.isPending
//                             ? "Saving..."
//                             : "Save"}
//                         </button>
//                         <button
//                           onClick={handleCancelEdit}
//                           disabled={updateExpenseMutation.isPending}
//                           className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition duration-150 disabled:opacity-50"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     ) : (
//                       <>
//                         <span className="text-lg font-medium text-gray-800">
//                           {expense.name}
//                         </span>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleEditClick(expense)}
//                             className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-sm"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDeleteExpense(expense.id)}
//                             disabled={deleteExpenseMutation.isPending}
//                             className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 text-sm disabled:opacity-50"
//                           >
//                             {deleteExpenseMutation.isPending
//                               ? "Deleting..."
//                               : "Delete"}
//                           </button>
//                         </div>
//                       </>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import apiClient from "../../../../lib/api";
import { extractAxiosError } from "../../../../utils/extractError";
import { useTranslation } from "react-i18next";
import {
  expenseSchema,
  type ExpenseFormData,
} from "../../../../schemas/addExpenseValidation";

export interface ExpenseCategory {
  id: number;
  name: string;
}

export default function ExpenseAddList() {
  // State for the currently edited expense
  const [editingExpense, setEditingExpense] = useState<ExpenseCategory | null>(
    null
  );
  const { t } = useTranslation();
  const [editedExpenseName, setEditedExpenseName] = useState<string>("");

  const queryClient = useQueryClient();

  // State for the custom delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDeleteId, setExpenseToDeleteId] = useState<number | null>(
    null
  );

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });

  // Fetch expense categories
  const {
    data: expenses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: async () => {
      const response = await apiClient.get<ExpenseCategory[]>(
        "/finance/expense-categories/"
      );
      return response.data.map((item) => ({
        id: item.id,
        name: item.name,
      }));
    },
  });

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await apiClient.post(
        "/finance/expense-categories/",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
      toast.success(t("Expense category added successfully!"));
      reset();
    },
    onError: (error) => {
      const errorMessage = extractAxiosError(error);
      toast.error(errorMessage);
    },
  });

  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const response = await apiClient.put(
        `/finance/expense-categories/${id}/`,
        {
          name,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
      toast.success(t("Expense category updated successfully!"));
      setEditingExpense(null);
      setEditedExpenseName("");
    },
    onError: (error) => {
      const errorMessage = extractAxiosError(
        error,
        t("Failed to update expense")
      );
      toast.error(errorMessage);
    },
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/finance/expense-categories/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
      toast.success(t("Expense category deleted successfully!"));
    },
    onError: (error) => {
      const errorMessage = extractAxiosError(
        error,
        t("Failed to delete expense")
      );
      toast.error(errorMessage);
    },
  });

  // Handle form submission
  const onSubmit = (data: ExpenseFormData) => {
    createExpenseMutation.mutate(data);
  };

  // Handle starting the edit process for an expense
  const handleEditClick = (expense: ExpenseCategory) => {
    setEditingExpense(expense);
    setEditedExpenseName(expense.name);
  };

  // Handle canceling the edit process
  const handleCancelEdit = () => {
    setEditingExpense(null);
    setEditedExpenseName("");
  };

  // Handle saving edited expense
  const handleSaveEdit = () => {
    if (!editingExpense || !editedExpenseName.trim()) {
      toast.error(t("Expense name cannot be empty"));
      return;
    }

    updateExpenseMutation.mutate({
      id: editingExpense.id,
      name: editedExpenseName.trim(),
    });
  };

  // Handle opening the delete modal
  const handleOpenDeleteModal = (id: number) => {
    setExpenseToDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handle confirming the deletion
  const handleConfirmDelete = () => {
    if (expenseToDeleteId !== null) {
      deleteExpenseMutation.mutate(expenseToDeleteId);
      // Reset state and close modal after mutation
      setExpenseToDeleteId(null);
      setShowDeleteModal(false);
    }
  };

  // Handle canceling the deletion
  const handleCancelDelete = () => {
    setExpenseToDeleteId(null);
    setShowDeleteModal(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="font-inter text-gray-800 flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">
          {t("Loading expense categories...")}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    const errorMessage = extractAxiosError(error);
    return (
      <div className="font-inter text-gray-800 flex justify-center items-center min-h-64">
        <div className="text-lg text-red-600">
          {t("Failed to load expenses:")} {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className=" text-gray-800 flex justify-center items-start">
      <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Expense Management Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-indigo-700 mb-5">
            {t("Add New Expense")}
          </h2>

          {/* Expense Name Input */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("New Expense Name")}
            </label>
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("e.g., Food, Rent, Utilities")}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || createExpenseMutation.isPending}
                className="px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createExpenseMutation.isPending
                  ? t("Adding...")
                  : t("Add Expense")}
              </button>
            </div>
          </div>

          {/* Expense List */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {t("Your Expense List")}
            </h3>
            {expenses.length === 0 ? (
              <p className="text-gray-500 italic">
                {t("No expense added yet.")}
              </p>
            ) : (
              <ul className="space-y-3">
                {expenses.map((expense) => (
                  <li
                    key={expense.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm"
                  >
                    {editingExpense?.id === expense.id ? (
                      <div className="flex-1 flex items-center space-x-2">
                        <input
                          type="text"
                          value={editedExpenseName}
                          onChange={(e) => setEditedExpenseName(e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400"
                        />
                        <button
                          onClick={handleSaveEdit}
                          disabled={updateExpenseMutation.isPending}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition duration-150 disabled:opacity-50"
                        >
                          {updateExpenseMutation.isPending
                            ? t("Saving...")
                            : t("Save")}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={updateExpenseMutation.isPending}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition duration-150 disabled:opacity-50"
                        >
                          {t("Cancel")}
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-lg font-medium text-gray-800">
                          {expense.name}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(expense)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-sm"
                          >
                            {t("Edit")}
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(expense.id)}
                            disabled={deleteExpenseMutation.isPending}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 text-sm disabled:opacity-50"
                          >
                            {deleteExpenseMutation.isPending
                              ? t("Deleting...")
                              : t("Delete")}
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md font-inter">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm mx-auto animate-fade-in-up">
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              {t("Confirm Deletion")}
            </h3>
            <p className="text-gray-700 mb-6">
              {t(
                "Are you sure you want to delete this expense category? This action cannot be undone."
              )}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition duration-200"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteExpenseMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteExpenseMutation.isPending
                  ? t("Deleting...")
                  : t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Tailwind animation for the modal
const style = document.createElement("style");
style.innerHTML = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.3s ease-out;
  }
`;
document.head.appendChild(style);
