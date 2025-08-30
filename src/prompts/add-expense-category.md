import { useState } from "react";

export interface Expense {
  id: number;
  name: string;
}

export default function ExpenseAddList() {
  const expenses: Expense[] = [
    { id: 1, name: "Rent" },
    { id: 2, name: "Car pay" },
    { id: 3, name: "Food" },
    { id: 4, name: "Other" },
  ];
  // State for managing expense names

  // State for the currently edited expense
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  // State for the input field when editing an expense
  const [editedExpenseName, setEditedExpenseName] = useState<string>("");

  // Handle starting the edit process for an expense
  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setEditedExpenseName(expense.name);
  };

  // Handle canceling the edit process
  const handleCancelEdit = () => {
    setEditingExpense(null);
    setEditedExpenseName("");
  };

  return (
    <div className="font-inter text-gray-800 flex justify-center items-start">
      <div className=" w-full grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Expense Management Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-indigo-700 mb-5">
            Add New Expense
          </h2>

          {/* Expense Name Input */}
          <div className="mb-6">
            <label
              htmlFor="newExpenseName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Expense Name
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                id="newExpenseName"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                placeholder="e.g., Groceries, Rent, Utilities"
                onKeyPress={(e) => {
                  if (e.key === "Enter") console.log("Hi");
                }}
              />
              <button className="px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200">
                Add Expense
              </button>
            </div>
          </div>

          {/* Expense List */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Your Expense List
            </h3>
            {expenses.length === 0 ? (
              <p className="text-gray-500 italic">No expense added yet.</p>
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
                        <button className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition duration-150">
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition duration-150"
                        >
                          Cancel
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
                            Edit
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
    </div>
  );
}


hey bro
this is the

endpoint: apiClient.get(/finance/expense-categories/)

data:

[
    {
        "id": 5,
        "name": "Advertisement",
        "description": ""
    },
    {
        "id": 2,
        "name": "Central Store Rent",
        "description": "Rent For Central Store"
    },
    {
        "id": 1,
        "name": "Electricity",
        "description": "Electricity Payments"
    },
    {
        "id": 3,
        "name": "Internet Bill",
        "description": ""
    },
    {
        "id": 4,
        "name": "Water Bill",
        "description": ""
    }
]
accepts put too.

connect the front to backend using the apiClient which i already configured it.
is here needed to use react-query too, if yes you can use that i configured that too.
any q, ask before you proceed