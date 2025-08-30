import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useDirection } from "../../../../hooks/useDirection";

interface Payment {
  id: number;
  expenseId: string; // Link to the expense
  amount: number;
  currency: string;
  date: string;
  expence_name: string;
}

function ExpensePayment() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .bg-blue-50 { background-color: #ebf8ff !important; }
        .bg-green-50 { background-color: #f0fff4 !important; }
      }
    `,
  });
  const direction = useDirection();
  const payments: Payment[] = [
    {
      id: 1,
      expenseId: "23",
      amount: 40000,
      currency: "USD",
      date: "10/03/2025",
      expence_name: "کرایه دوکان",
    },
    {
      id: 2,
      expenseId: "23",
      amount: 20000,
      currency: "USD",
      date: "10/03/2025",
      expence_name: "Food",
    },
    {
      id: 3,
      expenseId: "24",
      amount: 30000,
      currency: "AFG",
      date: "10/03/2025",
      expence_name: "Rent",
    },
  ];
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-green-700 mb-5">
        Record an Expense Payment
      </h2>

      {/* Amount Input */}
      <div className="mb-4">
        <label
          htmlFor="paymentAmount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Amount
        </label>
        <input
          type="number"
          id="paymentAmount"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200"
          placeholder="e.g., 50.00"
        />
      </div>

      {/* Currency Select */}
      <div className="mb-4">
        <label
          htmlFor="paymentCurrency"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Currency
        </label>
        <select
          id="paymentCurrency"
          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">AFG</option>

          {/* Add more currencies as needed */}
        </select>
      </div>

      {/* Expense Select */}
      <div className="mb-6">
        <label
          htmlFor="selectExpense"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Expense Category
        </label>
        <select
          id="selectExpense"
          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200"
        >
          <option value="">Select an Expense</option>
          {/* {expenseNames.map((expense) => (
            <option key={expense.id} value={expense.id}>
              {expense.name}
            </option>
          ))} */}
          <option value="test">Expence Shop 3</option>
          <option value="test">Expence Shop 1</option>
          <option value="test">Expence Shop 2</option>
        </select>
      </div>

      {/* Submit Button */}
      <button className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200">
        Record Payment
      </button>

      {/* Payments List (Optional, but useful for tracking) */}
      <div className="mt-8 p-4 relative" dir={direction} ref={contentRef}>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Expense Payments List "Today"
        </h3>
        {/* PDF Button */}
        <button
          className="absolute top-3 right-3 bg-orange-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded shadow print:hidden"
          title="Download PDF"
          onClick={reactToPrintFn}
        >
          PDF
        </button>
        {payments.length === 0 ? (
          <p className="text-gray-500 italic">No payments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto mx-auto w-96 md:w-full print:w-full shadow-md rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-blue-100">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-tl-lg">
                    Expense Name
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Expense Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Payment Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 rounded-tr-lg print:hidden"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {payment.expence_name}
                    </td>

                    <td className="px-6 py-4">
                      {payment.amount.toLocaleString()} {payment.currency}
                    </td>
                    <td className="px-6 py-4">{payment.date}</td>
                    <td className="print:hidden">
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpensePayment;


api endpoint: apiClient.get(/finance/expenses)

data:
[
    {
        "id": 3,
        "expense_number": "EXP-20250729-0003",
        "expense_category": "Electricity",
        "amount": "100.00",
        "currency": 2,
        "expense_date": "2025-07-29T22:52:50.371745Z",
        "description": "Bill Again",
        "cash_drawer": 3
    },
    {
        "id": 2,
        "expense_number": "EXP-20250729-0002",
        "expense_category": "Electricity",
        "amount": "100.00",
        "currency": 2,
        "expense_date": "2025-07-29T22:52:14.163036Z",
        "description": "Bill",
        "cash_drawer": 3
    },
    {
        "id": 1,
        "expense_number": "EXP-20250729-0001",
        "expense_category": "Electricity",
        "amount": "100.00",
        "currency": 2,
        "expense_date": "2025-07-29T00:00:00Z",
        "description": "Bill",
        "cash_drawer": 3
    }
]

accepts post get and delete

connect my fron to backend
add cash drawer and description to form
for cash drawer label it as resources
it should be a dropdown, the data comes from userCashDrawerStore(s => s.cashDrawers); located in /stores/userCashDrawerStore
which is array of {id, name}
expense categories come from apiClient.get(/finance/expense-categories/)

add missing fields to the table, use cashDrawer id and find the cashDrawer and get name to display in the table.
use formatPriceWithCurrency coming from useCurrencyStore located in /stores/useCurrencyStore
use zod and react hook form for form validation
use sonner toast for success and error messages
wrap errors in extractAxiosError(error, default_message): string located in /utils/extractError

apiCLient is an axios instance and is pre configured
use react query
expense-categories key: ["expense-categories"]

if you have any other question ask, before you proceed