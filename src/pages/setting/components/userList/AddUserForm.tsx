import { Controller, useForm } from "react-hook-form";
import { useLocationStore } from "../../../../stores/useLocationStore";
import { useCreateUser, type CreateUserPayload } from "./UserList";
import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";
import { extractAxiosError } from "../../../../utils/extractError";
import { FormField } from "./FormField";
import { roles } from "../../../../data/roles";
import { ImageUpload } from "./ImageUpload";
import { useTranslation } from "react-i18next";
export const AddUserForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const locations = useLocationStore((s) => s.locations);
  const createUserMutation = useCreateUser();

  const createUserSchema = z
    .object({
      first_name: z.string().min(1, "First name is required"),
      last_name: z.string().min(1, "Last name is required"),
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(1, "Phone number is required"),
      role_name: z.string().min(1, "Role is required"),
      location_id: z.string().min(1, "Location is required"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
      photo: z.instanceof(File).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  type FormData = z.infer<typeof createUserSchema>;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      role_name: "",
      location_id: locations[0]?.id.toString() || "",
      password: "",
      confirmPassword: "",
    },
  });
  const { t } = useTranslation();
  const onSubmit = async (data: FormData) => {
    try {
      const { confirmPassword, ...payload } = data;
      await createUserMutation.mutateAsync(payload as CreateUserPayload);
      onClose();
    } catch (error) {
      const errorMessage = extractAxiosError(error, t("Failed to create user"));
      setError("root", {
        message: errorMessage,
      });
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 rounded-lg bg-background-primary-users text-text-primary-users border ${
      hasError ? "border-red-500" : "border-border-primary-users"
    } focus:outline-none focus:ring-2 focus:ring-accent-primary-users transition-colors`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField error={errors.first_name?.message}>
          <input
            {...register("first_name")}
            placeholder={t("First Name")}
            className={inputClass(!!errors.first_name)}
          />
        </FormField>

        <FormField error={errors.last_name?.message}>
          <input
            {...register("last_name")}
            placeholder={t("Last Name")}
            className={inputClass(!!errors.last_name)}
          />
        </FormField>

        <FormField error={errors.username?.message}>
          <input
            {...register("username")}
            placeholder={t("Username")}
            className={inputClass(!!errors.username)}
          />
        </FormField>

        <FormField error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder={t("Email")}
            className={inputClass(!!errors.email)}
          />
        </FormField>

        <FormField error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="tel"
            placeholder={t("Phone")}
            className={inputClass(!!errors.phone)}
          />
        </FormField>

        <FormField error={errors.role_name?.message}>
          <select
            {...register("role_name")}
            className={inputClass(!!errors.role_name)}
          >
            <option value="">{t("Select a Role")}</option>
            {roles.map((role) => (
              <option key={role.name} value={role.name}>
                {role.value}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField
        label={t("Profile Photo (optional)")}
        error={errors.photo?.message}
      >
        <Controller
          control={control}
          name="photo"
          render={({ field: { value, onChange } }) => (
            <ImageUpload
              value={value}
              onChange={onChange}
              error={errors.photo?.message}
            />
          )}
        />
      </FormField>

      <FormField error={errors.location_id?.message}>
        <select
          {...register("location_id")}
          className={inputClass(!!errors.location_id)}
        >
          <option value="">{t("Select Store")}</option>
          {locations.map(
            (location) =>
              location.location_type === "store" && (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              )
          )}
        </select>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField error={errors.password?.message}>
          <input
            {...register("password")}
            type="password"
            placeholder={t("Password")}
            className={inputClass(!!errors.password)}
          />
        </FormField>

        <FormField error={errors.confirmPassword?.message}>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder={t("Confirm Password")}
            className={inputClass(!!errors.confirmPassword)}
          />
        </FormField>
      </div>

      {errors.root && (
        <p className="text-sm text-red-500">{errors.root.message}</p>
      )}

      <div className="flex justify-end pt-4 space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 font-semibold text-text-secondary-users bg-background-accent-users rounded-lg hover:bg-border-primary-users transition-colors"
        >
          {t("Cancel")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || createUserMutation.isPending}
          className="px-6 py-2.5 font-semibold text-white bg-accent-primary-users rounded-lg shadow-md hover:bg-accent-hover-users disabled:opacity-50 transition-colors"
        >
          {isSubmitting || createUserMutation.isPending
            ? t("Creating...")
            : t("Create User")}
        </button>
      </div>
    </form>
  );
};
