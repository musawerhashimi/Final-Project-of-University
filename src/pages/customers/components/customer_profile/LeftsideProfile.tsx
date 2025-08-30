import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaChevronCircleDown,
  FaEnvelope,
  FaMap,
  FaMapMarkedAlt,
  FaPhone,
  FaCamera,
} from "react-icons/fa";
import DiscountCircle from "./DiscountBox";
import { apiClient } from "../../../../lib/api";
// import { useCurrencyStore } from "../../../../stores/useCurrencyStore";
import type {
  Customer,
  PhotoUpdateResponse,
} from "../../../../entities/Customer";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface LeftsideProfileProps {
  items: Customer;
  onRefetch: () => void;
}

export default function LeftsideProfile({
  items,
  onRefetch,
}: LeftsideProfileProps) {
  const [image, setImage] = useState<string>(items.photo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  // const formatPriceWithCurrency = useCurrencyStore(
  //   (s) => s.formatPriceWithCurrency
  // );
  // const getBaseCurrency = useCurrencyStore((s) => s.getBaseCurrency);

  const photoUploadMutation = useMutation({
    mutationFn: async (file: File): Promise<PhotoUpdateResponse> => {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await apiClient.patch(
        `/customers/customers/${items.id}/photo/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setImage(data.photo);
      queryClient.invalidateQueries({
        queryKey: ["customer", items.id.toString()],
      });
      toast.success(t("Photo updated successfully!"));
      onRefetch();
    },
    onError: (error) => {
      console.error(t("Error uploading photo:"), error);
      toast.error(t("Failed to upload photo"));
      // Revert to original image on error
      setImage(items.photo);
    },
  });

  const handleEditImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setImage(ev.target.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      photoUploadMutation.mutate(file);
    }
  };

  // const formatBalance = (balance: string | number): string => {
  //   const numBalance =
  //     typeof balance === "string" ? parseFloat(balance) : balance;
  //   const currency = getBaseCurrency()?.id;
  //   return formatPriceWithCurrency(numBalance, currency);
  // };

  return (
    <>
      <div className="relative flex justify-center mb-2">
        <img
          src={image}
          alt="Customer Photo"
          className="w-40 h-40 object-cover rounded-full border-4 border-blue-400 shadow"
        />
        <button
          className="absolute bottom-2 right-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition"
          title="Edit Image"
          onClick={handleEditImage}
          disabled={photoUploadMutation.isPending}
        >
          {photoUploadMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FaCamera className="h-4 w-4" />
          )}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <h2 className="text-md font-semibold text-gray-700 mb-1 text-center border-2 shadow-md border-gray-200 rounded-md">
        {items.name}
      </h2>

      <nav>
        <ul className="mt-3 bg-white shadow-lg p-2 border-t border-gray-200 rounded-md">
          <h1 className="text-center p-2 border-b border-gray-200 mb-3">
            {t("Customer Informations")}
          </h1>
          <li className="mb-4">
            <FaPhone className="inline me-1" /> {items.phone}
          </li>
          <li className="mb-4">
            <FaEnvelope className="inline me-1" /> {items.email}
          </li>
          <li className="mb-4">
            <FaMapMarkedAlt className="inline me-1" /> {items.address}
          </li>
          <li className="mb-4">
            <FaMap className="inline me-1" /> {items.city}
          </li>
        </ul>
      </nav>

      <div className="bg-white p-6 rounded-lg shadow-lg border-t border-gray-200 text-center mt-6">
        <h3 className="text-gray-600 mb-4">{t("Customer Account Balance")}</h3>
        <div className="bg-gray-100 rounded-md p-2 text-green-500">
          {Object.entries({ USD: items.balance }).map(([currency, balance]) => (
            <div key={currency}>
              <p className="text-3xl font-bold mb-2">
                {parseFloat(balance).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mb-2">({currency})</p>
            </div>
          ))}
          <div className="flex justify-center mt-3">
            <button className="bg-red-100 rounded-full p-2 flex items-center justify-center">
              <FaChevronCircleDown size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border-t border-gray-200 rounded-lg shadow-md flex flex-col items-center mt-6">
        <h3 className="text-gray-600 mt-4 text-center">
          {t("Customer Unique Discount")}
        </h3>
        <DiscountCircle label="Discount" percentage={0} />
      </div>
    </>
  );
}
