initial prompt:
i am working on a react ts + tailwind v4 project
a multitenant supermarket management system | POS
i want you to create me a user-profile
you can use react-icons, lucide-react, sonner and other packages you think is usefull

the user-profile have lot's of things.
including, profile picture, name (first name, last name), email, username, password, phone number,
role, e.g. cashier, admin...
permissions (granular permissions)
Branch or Location 

and profile management like update name, phone, photo, password, email

preferences:
language
timezone
currency
theme


now bro create me a comprehensive ui for user profile, with properly typed components as typescript wants

if you have any question ask.



result:

import {
  Building,
  Camera,
  Clock,
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
import React, { useState } from "react";
import { toast } from "sonner";

// --- TYPE DEFINITIONS ---
// We define the shape of our data for type safety.

type UserRole = "admin" | "cashier" | "manager" | "stock_clerk";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  branch: {
    id: string;
    name: string;
    location: string;
  };
  permissions: string[];
  preferences: {
    language: string;
    timezone: string;
    currency: string;
    theme: "light" | "dark";
  };
}

// --- MOCK DATA ---
// In a real application, this data would come from your API.

const mockUser: UserProfile = {
  id: "usr_12345",
  firstName: "Alex",
  lastName: "Doe",
  username: "alex.doe",
  email: "alex.doe@supermarket.com",
  phone: "+1 (123) 456-7890",
  role: "admin",
  avatarUrl: "https://placehold.co/256x256/E2E8F0/4A5568?text=AD",
  branch: {
    id: "br_001",
    name: "Downtown Central",
    location: "123 Main St, Anytown, USA",
  },
  permissions: [
    "dashboard:view",
    "sales:create",
    "sales:view",
    "sales:refund",
    "inventory:view",
    "inventory:add",
    "inventory:edit",
    "users:create",
    "users:edit",
    "users:view",
    "users:delete",
    "reports:generate",
    "settings:edit",
  ],
  preferences: {
    language: "en-US",
    timezone: "America/New_York",
    currency: "USD",
    theme: "light",
  },
};

// --- HELPER COMPONENTS ---
// Breaking the UI into smaller, manageable components.

interface SectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const ProfileSection: React.FC<SectionProps> = ({
  title,
  icon: Icon,
  children,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <Icon className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mr-3" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  </div>
);

interface EditableFieldProps {
  label: string;
  value: string;
  Icon: React.ElementType;
  isEditing: boolean;
  onValueChange: (value: string) => void;
  inputType?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  Icon,
  isEditing,
  onValueChange,
  inputType = "text",
}) => (
  <div>
    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </label>
    {isEditing ? (
      <input
        type={inputType}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
      />
    ) : (
      <p className="mt-1 text-md text-gray-900 dark:text-gray-200">{value}</p>
    )}
  </div>
);

// --- MAIN PROFILE COMPONENT ---

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [tempUserInfo, setTempUserInfo] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    phone: user.phone,
  });

  const handleInfoEditToggle = () => {
    if (isEditingInfo) {
      // Logic to save data would go here
      // For now, just update the state
      setUser((prev) => ({ ...prev, ...tempUserInfo }));
      toast.success("Personal information updated successfully!");
    } else {
      // Reset temp state when entering edit mode
      setTempUserInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
      });
    }
    setIsEditingInfo(!isEditingInfo);
  };

  const handleInfoCancel = () => {
    setIsEditingInfo(false);
    // Reset temp state to original user state
    setTempUserInfo({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phone: user.phone,
    });
  };

  const handlePreferenceChange = (
    key: keyof UserProfile["preferences"],
    value: string
  ) => {
    setUser((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
    toast.info(
      `${key.charAt(0).toUpperCase() + key.slice(1)} preference updated.`
    );
  };

  // A simple function to handle password change logic
  const handleChangePassword = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: "Sending password reset link...",
      success: "Password reset link sent to your email!",
      error: "Failed to send reset link.",
    });
  };

  return (
    <div className={`${user.preferences.theme} font-sans`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
        {/* <Toaster position="top-right" richColors /> */}
        <div className="max-w-6xl mx-auto">
          {/* --- Profile Header --- */}
          <div className="mb-8">
            <div className="relative group w-32 h-32 sm:w-40 sm:h-40 mx-auto">
              <img
                className="rounded-full w-full h-full object-cover shadow-lg border-4 border-white dark:border-gray-800"
                src={user.avatarUrl}
                alt="User Avatar"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center mt-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-md text-indigo-600 dark:text-indigo-400 font-semibold capitalize">
                {user.role}
              </p>
            </div>
          </div>

          {/* --- Profile Content Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* --- Personal Information --- */}
              <ProfileSection title="Personal Information" icon={User}>
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
                    <button
                      onClick={handleInfoEditToggle}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition"
                    >
                      {isEditingInfo ? (
                        <Save className="w-4 h-4 mr-2" />
                      ) : (
                        <Edit className="w-4 h-4 mr-2" />
                      )}
                      {isEditingInfo ? "Save Changes" : "Edit Info"}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditableField
                    label="First Name"
                    value={tempUserInfo.firstName}
                    Icon={User}
                    isEditing={isEditingInfo}
                    onValueChange={(v) =>
                      setTempUserInfo({ ...tempUserInfo, firstName: v })
                    }
                  />
                  <EditableField
                    label="Last Name"
                    value={tempUserInfo.lastName}
                    Icon={User}
                    isEditing={isEditingInfo}
                    onValueChange={(v) =>
                      setTempUserInfo({ ...tempUserInfo, lastName: v })
                    }
                  />
                  <EditableField
                    label="Username"
                    value={tempUserInfo.username}
                    Icon={User}
                    isEditing={isEditingInfo}
                    onValueChange={(v) =>
                      setTempUserInfo({ ...tempUserInfo, username: v })
                    }
                  />
                  <EditableField
                    label="Phone Number"
                    value={tempUserInfo.phone}
                    Icon={Phone}
                    isEditing={isEditingInfo}
                    onValueChange={(v) =>
                      setTempUserInfo({ ...tempUserInfo, phone: v })
                    }
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </label>
                    <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
                      {user.email} (cannot be changed)
                    </p>
                  </div>
                </div>
              </ProfileSection>

              {/* --- Security --- */}
              <ProfileSection title="Security" icon={Shield}>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <KeyRound className="w-4 h-4 mr-2" />
                    Password
                  </label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-md text-gray-900 dark:text-gray-200">
                      **********
                    </p>
                    <button
                      onClick={handleChangePassword}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </ProfileSection>

              {/* --- Permissions --- */}
              <ProfileSection title="Permissions" icon={Shield}>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your role as{" "}
                  <span className="font-bold capitalize">{user.role}</span>{" "}
                  grants you the following permissions:
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
              <ProfileSection title="Branch / Location" icon={Building}>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Branch Name
                  </label>
                  <p className="mt-1 text-md text-gray-900 dark:text-gray-200">
                    {user.branch.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </label>
                  <p className="mt-1 text-md text-gray-900 dark:text-gray-200">
                    {user.branch.location}
                  </p>
                </div>
              </ProfileSection>

              {/* --- Preferences --- */}
              <ProfileSection
                title="Preferences"
                icon={Sun /* Icon changes with theme */}
              >
                <div>
                  <label
                    htmlFor="language"
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center"
                  >
                    <Languages className="w-4 h-4 mr-2" />
                    Language
                  </label>
                  <select
                    id="language"
                    value={user.preferences.language}
                    onChange={(e) =>
                      handlePreferenceChange("language", e.target.value)
                    }
                    className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                    <option value="fr-FR">Français</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="timezone"
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={user.preferences.timezone}
                    onChange={(e) =>
                      handlePreferenceChange("timezone", e.target.value)
                    }
                    className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                    <option>Asia/Tokyo</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="currency"
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={user.preferences.currency}
                    onChange={(e) =>
                      handlePreferenceChange("currency", e.target.value)
                    }
                    className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    {user.preferences.theme === "light" ? (
                      <Sun className="w-4 h-4 mr-2" />
                    ) : (
                      <Moon className="w-4 h-4 mr-2" />
                    )}
                    Theme
                  </label>
                  <div className="mt-2 flex items-center space-x-4">
                    <button
                      onClick={() => handlePreferenceChange("theme", "light")}
                      className={`px-4 py-2 rounded-md text-sm flex items-center transition w-full justify-center ${
                        user.preferences.theme === "light"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <Sun className="w-4 h-4 mr-2" /> Light
                    </button>
                    <button
                      onClick={() => handlePreferenceChange("theme", "dark")}
                      className={`px-4 py-2 rounded-md text-sm flex items-center transition w-full justify-center ${
                        user.preferences.theme === "dark"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <Moon className="w-4 h-4 mr-2" /> Dark
                    </button>
                  </div>
                </div>
              </ProfileSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;


Hey bro this is a good designed user-profile but.
but i want it a little more different, first if makes it beautiful
i want it tabbed view like personal-profile and others.
so for now i want you to create a beautiful tabbed ui with tabs and labels and only implement the personal information tab content
also i prompt you before about the user profile and have this and this contents but add anything else you think is necessary.
also when applying themes as you did.
you defined colors like bg-dsdsfsdf and dark:bg-sdfsdfsdf or other colors
but instead of that i want you to define a color name and give it two value for light and dark modes like 
.light {
--color-sdfsdf-user-profile: dssdf

}
.dark {

--color-sdfsdf-user-profile: sdfgsdfgdfg
}
all suffixed with user-profile
