// components/CustomerForm.tsx
import { FaUser, FaSpinner } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCustomer } from "../../../hooks/useCustomers";
import { type CustomerFormData } from "../../../entities/Customer";
import { extractAxiosError } from "../../../utils/extractError";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface CustomerFormProps {
  onSuccess?: () => void;
}

function CustomerForm({ onSuccess }: CustomerFormProps) {
  const { t } = useTranslation();

  const customerSchema = z.object({
    name: z.string().min(1, t("Customer Name is required")),
    birth_date: z.string().optional(),
    email: z.string().email(t("Invalid email address")),
    phone: z
      .string()
      .min(10, t("Phone number must be at least 10 digits"))
      .max(15, t("Phone number cannot exceed 15 digits")),
    address: z.string().min(1, t("Address is required")),
    city: z.string().min(1, t("City is required")),
    photo: z.instanceof(File).optional(),
    gender: z.enum(["M", "F", "N"]).default("N"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      gender: "N",
    },
  });

  const createCustomerMutation = useCreateCustomer();

  const onSubmit = async (data: CustomerFormData) => {
    try {
      await createCustomerMutation.mutateAsync(data);
      reset();
      onSuccess?.();
      toast.success(t("Customer created successfully!"));
    } catch (error) {
      const errorMessage = extractAxiosError(error);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-8 bg-white shadow-2xl rounded-2xl w-full border border-slate-200">
      <h2 className="mb-8 p-4 text-2xl font-bold text-slate-800 border-b-2 border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FaUser className="text-blue-600 text-xl" />
        </div>
        {t("Add New Customer")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name and Date of Birth */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-slate-700 text-sm font-semibold">
              {t("Customer Name *")}
            </label>
            <input
              type="text"
              placeholder={t("Enter customer name")}
              {...register("name")}
              className="w-full p-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-slate-700 text-sm font-semibold">
              {t("Date of Birth *")}
            </label>
            <input
              type="date"
              {...register("birth_date")}
              className="w-full p-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {errors.birth_date && (
              <p className="text-red-500 text-sm">
                {errors.birth_date.message}
              </p>
            )}
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-slate-700 text-sm font-semibold">
              {t("Email *")}
            </label>
            <input
              type="email"
              placeholder={t("Enter email address")}
              {...register("email")}
              className="w-full p-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-slate-700 text-sm font-semibold">
              {t(" Phone *")}
            </label>
            <input
              type="tel"
              placeholder={t("Enter phone number")}
              {...register("phone")}
              className="w-full p-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Address and City */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-slate-700 text-sm font-semibold">
              {t("Address *")}
            </label>
            <input
              type="text"
              placeholder={t("Enter address")}
              {...register("address")}
              className="w-full p-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-slate-700 text-sm font-semibold">
              {t(" City *")}
            </label>
            <input
              type="text"
              placeholder={t("Enter city")}
              {...register("city")}
              className="w-full p-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="block text-slate-700 text-sm font-semibold">
            {t("Profile Photo")}
          </label>
          <input
            type="file"
            accept="image/*"
            // {...register("photo")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setValue("photo", file);
            }}
            className="w-full p-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Gender Selection */}
        <div className="space-y-3">
          <label className="block text-slate-700 text-sm font-semibold">
            {t("Gender *")}
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="M"
                {...register("gender")}
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span className="text-slate-700">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="F"
                {...register("gender")}
                className="w-4 h-4 text-pink-600 border-slate-300 focus:ring-pink-500"
              />
              <span className="text-slate-700">Female</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="N"
                {...register("gender")}
                className="w-4 h-4 text-pink-600 border-slate-300 focus:ring-pink-500"
              />
              <span className="text-slate-700">{t("Prefer Not to say")}</span>
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={createCustomerMutation.isPending}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 disabled:hover:scale-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center gap-2"
          >
            {createCustomerMutation.isPending ? (
              <>
                <FaSpinner className="animate-spin" />
                {t("Creating...")}
              </>
            ) : (
              t("Create Customer")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
