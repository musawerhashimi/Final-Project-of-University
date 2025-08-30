import { useMemo, useState } from "react";
import { useCustomers } from "../../../../hooks/useCustomers";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomerCard from "../../../customers/components/CustomerCard";
import { FaUsers } from "react-icons/fa";
import RouteBox from "../../../../components/RouteBox";
import { useTranslation } from "react-i18next";

function CustomerProfileSh() {
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
  const routebox = [{ path: "", name: t("Customers") }];

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{t("Error loading customers")}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {"Retry"}
        </button>
      </div>
    );
  }

  return (
    <>
      <RouteBox items={routebox} routlength={routebox.length} />
      {/* Search */}
      <div className="relative m-8 mb-0">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
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
      {/* Customer List */}
      <div className="flex-1 p-1 m-8 mt-4 ">
        <div
          id="scrollableDiv"
          className="rounded-xl shadow-inner p-6 w-full mx-auto  "
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-4 border-b-2 border-blue-500"></div>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12 ">
              <div className="text-slate-400 mb-2">
                <FaUsers className="mx-auto text-4xl mb-4" />
              </div>
              <p className="text-slate-500">
                {search
                  ? "No customers found matching your search."
                  : "No customers yet."}
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
    </>
  );
}

export default CustomerProfileSh;
