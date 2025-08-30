import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building,
  Camera,
  Computer,
  DollarSign,
  Edit,
  KeyRound,
  Languages,
  Mail,
  MapPin,
  Moon,
  Phone,
  Save,
  Shield,
  Sun,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { languages } from "../../../../data/languages";
import { permissions, type Permission } from "../../../../data/permissions";
import { useUserProfile } from "../../../../hooks/useUserProfile";
import {
  userProfileSchema,
  type UserProfileFormData,
} from "../../../../schemas/userProfileSchema";
import { useLocationStore } from "../../../../stores";
import { getRoleNameDisplay } from "../../../../data/roles";
import ProfileSection from "./ProfileSection";
import EditableField from "./EditabelField";
import type { UserProfile } from "../../../../entities/UserProfile";
import ChangePasswordModal from "./ChangePassword";
import RouteBox from "../../../../components/RouteBox";

function UserProfilePage({ userId }: { userId?: number }) {
  const {
    currentUser: user,
    currencies,
    loading,
    isSavingPermissions,
    updatePersonalInfo,
    updatePreferences,
    handleChangePassword,
    handleUpdatePermissons,
    triggerPhotoUpload,
    handleFileInputChange,
    fileInputRef,
  } = useUserProfile(userId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }, // isSubmitting replaces `loading` for the form
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
  });

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Update tempUserInfo when user data loads
  React.useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
      });
    }
  }, [reset, user]);

  const onSaveChanges: SubmitHandler<UserProfileFormData> = async (data) => {
    try {
      await updatePersonalInfo(data);
      setIsEditingInfo(false);

      reset(data);
    } catch {}
  };

  const { i18n } = useTranslation();

  const handleInfoCancel = () => {
    setIsEditingInfo(false);
    reset();
  };

  const handlePreferenceChange = async (
    key: keyof UserProfile["preferences"],
    value: string
  ) => {
    await updatePreferences(key, value);

    if (key === "language") {
      const lang = languages.find((l) => l.code === value);
      if (lang) {
        i18n.changeLanguage(value);
        document.documentElement.dir = lang.dir;
      }
    }
  };
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );
  const locations = useLocationStore((s) => s.locations);
  useEffect(() => {
    if (user) {
      setSelectedPermissions(user.permissions);
    }
  }, [user]);

  const togglePermission = (permission: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };
  const { t } = useTranslation();
  const route = [
    { path: "/settings", name: t("settings") },
    { path: "", name: t("User Profile") },
  ];
  // Loading state
  if (loading && !user) {
    return (
      <div className=" bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t("Loading profile...")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="font-sans bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400">
            {t("Failed to load profile")}
          </p>
        </div>
      </div>
    );
  }

  const location = locations.find((l) => l.id === user.location);

  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <div className=" min-h-screen p-6 bg-add-purchase-bg mt-[-15px]">
        <div className="bg-userprofile p-5 rounded-xl">
          {/* --- Profile Header --- */}
          <div className="mb-8">
            <div className="relative group w-32 h-32 sm:w-40 sm:h-40 mx-auto">
              <img
                className="rounded-full w-full h-full object-cover shadow-lg border-4 border-white dark:border-gray-800"
                src={user.avatarUrl}
                alt="User Avatar"
              />
              <div
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={triggerPhotoUpload}
              >
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center mt-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-md text-indigo-600 dark:text-indigo-400 font-semibold capitalize">
                {getRoleNameDisplay(user.role)}
              </p>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* --- Profile Content Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* --- Personal Information --- */}
              <form onSubmit={handleSubmit(onSaveChanges)}>
                <ProfileSection title={t("Personal Information")} icon={User}>
                  <div className="flex justify-between items-center">
                    <div />
                    <div className="flex items-center space-x-2">
                      {isEditingInfo && (
                        <button
                          onClick={handleInfoCancel}
                          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                      )}
                      {isEditingInfo ? (
                        <button
                          type="submit"
                          onClick={() => console.log("I am Clicked")}
                          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition"
                          disabled={isSubmitting} // Use isSubmitting from the hook
                        >
                          <Save className="w-4 h-4 me-2" />
                          {isSubmitting ? t("Saving...") : t("Save Changes")}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditingInfo(true);
                          }}
                          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition"
                        >
                          <Edit className="w-4 h-4 me-2" />
                          {t("Edit Info")}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditableField
                      label={t("First Name")}
                      name="firstName"
                      displayValue={user.firstName}
                      Icon={User}
                      isEditing={isEditingInfo}
                      register={register}
                      error={errors.firstName}
                    />
                    <EditableField
                      label={t("Last Name")}
                      name="lastName"
                      displayValue={user.lastName}
                      Icon={User}
                      isEditing={isEditingInfo}
                      register={register}
                      error={errors.lastName}
                    />
                    <EditableField
                      label={t("Username")}
                      name="username"
                      displayValue={user.username}
                      Icon={User}
                      isEditing={isEditingInfo}
                      register={register}
                      error={errors.username}
                    />
                    <EditableField
                      label={t("Phone Number")}
                      name="phone"
                      displayValue={user.phone}
                      Icon={Phone}
                      isEditing={isEditingInfo}
                      register={register}
                      error={errors.phone}
                    />
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <Mail className="w-4 h-4 me-2" />
                        {t("Email")}
                      </label>
                      <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </ProfileSection>
              </form>

              {/* --- Security --- */}
              <ProfileSection title={t("Security")} icon={Shield}>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <KeyRound className="w-4 h-4 me-2" />
                    {t("Password")}
                  </label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-md text-gray-900 dark:text-gray-200">
                      **********
                    </p>
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      {t("Change Password")}
                    </button>
                  </div>
                </div>
              </ProfileSection>

              {/* --- Permissions --- */}
              <ProfileSection title={t("Permissions")} icon={Shield}>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("Your role as")}{" "}
                  <span className="font-bold capitalize">
                    {getRoleNameDisplay(user.role)}
                  </span>{" "}
                  {t("grants you the following permissions")}:
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {user.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </ProfileSection>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* --- Branch / Location --- */}
              <ProfileSection title={t("Branch / Location")} icon={Building}>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Building className="w-4 h-4 me-2" />
                    {t("Branch Name")}
                  </label>
                  <p className="mt-1 text-md text-gray-900 dark:text-gray-200">
                    {location?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <MapPin className="w-4 h-4 me-2" />
                    {t("Location")}
                  </label>
                  <p className="mt-1 text-md text-gray-900 dark:text-gray-200">
                    {location?.address}
                  </p>
                </div>
              </ProfileSection>
              {userId ? (
                <ProfileSection title={t("Set Permissions")} icon={Shield}>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("Set Permissions for")}{" "}
                    <span className="font-bold capitalize">
                      {user.firstName} {user.lastName}
                    </span>{" "}
                  </p>
                  <ul>
                    {permissions.map((permission) => (
                      <li
                        key={permission.name}
                        className="flex justify-between px-3 text-green-800 rounded-full dark:text-green-200  hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <label
                          className="flex-1 py-1"
                          htmlFor={permission.name}
                        >
                          {permission.value}
                        </label>
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(
                            permission.name
                          )}
                          onChange={() => togglePermission(permission.name)}
                          className="py-1"
                          id={permission.name}
                        />
                      </li>
                    ))}
                  </ul>
                  <div>
                    <button
                      type="submit"
                      onClick={() =>
                        handleUpdatePermissons(selectedPermissions)
                      }
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition"
                      disabled={isSavingPermissions} // Use isSubmitting from the hook
                    >
                      <Save className="w-4 h-4 me-2" />
                      {isSavingPermissions ? t("Saving...") : t("Save Changes")}
                    </button>
                  </div>
                </ProfileSection>
              ) : (
                // --- Preferences ---
                <ProfileSection title={t("Preferences")} icon={Sun}>
                  <div>
                    <label
                      htmlFor="language"
                      className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center"
                    >
                      <Languages className="w-4 h-4 me-2" />
                      {t("Language")}
                    </label>
                    <select
                      id="language"
                      value={user.preferences.language}
                      onChange={(e) =>
                        handlePreferenceChange("language", e.target.value)
                      }
                      className="mt-1 block w-full ps-3 pe-10 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="currency"
                      className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center"
                    >
                      <DollarSign className="w-4 h-4 me-2" />
                      {t("Currency")}
                    </label>
                    <select
                      id="currency"
                      value={user.preferences.currency}
                      onChange={(e) =>
                        handlePreferenceChange("currency", e.target.value)
                      }
                      className="mt-1 block w-full ps-3 pe-10 py-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.id}>
                          {currency.code} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      {user.preferences.theme === "light" ? (
                        <Sun className="w-4 h-4 me-2" />
                      ) : user.preferences.theme === "dark" ? (
                        <Moon className="w-4 h-4 me-2" />
                      ) : (
                        <Computer className="w-4 h-4 me-2" />
                      )}
                      {t("Theme")}
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-gray-900 dark:text-gray-100">
                      {(["light", "dark", "system"] as const).map((theme) => {
                        const Icon =
                          theme === "light"
                            ? Sun
                            : theme === "dark"
                            ? Moon
                            : Computer;
                        return (
                          <button
                            key={theme}
                            onClick={() =>
                              handlePreferenceChange("theme", theme)
                            }
                            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors border ${
                              user.preferences.theme === theme
                                ? "bg-indigo-600 text-white border-transparent"
                                : "bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            <Icon className="w-4 h-4 me-2" />
                            <span className="capitalize">{theme}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </ProfileSection>
              )}
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleChangePassword}
      />
    </>
  );
}

export default UserProfilePage;
