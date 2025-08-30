import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Define the interface for the component props for type safety
interface NotFoundPageProps {
  redirectUrl?: string;
  redirectText?: string;
  title?: string;
  message?: string;
}

// A friendly ghost icon component
const GhostIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
      fill="currentColor"
      className="text-gray-200 dark:text-gray-700"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18a6 6 0 006-6H6a6 6 0 006 6z"
      fill="currentColor"
      className="text-gray-800 dark:text-gray-300"
    />
    <path
      d="M12 5C9.239 5 7 7.239 7 10v1h10v-1c0-2.761-2.239-5-5-5z"
      fill="currentColor"
      className="text-gray-800 dark:text-gray-300"
    />
    <circle cx="9.5" cy="10.5" r="1" fill="white" className="dark:fill-black" />
    <circle
      cx="14.5"
      cy="10.5"
      r="1"
      fill="white"
      className="dark:fill-black"
    />
    <path
      d="M12 14c-1.473 0-2.756.802-3.465 2h6.93c-.709-1.198-1.992-2-3.465-2z"
      fill="white"
      className="dark:fill-black"
    />
  </svg>
);

// Main 404 Page Component
function NotFound({
  redirectUrl = "/",
  redirectText,
  title,
  message,
}: NotFoundPageProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      <div className="w-full max-w-lg mx-auto p-8 text-center">
        <div className="flex justify-center mb-8 animate-bounce">
          <GhostIcon className="w-40 h-40 text-blue-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white mb-4">
          {title || t("notFound.title")}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
          {message || t("notFound.message")}
        </p>
        <Link
          to={redirectUrl}
          className="inline-block px-8 py-4 text-lg font-bold text-white bg-blue-500 rounded-full shadow-2xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 transform hover:-translate-y-1"
        >
          {redirectText || t("notFound.redirectText")}
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
