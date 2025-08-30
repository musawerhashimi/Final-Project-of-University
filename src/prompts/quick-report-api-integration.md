{
    "department_sales": [
        {
            "department_id": 1,
            "department": "Electronics",
            "total_quantity": "82.00",
            "total_sold": "267.33",
            "total_cost": "177.20",
            "total_profit": "90.13"
        },
        {
            "department_id": 2,
            "department": "Food",
            "total_quantity": "13.00",
            "total_sold": "68.67",
            "total_cost": "50.00",
            "total_profit": "18.67"
        },
        {
            "department_id": 3,
            "department": "Kitchen",
            "total_quantity": "4.00",
            "total_sold": "9.54",
            "total_cost": "6.39",
            "total_profit": "3.15"
        }
    ],
    "transactions": [
        {
            "id": 36,
            "description": "Amount For Dept",
            "amount": "100.00",
            "transaction_date": "2025-07-22T02:33:20.187293+04:30"
        },
        {
            "id": 37,
            "description": "",
            "amount": "1000.00",
            "transaction_date": "2025-07-22T02:34:40.380892+04:30"
        },
        {
            "id": 38,
            "description": "",
            "amount": "100.00",
            "transaction_date": "2025-07-22T02:36:27.507081+04:30"
        },
        {
            "id": 39,
            "description": "Payment",
            "amount": "10.00",
            "transaction_date": "2025-07-22T02:49:01.752581+04:30"
        },
        {
            "id": 40,
            "description": "",
            "amount": "10.00",
            "transaction_date": "2025-07-22T02:57:02.289170+04:30"
        },
        {
            "id": 41,
            "description": "",
            "amount": "10.00",
            "transaction_date": "2025-07-22T02:58:05.935347+04:30"
        },
        {
            "id": 42,
            "description": "Payment for Sale #SALE-000029",
            "amount": "0.36",
            "transaction_date": "2025-07-22T03:06:11.159108+04:30"
        },
        {
            "id": 43,
            "description": "Payment for Sale #SALE-000030",
            "amount": "0.18",
            "transaction_date": "2025-07-22T03:07:19.659090+04:30"
        },
        {
            "id": 44,
            "description": "Payment for Sale #SALE-000031",
            "amount": "24.00",
            "transaction_date": "2025-07-22T03:08:42.084249+04:30"
        },
        {
            "id": 45,
            "description": "Payment for Sale #SALE-000032",
            "amount": "2.00",
            "transaction_date": "2025-07-22T12:33:01.496818+04:30"
        },
        {
            "id": 46,
            "description": "Payment for Sale #SALE-000032",
            "amount": "2.00",
            "transaction_date": "2025-07-22T12:33:01.512938+04:30"
        },
        {
            "id": 47,
            "description": "Payment for Sale #SALE-000032",
            "amount": "8.00",
            "transaction_date": "2025-07-22T12:33:01.518914+04:30"
        },
        {
            "id": 48,
            "description": "Payment for Sale #SALE-000033",
            "amount": "2.00",
            "transaction_date": "2025-07-22T12:43:04.125376+04:30"
        },
        {
            "id": 49,
            "description": "Payment for Sale #SALE-000034",
            "amount": "2.00",
            "transaction_date": "2025-07-22T12:46:29.654867+04:30"
        },
        {
            "id": 50,
            "description": "Payment for Sale #SALE-000035",
            "amount": "1.00",
            "transaction_date": "2025-07-22T13:21:27.481428+04:30"
        },
        {
            "id": 51,
            "description": "Payment for Sale #SALE-000036",
            "amount": "1.00",
            "transaction_date": "2025-07-22T13:22:07.879297+04:30"
        },
        {
            "id": 52,
            "description": "Payment for Sale #SALE-000037",
            "amount": "2.00",
            "transaction_date": "2025-07-22T14:06:20.775959+04:30"
        }
    ],
    "cash_drawers": [
        {
            "id": 1,
            "name": "Cash Drawer",
            "description": "Main Cash Drawer",
            "location": 1,
            "amounts": [
                {
                    "id": 1,
                    "currency": 1,
                    "amount": "300.00"
                },
                {
                    "id": 4,
                    "currency": 2,
                    "amount": "599.00"
                }
            ]
        },
        {
            "id": 2,
            "name": "Bank",
            "description": "Branch 2 Cash Drawer",
            "location": 3,
            "amounts": [
                {
                    "id": 2,
                    "currency": 1,
                    "amount": "67.50"
                },
                {
                    "id": 3,
                    "currency": 2,
                    "amount": "1850.00"
                },
                {
                    "id": 6,
                    "currency": 4,
                    "amount": "200.00"
                }
            ]
        },
        {
            "id": 3,
            "name": "Second Cash",
            "description": "For Branch 2",
            "location": 3,
            "amounts": [
                {
                    "id": 5,
                    "currency": 1,
                    "amount": "-20.0000000000000"
                }
            ]
        }
    ],
    "sales_summary": {
        "revenue": 343.54,
        "cost": 232.59,
        "profit": 110.95,
        "net_profit": 110.95
    }
}

sample data coming from apiClient.get(/finance/quick-reports/summary/)

react tsx file
import React, { useState, useEffect } from "react";
import { useCurrencyStore } from "../../../stores";
import { useCashDrawerStore } from "../../../stores/useCashDrawerStore";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import RouteBox from "../../../components/RouteBox";

// Mock Data Interfaces
interface DepartmentData {
  name: string;
  cash: number;
  profit: number;
  quantity: number;
}

interface TransactionData {
  id: string;
  description: string;
  amount: number;
  date: string;
}

interface SummaryData {
  revenue: number;
  profit: number;
  netProfit: number;
}

interface ReportData {
  departments: DepartmentData[];

  transactions: TransactionData[];
  summary: SummaryData;
}

// Mock Data
const mockTodayReport: ReportData = {
  departments: [
    { name: "MDF", cash: 1000, profit: 200, quantity: 20 },
    { name: "Plywood", cash: 1500, profit: 350, quantity: 30 },
    { name: "Lumber", cash: 800, profit: 150, quantity: 15 },
  ],

  transactions: [
    { id: "T001", description: "Sale MDF", amount: 1000, date: "2025-07-20" },
    {
      id: "T002",
      description: "Purchase Glue",
      amount: -50,
      date: "2025-07-20",
    },
    {
      id: "T003",
      description: "Sale Plywood",
      amount: 1500,
      date: "2025-07-20",
    },
  ],
  summary: {
    revenue: 2500,
    profit: 700,
    netProfit: 650,
  },
};

const mockYesterdayReport: ReportData = {
  departments: [
    { name: "MDF", cash: 900, profit: 180, quantity: 18 },
    { name: "Plywood", cash: 1300, profit: 300, quantity: 25 },
    { name: "Hardware", cash: 700, profit: 100, quantity: 10 },
  ],

  transactions: [
    {
      id: "T004",
      description: "Sale Hardware",
      amount: 700,
      date: "2025-07-19",
    },
    {
      id: "T005",
      description: "Purchase Lumber",
      amount: -200,
      date: "2025-07-19",
    },
    { id: "T006", description: "Sale MDF", amount: 900, date: "2025-07-19" },
  ],
  summary: {
    revenue: 2000,
    profit: 580,
    netProfit: 500,
  },
};

// Function to generate mock data for custom range (simplified)
const generateCustomReport = (from: string, to: string): ReportData => {
  // In a real application, you would fetch data based on the date range.
  // For this example, we'll just combine and slightly modify existing data.
  const allDepartments = [
    ...mockTodayReport.departments,
    ...mockYesterdayReport.departments,
  ];

  const allTransactions = [
    ...mockTodayReport.transactions,
    ...mockYesterdayReport.transactions,
  ];

  const totalRevenue =
    mockTodayReport.summary.revenue + mockYesterdayReport.summary.revenue;
  const totalProfit =
    mockTodayReport.summary.profit + mockYesterdayReport.summary.profit;
  const totalNetProfit =
    mockTodayReport.summary.netProfit + mockYesterdayReport.summary.netProfit;

  return {
    departments: allDepartments.map((d) => ({
      ...d,
      cash: d.cash * 1.1,
      profit: d.profit * 1.1,
    })), // Just to show some change

    transactions: allTransactions,
    summary: {
      revenue: totalRevenue,
      profit: totalProfit,
      netProfit: totalNetProfit,
    },
  };
};

// Department Report Component
const DepartmentReport: React.FC<{ data: DepartmentData[] }> = ({ data }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">
      Department Report
    </h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Department Name</th>
            <th className="py-3 px-6 text-left">Cash</th>
            <th className="py-3 px-6 text-left">Profit</th>
            <th className="py-3 px-6 text-left">Quantity</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {data.map((dept, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {dept.name}
              </td>
              <td className="py-3 px-6 text-left">${dept.cash.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">${dept.profit.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">{dept.quantity} items</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Resources Report Component
function ResourcesReport() {
  const CustomTooltip = (props: {
    active?: boolean;
    payload?: { value: string }[];
    label?: string;
  }) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-gray-800 text-white rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{`${label}: ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };
  const getCurrency = useCurrencyStore((s) => s.getCurrency);
  const resources = useCashDrawerStore((s) => s.cashDrawers);
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Resources Report
      </h3>
      {resources.map((i) => (
        <div className="my-6  p-4 sm:p-6 lg:p-8 flex items-center justify-center font-inter ">
          <div className="w-full  bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header Section */}

            <div className="bg-gradient-to-r from-green-500 to-blue-700 p-6 text-white text-center rounded-t-xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {i.name} Overview
              </h1>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-8  bg-blue-200">
              {/* USD Amount and Graph */}

              <div className="bg-blue-50 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                {i.amounts.map((a) => (
                  <div className="flex-shrink-0 border border-gray-200 bg-sky-100 p-3 rounded-md  text-center md:text-left">
                    <h2 className="text-xl font-bold text-gray-500  mb-2">
                      Amount{" "}
                      <span className="text-gray-600">
                        {getCurrency(a.currency).code}
                      </span>
                    </h2>
                    <p className="text-2xl font-bold text-blue-500">
                      {a.value}
                    </p>
                  </div>
                ))}
                <div className="w-full md:w-2/3 h-48 md:h-56 bg-sky-100 rounded-lg shadow-inner p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={i.amounts.map((n) => ({
                        name: getCurrency(n.currency).code,
                        value: parseFloat(n.value),
                      }))}
                      margin={{ top: 10, right: 10, left: 20, bottom: 10 }}
                    >
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        className="text-sm text-gray-600"
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        className="text-sm text-gray-600"
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(0,0,0,0.1)" }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#4F46E5"
                        barSize={50}
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Transaction Report Component
const TransactionReport: React.FC<{ data: TransactionData[] }> = ({ data }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">
      Transaction Report
    </h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Amount</th>
            <th className="py-3 px-6 text-left">Date</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {data.map((transaction, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-6 text-left">{transaction.id}</td>
              <td className="py-3 px-6 text-left">{transaction.description}</td>
              <td className="py-3 px-6 text-left">
                ${transaction.amount.toFixed(2)}
              </td>
              <td className="py-3 px-6 text-left">{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Summary Box Component
const SummaryBox: React.FC<{ data: SummaryData }> = ({ data }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Sales Summary</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
      <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg shadow-sm">
        <span className="text-md font-medium text-blue-700 mb-3">Revenue</span>
        <span className="text-2xl font-bold text-blue-900">
          ${data.revenue.toFixed(2)}
        </span>
      </div>
      <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg shadow-sm">
        <span className="text-md font-medium text-green-700 mb-3">Profit</span>
        <span className="text-2xl font-bold text-green-900">
          ${data.profit.toFixed(2)}
        </span>
      </div>
      <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg shadow-sm">
        <span className="text-md font-medium text-purple-700 mb-3">
          Net Profit
        </span>
        <span className="text-2xl font-bold text-purple-900">
          ${data.netProfit.toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

// Main App Component
export default function QuickReport() {
  const [activeTab, setActiveTab] = useState<"today" | "yesterday" | "custom">(
    "today"
  );
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);

  // Set initial dates for custom range to today and yesterday for convenience
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    setFromDate(formatDate(yesterday));
    setToDate(formatDate(today));
  }, []);

  // Effect to update report data when activeTab or custom dates change
  useEffect(() => {
    if (activeTab === "today") {
      setCurrentReport(mockTodayReport);
    } else if (activeTab === "yesterday") {
      setCurrentReport(mockYesterdayReport);
    } else if (activeTab === "custom" && fromDate && toDate) {
      setCurrentReport(generateCustomReport(fromDate, toDate));
    }
  }, [activeTab, fromDate, toDate]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab("custom");
  };
  const routebox = [
    { path: "/reports", name: "Reports" },
    { path: "", name: "Quick Report" },
  ];
  return (
    <>
      <RouteBox items={routebox} routlength={routebox.length} />

      <div className="bg-gradient-to-br from-blue-100 to-purple-100 font-sans text-gray-900 p-4 sm:p-6 lg:p-8">
        <div className=" mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="bg-gray-100 rounded-lg  flex flex-wrap justify-center gap-6 mb-4">
            <h1 className="text-3xl font-extrabold text-center text-gray-900 mt-6">
              Quick Report
            </h1>
            <button
              onClick={() => setActiveTab("today")}
              className={`px-6 h-13 mt-4 rounded-full text-lg font-medium transition-all duration-300 ease-in-out
              ${
                activeTab === "today"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Today Report
            </button>
            <button
              onClick={() => setActiveTab("yesterday")}
              className={`px-6 h-13 mt-4 rounded-full text-lg font-medium transition-all duration-300 ease-in-out
              ${
                activeTab === "yesterday"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Yesterday Report
            </button>
            {/* Date Range Input */}
            <div className=" p-2 ">
              <form
                onSubmit={handleCustomSubmit}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <div className="flex flex-col w-full sm:w-auto">
                  <label
                    htmlFor="fromDate"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    From Date:
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 w-full"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-auto">
                  <label
                    htmlFor="toDate"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    To Date:
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 sm:mt-0 px-8 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 ease-in-out w-full sm:w-auto"
                >
                  Report
                </button>
              </form>
            </div>
          </div>

          {/* Display Report based on active tab */}
          {currentReport ? (
            <div className="space-y-6">
              <DepartmentReport data={currentReport.departments} />
              <ResourcesReport />
              <TransactionReport data={currentReport.transactions} />
              <SummaryBox data={currentReport.summary} />
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">
              Select a report tab or custom date range to view data.
            </p>
          )}
        </div>
      </div>
    </>
  );
}


hey bro, integrate these for me using @tanstack/react-query and that apiClient (axios).
if you have any question ask
