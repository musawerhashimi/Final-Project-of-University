import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEye, FaEdit, FaUser, FaTimes } from "react-icons/fa";
import { Button } from "primereact/button";
import ReceiptDialog from "../../../sales/components/ReceiptDialog";
import { Link } from "react-router-dom";
import { apiClient } from "../../../../lib/api";
import { formatLocalDateTime } from "../../../../utils/formatLocalDateTime";
import { useCurrencyStore } from "../../../../stores/useCurrencyStore";
import type {
  Customer,
  UpdateCustomerRequest,
} from "../../../../entities/Customer";
import { type Receipt } from "../../../../entities/Receipt";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

interface RightsideProfileProps {
  items: Customer;
  onRefetch: () => void;
}

export default function RightsideProfile({
  items,
  onRefetch,
}: RightsideProfileProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedSale, setSelectedSale] = useState<Receipt | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const getBaseCurrency = useCurrencyStore((s) => s.getBaseCurrency);

  const [formData, setFormData] = useState<UpdateCustomerRequest>({
    name: items.name || "",
    email: items.email || "",
    address: items.address || "",
    phone: items.phone || "",
    city: items.city || "",
    birth_date: items.birth_date || null,
    gender: items.gender === "Male" ? "M" : "F",
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async (data: UpdateCustomerRequest) => {
      const response = await apiClient.put(
        `/customers/customers/${items.id}/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer", items.id.toString()],
      });
      setVisible(false);
      toast.success(t("Customer updated successfully!"));
      onRefetch();
    },
    onError: (error: AxiosError<{ errors: Record<string, string> }>) => {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        toast.error(t("Failed to update customer"));
        console.error(t("Error updating customer:"), error);
      }
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setFormErrors({});
    updateCustomerMutation.mutate(formData);
  };

  const formatAmount = (
    amount: string | number,
    currencyId?: number
  ): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    const currency = currencyId || getBaseCurrency()?.id;
    return formatPriceWithCurrency(numAmount, currency);
  };

  return (
    <>
      {selectedSale && (
        <ReceiptDialog
          visible={true}
          onHide={() => setSelectedSale(null)}
          receipt={selectedSale}
        />
      )}

      <div className="flex justify-end mb-8 space-x-4">
        <Link
          to={`/customers/${items.id}/statement`}
          className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {t("Statement")}
        </Link>
        <Button
          className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          label={t("Edit Profile")}
          icon={<FaEdit className="me-2" />}
          onClick={() => setVisible(true)}
        />
      </div>

      {/* Edit Profile Modal */}
      {visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-1/2  mx-4 max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b ">
              <h2 className="text-xl font-bold text-gray-800">
                {t("Edit Customer Profile")}
              </h2>
              <button
                onClick={() => setVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6 ">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("Full Name")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("Enter full name")}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("Email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("Enter email address")}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("Phone Number")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("Enter phone number")}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("Address")}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("Enter address")}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("City")}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("Enter city")}
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t(" Birth Date")}
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date || undefined}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formErrors.birth_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.birth_date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("Gender")}
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        checked={formData.gender === "M"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span>{t("Male")}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="F"
                        checked={formData.gender === "F"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span>{t("Female")}</span>
                    </label>
                  </div>
                  {formErrors.gender && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setVisible(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={updateCustomerMutation.isPending}
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={updateCustomerMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updateCustomerMutation.isPending
                  ? t("Updating...")
                  : t("Update Profile")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Total Purchases Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div className="p-3">
            <h3 className="text-gray-500 mb-3">{t("Total Purchases")}</h3>
            <p className="text-2xl font-bold text-gray-800">
              {formatAmount(items.total_purchases)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {items.purchase_count} {t("Transactions")}
            </p>
          </div>
          <div className="bg-blue-100 rounded-full p-3">
            <span className="text-blue-600 text-2xl">🏆</span>
          </div>
        </div>

        {/* Customer Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-gray-600 mb-3">{t("Account Balance")}</h3>
            <p className="text-2xl font-bold text-gray-800">
              {formatAmount(items.balance)}
            </p>
          </div>
          <div className="bg-gray-100 rounded-full p-3">
            <FaUser size={28} className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {t("Purchase History")}
        </h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-auto w-96 md:w-full">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 text-nowrap">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t("Sale Number")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t("Date")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t("Amount")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t("Status")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t("Items")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.sales?.map((sale: Receipt) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {sale.sale_number}
                    </td>
                    <td className="px-4 py-3">
                      {formatLocalDateTime(sale.sale_date)}
                    </td>
                    <td className="px-4 py-3">
                      {formatAmount(sale.total_amount, sale.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          sale.status === "Processed"
                            ? "bg-green-100 text-green-800"
                            : sale.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {sale.items_count} {t("items")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors duration-200"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!items.sales || items.sales.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              {t("No purchase history found")}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
