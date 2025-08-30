import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import { useVendorStore } from "../../../../../stores";
import { toast } from "sonner";
import {
  contactSchema,
  type ContactFormData,
} from "../../../../../schemas/vendorAddFormValidation";
import { useTranslation } from "react-i18next";

// Define props for the ContactForm component
interface ContactFormProps {
  initialData?: {
    // Optional initial data for update operations
    id: number; // Unique identifier for the contact
    name: string;
    email: string;
    phone?: string;
  };
}

function ContactForm({ initialData }: ContactFormProps) {
  const { t } = useTranslation();
  const isUpdateMode = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
    },
  });
  const { createVendor, updateVendor } = useVendorStore();

  const handleFormSubmit = async (data: ContactFormData) => {
    if (isUpdateMode) {
      const { error } = await updateVendor(initialData.id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      if (error) toast.error(error);
      else {
        toast.success(t("Vendor updated successfully!"));
      }
      return;
    }
    const { error } = await createVendor(data);
    if (error) toast.error(error);
    else {
      toast.success(t("Vendor added successfully!"));
      reset(); // Reset form only on successful creation
    }
  };

  return (
    <div className="p-4 sm:p-8 font-inter flex items-center justify-center">
      {/* Toast notifications */}
      <div className="w-full  bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
          {isUpdateMode ? t("Update Vendor") : t("Add New Vendor")}
        </h2>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid grid-cols-1 md:grid-cols-2  gap-4"
        >
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
            >
              {t("Name")}:
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm"
              placeholder="e.g., Ali Ahmadi"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
            >
              {t("Email")}:
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm"
              placeholder="e.g., ali.ahmadi@example.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
            >
              {t("Phone")}:
            </label>
            <input
              id="phone"
              type="text" // Use type="text" for phone to allow for various formats (e.g., with '+')
              {...register("phone")}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm"
              placeholder="e.g., +1234567890 or 0789123456"
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>
          {!isUpdateMode && (
            <div className="space-y-2">
              <label className="block text-slate-700 text-sm font-semibold">
                {t("Profile Photo")}
              </label>
              <input
                type="file"
                accept="image/*"
                {...(register("photo"),
                { onChange: (e) => setValue("photo", e.target.files?.[0]) })}
                className="w-full p-1.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {errors.photo && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.photo.message}
                </p>
              )}
            </div>
          )}
          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold px-10 py-4 rounded-full shadow-lg transform transition-all duration-300  focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center gap-2 mx-auto text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {isSubmitting
                ? t("Saving...")
                : isUpdateMode
                ? t("Update Vendor")
                : t("Add New Vendor")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
