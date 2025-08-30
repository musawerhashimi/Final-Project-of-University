import { Link } from "react-router-dom";
import type { ListCustomer } from "../../../entities/Customer";

interface CustomerCardProps {
  customer: ListCustomer;
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Link to={`/customers/${customer.id}`} className="block group">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transform hover:scale-[1.01] transition-all duration-200 shadow-sm hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
            {customer.name ? customer.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
              {customer.name || "Unnamed Customer"}
            </h3>
            <p className="text-sm text-slate-500 truncate">
              {customer.email || "No email provided"}
            </p>
          </div>
          <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
