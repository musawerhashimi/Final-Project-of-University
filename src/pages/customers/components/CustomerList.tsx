// components/CustomerList.tsx
import { FaUsers } from "react-icons/fa";
import { useState, useMemo } from "react";

import { useCustomers } from "../../../hooks/useCustomers";
import InfiniteScroll from "react-infinite-scroll-component";

import CustomerCard from "./CustomerCard";
import { useTranslation } from "react-i18next";

export default function CustomerList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { t } = useTranslation();
  // Debounce search
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useCustomers(debouncedSearch);

  const customers = data?.pages.flatMap((page) => page.results) || [];
  const totalCount = data?.pages[0]?.count || 0;

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{t("Error loading customers")}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {t("Retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-2xl border border-slate-200">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-white rounded-t-2xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            {t("Customers")}
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {totalCount}
            </span>
          </h1>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Search customers...")}
            className="w-full p-3 pl-10 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          />
          <div className="absolute left-3 top-3.5 text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="flex-1 p-1 overflow-hidden ">
        <div
          id="scrollableDiv"
          className="h-[830px] overflow-auto rounded-xl bg-white shadow-inner "
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">
                <FaUsers className="mx-auto text-4xl mb-4" />
              </div>
              <p className="text-slate-500">
                {search
                  ? t("No customers found matching your search.")
                  : t("No customers yet.")}
              </p>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={customers.length}
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              loader={
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              }
              scrollableTarget="scrollableDiv"
              className="space-y-2 py-4 px-2"
            >
              {customers.map((customer, index) => (
                <CustomerCard
                  key={`${customer.id}-${index}`}
                  customer={customer}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>

      {isFetching && !isLoading && (
        <div className="text-center py-2 text-sm text-slate-500">
          {t("Updating...")}
        </div>
      )}
    </div>
  );
}
