import { Edit } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import EditableField from "./EditabelField";
import {
  useCurrencyStore,
  useDepartmentStore,
  useUnitStore,
} from "../../../../stores";
import apiClient from "../../../../lib/api";
import { extractAxiosError } from "../../../../utils/extractError";
import {
  productSchema,
  type ProductFormData,
} from "../../../../schemas/productDeatilsValidation";
import { useTranslation } from "react-i18next";

// Define the structure for our product details
interface ProductDetails {
  id: number;
  name: string;
  available: number;
  sold: number;
  returned: number;
  purchased: number;
  department: number;
  category: number;
  reorder_level: number;
  description: string;
  base_unit: number;
  selling_currency: number;
  selling_price: string;
  image_url?: string | null;
  barcode: string;
}

interface ProductDetailsPageProps {
  productId: number;
}

// Main Product Details Page Component
function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const currency = useCurrencyStore((s) => s.currencies);
  const unitChangeOptions = useUnitStore((s) => s.units);
  const departments = useDepartmentStore((s) => s.departments);

  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
  const [image, setImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      department: 0,
      category: 0,
      base_unit: 0,
      reorder_level: 0,
      description: "",
      selling_price: "0.00",
      selling_currency: 0,
    },
  });

  const watchedDepartment = watch("department");

  // Get categories for selected department
  const selectedDepartmentData = departments.find(
    (dept) => dept.id === selectedDepartment
  );
  const categories = selectedDepartmentData?.categories || [];

  // Fetch product data
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await apiClient.get(`/catalog/products/${productId}/`);
      return response.data as ProductDetails;
    },
    enabled: !!productId,
  });

  // Update form when product data is loaded
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        department: product.department,
        category: product.category,
        base_unit: product.base_unit,
        reorder_level: product.reorder_level,
        description: product.description || "",
        selling_price: product.selling_price,
        selling_currency: product.selling_currency,
      });
      setSelectedDepartment(product.department);
      setImage(product.image_url || "");
    }
  }, [product, reset]);

  // Handle department change - set first category when department changes
  useEffect(() => {
    if (watchedDepartment !== selectedDepartment && watchedDepartment > 0) {
      setSelectedDepartment(watchedDepartment);

      // Find the selected department and set first category if available
      const dept = departments.find((d) => d.id === watchedDepartment);
      if (dept && dept.categories && dept.categories.length > 0) {
        setValue("category", dept.categories[0].id);
      } else {
        setValue("category", 0); // Clear category if no categories available
      }
    }
  }, [watchedDepartment, selectedDepartment, setValue, departments]);

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await apiClient.put(
        `/catalog/products/${productId}/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("Product updated successfully!"));
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (error) => {
      const errorMessage = extractAxiosError(
        error,
        t("Failed to update product")
      );
      toast.error(errorMessage);
    },
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const response = await apiClient.post(
        `/catalog/products/${productId}/upload-image/`,
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
      toast.success(t("Image uploaded successfully!"));
      setImage(data.image);
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (error) => {
      const errorMessage = extractAxiosError(
        error,
        t("Failed to upload image")
      );
      toast.error(errorMessage);
    },
  });

  // Handle form submission
  const onSubmit = (data: ProductFormData) => {
    updateProductMutation.mutate(data);
  };

  // Handle image change and upload immediately
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      uploadImageMutation.mutate(file);
    }
  };

  // Edit image handler
  const handleEditImage = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="bg-white w-full rounded-3xl shadow-2xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = extractAxiosError(error, t("Failed to load product"));
    return (
      <div className="bg-white w-full rounded-3xl shadow-2xl p-6">
        <div className="text-red-600">
          {t("Error:")} {errorMessage}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white w-full rounded-3xl shadow-2xl p-6">
        <div>{t("Product not found")}</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white w-full rounded-3xl shadow-2xl"
    >
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-blue-100 text-white p-6 text-center rounded-t-2xl">
        <div className="relative">
          {image ? (
            <img
              src={image}
              alt="Product Image"
              className="h-auto w-full border-1 border-gray-300 shadow"
            />
          ) : (
            <div className="h-full bg-gray-300 flex items-center justify-center">
              <FaPlus className="h-25 w-25 bg-blue-500 text-white rounded-full p-2" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            type="button"
            className="absolute bottom-0 end-0 text-blue-500"
            title={t("Edit Image")}
            onClick={handleEditImage}
            disabled={uploadImageMutation.isPending}
          >
            <Edit className="h-10 w-10" />
          </button>
          {uploadImageMutation.isPending && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white">{t("Uploading...")}</div>
            </div>
          )}
        </div>

        <div className="border-y border-gray-400">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <EditableField
                label={t("Product Name")}
                value={field.value}
                type="text"
                onSave={field.onChange}
                className="mx-auto mb-8 mt-3 w-80 bg-gray-100 rounded-xl"
                error={errors.name?.message}
              />
            )}
          />

          <p className="font-semibold text-gray-500">Barcode Number</p>
          <p className="font-bold text-blue-600">{product.barcode}</p>

          {/* Product History Section */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">
              {t("Product History")}
            </h2>
            <div className="bg-blue-200">
              <table className="w-full text-black">
                <tr className="border-2 border-gray-200">
                  <th className="p-1 bg-green-100">{t("Available")}</th>
                  <td>{product.available}</td>
                </tr>
                <tr className="border-2 border-gray-200">
                  <th className="p-1 bg-green-100">{t("Purchase")}</th>
                  <td>{product.purchased}</td>
                </tr>
                <tr className="border-2 border-gray-200">
                  <th className="p-1 bg-green-100">{t("Sold")}</th>
                  <td>{product.sold}</td>
                </tr>
                <tr className="border-2 border-gray-200">
                  <th className="p-1 bg-green-100">{t("Returned")}</th>
                  <td>{product.returned}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div className="p-2 border border-gray-400">
          {/* Product Specifications Section */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">
              {t("Product Details")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <EditableField
                    label={t("Department")}
                    value={
                      departments.find((dept) => dept.id === field.value)
                        ?.name || t("Select Department")
                    }
                    options={departments.map((dept) => dept.name)}
                    type="select"
                    className="mx-auto w-40 mt-2 bg-gray-100 rounded-xl"
                    onSave={(val) => {
                      const dept = departments.find((d) => d.name === val);
                      if (dept) field.onChange(dept.id);
                    }}
                    error={errors.department?.message}
                  />
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <EditableField
                    label={t("Category")}
                    value={
                      categories.find((cat) => cat.id === field.value)?.name ||
                      t("Select Category")
                    }
                    type="select"
                    options={categories.map((cat) => cat.name)}
                    className="mx-auto w-40 mt-2 bg-gray-100 rounded-xl"
                    onSave={(val) => {
                      const cat = categories.find((c) => c.name === val);
                      if (cat) field.onChange(cat.id);
                    }}
                    error={errors.category?.message}
                    disabled={!selectedDepartment || categories.length === 0}
                  />
                )}
              />

              <Controller
                name="reorder_level"
                control={control}
                render={({ field }) => (
                  <EditableField
                    label={t("Reorder Level")}
                    value={field.value}
                    className="mx-auto w-40 mt-2 bg-gray-100 rounded-xl"
                    type="number"
                    onSave={(val) => field.onChange(Number(val))}
                    error={errors.reorder_level?.message}
                  />
                )}
              />

              <Controller
                name="base_unit"
                control={control}
                render={({ field }) => (
                  <EditableField
                    label={t("Unit")}
                    value={
                      unitChangeOptions.find((unit) => unit.id === field.value)
                        ?.abbreviation || ""
                    }
                    type="select"
                    options={unitChangeOptions.map((unit) => unit.abbreviation)}
                    className="mx-auto w-40 mt-2 bg-gray-100 rounded-xl"
                    onSave={(val) => {
                      const unit = unitChangeOptions.find(
                        (u) => u.abbreviation === val
                      );
                      if (unit) field.onChange(unit.id);
                    }}
                    error={errors.base_unit?.message}
                  />
                )}
              />

              <Controller
                name="selling_price"
                control={control}
                render={({ field }) => (
                  <EditableField
                    label={t("Selling Price")}
                    value={field.value}
                    type="text"
                    className="mx-auto w-40 mt-2 bg-gray-100 rounded-xl"
                    onSave={field.onChange}
                    error={errors.selling_price?.message}
                  />
                )}
              />

              <Controller
                name="selling_currency"
                control={control}
                render={({ field }) => (
                  <EditableField
                    label={t("Currency")}
                    value={
                      currency.find((c) => c.id === field.value)?.code || ""
                    }
                    options={currency.map((c) => c.code)}
                    className="mx-auto w-40 mt-2 bg-gray-100 rounded-xl"
                    type="select"
                    onSave={(val) => {
                      const curr = currency.find((c) => c.code === val);
                      if (curr) field.onChange(curr.id);
                    }}
                    error={errors.selling_currency?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-800">
          {t("Description")}
        </h2>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <EditableField
              label={t("Product Description")}
              value={field.value || ""}
              type="textarea"
              onSave={field.onChange}
              className="block w-full text-gray-700 leading-relaxed"
              error={errors.description?.message}
            />
          )}
        />

        <button
          type="submit"
          disabled={updateProductMutation.isPending || !isDirty}
          className="font-extrabold text-white px-6 py-2 w-100 mt-6 bg-green-500 hover:bg-green-700 disabled:bg-gray-400 rounded-4xl"
        >
          {updateProductMutation.isPending ? t("Updating...") : t("Submit")}
        </button>
      </div>
    </form>
  );
}

export default ProductDetailsPage;
