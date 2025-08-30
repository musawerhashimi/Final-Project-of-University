import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Define the interface for the component props for type safety
interface UnauthorizedPageProps {
  redirectUrl?: string;
  redirectText?: string;
  title?: string;
  message?: string;
}

// SVG Icon for the lock
const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

// Main Unauthorized Page Component
function UnAuthorized({
  redirectUrl = "/",
  redirectText,
  title,
  message,
}: UnauthorizedPageProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="w-full max-w-md mx-auto p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-200 dark:bg-red-900/30 rounded-full">
            <LockIcon className="w-16 h-16 text-red-500 dark:text-red-400" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          {title || t("unauthorized.title")}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {message || t("unauthorized.message")}
        </p>
        <Link
          to={redirectUrl}
          className="inline-block px-8 py-4 text-lg font-semibold text-white bg-red-500 rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          {redirectText || t("unauthorized.redirectText")}
        </Link>
      </div>
    </div>
  );
}

export default UnAuthorized;
