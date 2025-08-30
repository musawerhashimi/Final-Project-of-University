

class UserRole(TenantBaseModel):
    """User role assignments"""
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('admin', 'Administrator'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
        ('cashier', 'Cashier'),
        ('inventory_manager', 'Inventory Manager'),
        ('sales_rep', 'Sales Representative'),
        ('accountant', 'Accountant'),
        ('viewer', 'Viewer'),
        ('custom', 'Custom')
    ]

    role_name = models.CharField(max_length=50, choices=ROLE_CHOICES)
    assigned_by_user = models.ForeignKey(
        'User', 
        on_delete=models.SET_NULL, 
        null=True, blank=True,
        related_name='assigned_roles'
    )
    assigned_date = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_roles'
        unique_together = ['tenant', 'user', 'role_name']
        indexes = [
            models.Index(fields=['tenant', 'user', 'is_active']),
            models.Index(fields=['tenant', 'role_name']),
            models.Index(fields=['assigned_date']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.get_role_name_display()}"


class User(AbstractUser, BaseModel):
    """Extended user model with tenant support"""
    tenant = models.ForeignKey(
        Tenant, 
        on_delete=models.CASCADE, 
        related_name='users',
        null=True, blank=True
    )
    photo = models.ImageField(
        upload_to=upload_user_photo, 
        null=True, blank=True,
        help_text="User profile photo"
    )
    employee = models.OneToOneField(
        Employee, 
        on_delete=models.SET_NULL, 
        null=True, blank=True,
        related_name='user_account'
    )

    role = models.ForeignKey(
        UserRole, 
        on_delete=models.SET_NULL, 
        null=True, blank=True,
        related_name='users_roles'
    )
    # Preferences
    last_login_date = models.DateTimeField(null=True, blank=True)
    preferred_currency = models.ForeignKey(
        Currency, 
        on_delete=models.SET_NULL, 
        null=True, blank=True
    )
    location = models.ForeignKey(to='inventory.Location', on_delete=models.PROTECT, related_name='users')
    language_preference = models.CharField(
        max_length=10, 
        default='en',
        choices=[
            ('en', 'English'),
            ('da', 'Dari'),
            ('pa', 'Pashto'),
            ('es', 'Spanish'),
            ('fr', 'French'),
            ('de', 'German'),
            ('ar', 'Arabic'),
        ]
    )
    timezone = models.CharField(
        max_length=50, 
        default='UTC',
        help_text="User's timezone preference"
    )
    theme = models.CharField(
        max_length=20,
        default='light',
        choices=[
            ('light', 'Light'),
            ('dark', 'Dark'),
            ('system', 'System Default')
        ]
    )
    
    # Custom manager for tenant awareness
    objects = UserManager()
    all_objects = BaseUserManager()
    

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['tenant', 'is_active']),
            models.Index(fields=['tenant', 'username']),
            models.Index(fields=['tenant', 'email']),
            models.Index(fields=['last_login_date']),
            # models.Index(fields=['deleted_at']),
        ]

    def __str__(self):
        return f"{self.username} ({self.get_full_name()})"

    @property
    def is_deleted(self):
        return self.deleted_at is not None

    def soft_delete(self):
        """Soft delete the user"""
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save()

    def restore(self):
        """Restore soft deleted user"""
        self.deleted_at = None
        self.is_active = True
        self.save()

    def get_roles(self):
        """Get all active roles for this user"""
        return self.user_roles.filter(is_active=True)

    def has_role(self, role_name):
        """Check if user has a specific role"""
        return self.user_roles.filter(role_name=role_name, is_active=True).exists()

    # def get_permissions_codename(self):
    #     """Get all permissions for this user through roles"""
    #     role_names = self.get_roles().values_list('role_name', flat=True)
    #     return RolePermission.objects.filter(role_name__in=role_names).select_related('permission').exists()


class UserPermission(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="users_permissions")
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    allow = models.BooleanField(default=True)
    class Meta:
        db_table = 'user_permissions'
        unique_together = ['user', 'permission']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['permission']),
        ]

    
class RolePermission(models.Model):
    """Role-based permissions"""
    role_name = models.CharField(max_length=50, choices=UserRole.ROLE_CHOICES)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)

    class Meta:
        db_table = 'role_permissions'
        unique_together = ['role_name', 'permission']
        indexes = [
            models.Index(fields=['role_name']),
            models.Index(fields=['permission']),
        ]

    def __str__(self):
        return f"{self.get_role_name_display()} - {self.permission.name}"



class Currency(TenantBaseModel):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3)  # ISO 4217
    symbol = models.CharField(max_length=10, null=True, blank=True)
    decimal_places = models.PositiveSmallIntegerField(default=2, validators=[MaxValueValidator(4)])
    is_base_currency = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)


class Location(TenantBaseModel):
    LOCATION_TYPES = [
        ('warehouse', 'Warehouse'),
        ('store', 'Store'),
        ('office', 'Office'),
        ('online', 'Online'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=150)
    location_type = models.CharField(max_length=20, choices=LOCATION_TYPES, default='warehouse')
    is_active = models.BooleanField(default=True)
    manager = models.ForeignKey(
        Employee, 
        on_delete=models.SET_NULL, 
        null=True,
        blank=True,
        related_name='managed_locations'
    )
    created_by_user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='created_locations'
    )


FRONT END:
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
import React, { useState } from "react";
import { toast } from "sonner";
import { languages } from "../../../data/languages";
import { useTranslation } from "react-i18next";
import { useCurrencyStore } from "../../../stores";

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
    language: string; // language code
    timezone: string;
    currency: string;
    theme: "light" | "dark" | "system";
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
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-[#e4e4e7] dark:border-[#404045]">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <Icon className="w-6 h-6 text-indigo-500 dark:text-indigo-400 me-3" />
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
      <Icon className="w-4 h-4 me-2" />
      {label}
    </label>
    {isEditing ? (
      <input
        type={inputType}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200"
      />
    ) : (
      <p className="mt-1 text-md text-gray-900 dark:text-gray-200">{value}</p>
    )}
  </div>
);

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    // In a real app, you would make an API call here.
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: "Updating password...",
      success: () => {
        onClose();
        return "Password updated successfully!";
      },
      error: "Failed to update password.",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-card-user-profile rounded-lg shadow-xl w-full max-w-md m-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-card-foreground-user-profile">
                Change Password
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-muted-foreground-user-profile hover:bg-accent-user-profile transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="old-password"
                  className="text-sm font-medium text-muted-foreground-user-profile"
                >
                  Old Password
                </label>
                <input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-input-user-profile border border-border-user-profile rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring-user-profile sm:text-sm text-foreground-user-profile"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="text-sm font-medium text-muted-foreground-user-profile"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-input-user-profile border border-border-user-profile rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring-user-profile sm:text-sm text-foreground-user-profile"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-muted-foreground-user-profile"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-input-user-profile border border-border-user-profile rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring-user-profile sm:text-sm text-foreground-user-profile"
                  required
                />
              </div>
            </div>
          </div>
          <div className="bg-muted-user-profile px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-foreground-user-profile bg-transparent border border-border-user-profile rounded-md hover:bg-accent-user-profile transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-primary-foreground-user-profile bg-primary-user-profile rounded-md hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN PROFILE COMPONENT ---

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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
  const { i18n } = useTranslation();
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
    if (key === "language") {
      const lang = languages.find((l) => l.code === value);
      if (lang) {
        i18n.changeLanguage(value);
        document.documentElement.dir = lang.dir;
      }
    }
    toast.info(
      `${key.charAt(0).toUpperCase() + key.slice(1)} preference updated.`
    );
  };

  // A simple function to handle password change logic
  // const handleChangePassword = () => {
  //   toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
  //     loading: "Sending password reset link...",
  //     success: "Password reset link sent to your email!",
  //     error: "Failed to send reset link.",
  //   });
  // };

  const currencies = useCurrencyStore((s) => s.currencies);
  return (
    <>
      <div className={`font-sans`}>
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
                          <Save className="w-4 h-4 me-2" />
                        ) : (
                          <Edit className="w-4 h-4 me-2" />
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
                        <Mail className="w-4 h-4 me-2" />
                        Email Address
                      </label>
                      <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </ProfileSection>

                {/* --- Security --- */}
                <ProfileSection title="Security" icon={Shield}>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <KeyRound className="w-4 h-4 me-2" />
                      Password
                    </label>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-md text-gray-900 dark:text-gray-200">
                        **********
                      </p>
                      <button
                        onClick={() => setIsPasswordModalOpen(true)}
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
                      <Building className="w-4 h-4 me-2" />
                      Branch Name
                    </label>
                    <p className="mt-1 text-md text-gray-900 dark:text-gray-200">
                      {user.branch.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <MapPin className="w-4 h-4 me-2" />
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
                      <Languages className="w-4 h-4 me-2" />
                      Language
                    </label>
                    <select
                      id="language"
                      value={user.preferences.language}
                      onChange={(e) =>
                        handlePreferenceChange("language", e.target.value)
                      }
                      className="mt-1 block w-full ps-3 pe-10 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-input-user-profile text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-ring-user-profile focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <div>
      <label
        htmlFor="timezone"
        className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center"
      >
        <Clock className="w-4 h-4 me-2" />
        Timezone
      </label>
      <select
        id="timezone"
        value={user.preferences.timezone}
        onChange={(e) =>
          handlePreferenceChange("timezone", e.target.value)
        }
        className="mt-1 block w-full ps-3 pe-10 py-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option>America/New_York</option>
        <option>Europe/London</option>
        <option>Asia/Tokyo</option>
      </select>
    </div> */}
                  <div>
                    <label
                      htmlFor="currency"
                      className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center"
                    >
                      <DollarSign className="w-4 h-4 me-2" />
                      Currency
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
                        <option key={currency.code} value={currency.code}>
                          {currency.code} ({currency.symbol})
                        </option>
                      ))}
                      {/* <option value="USD">USD ($)</option>
    <option value="EUR">EUR (€)</option>
    <option value="GBP">GBP (£)</option> */}
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
                      Theme
                    </label>
                    {/* <div className="mt-2 flex items-center space-x-4">
      <button
        onClick={() => handlePreferenceChange("theme", "light")}
        className={`px-4 py-2 rounded-md text-sm flex items-center transition w-full justify-center ${
          user.preferences.theme === "light"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
        }`}
      >
        <Sun className="w-4 h-4 me-2" /> Light
      </button>
      <button
        onClick={() => handlePreferenceChange("theme", "dark")}
        className={`px-4 py-2 rounded-md text-sm flex items-center transition w-full justify-center ${
          user.preferences.theme === "dark"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
        }`}
      >
        <Moon className="w-4 h-4 me-2" /> Dark
      </button>
      <button
        onClick={() => handlePreferenceChange("theme", "system")}
        className={`px-4 py-2 rounded-md text-sm flex items-center transition w-full justify-center ${
          user.preferences.theme === "system"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
        }`}
      >
        <Computer className="w-4 h-4 me-2" /> System
      </button>
    </div> */}
                    <div className="mt-2 grid grid-cols-3 gap-2 text-foreground-user-profile">
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
                                ? "bg-primary-user-profile text-primary-foreground-user-profile border-transparent"
                                : "bg-transparent border-border-user-profile hover:bg-accent-user-profile"
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};

export default UserProfilePage;


HEY BRO THIS IS A PART OF MY PROJECT (USER PROFILE)

I WANT YOU TO CONNECT THE FRONT TO THE BACKEND

such that creating serializsers and viewset for it

for change password give me a @action i will put it in a viewset named authViewset
and the url would be apiClient.post(/accounts/auth/change-password)

i configured apiClient you can use that
which is an axios instance (axios.create...)


theming:

// serivies/theme.ts
export type Theme = "light" | "dark" | "system";

export const themes: Theme[] = ["light", "dark", "system"];

export const setTheme = (theme: Theme) => {
  let t = theme;
  if (theme === "system") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    t = mediaQuery.matches ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", t);
  return t;
};

export const applyTheme = (theme: Theme) => {
  const t = setTheme(theme);
  localStorage.setItem("color-theme", t);
};

export const getSavedTheme = (): Theme => {
  const saved = localStorage.getItem("color-theme") as Theme | null;
  if (saved && themes.includes(saved)) return saved;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

// hooks/useTheme.ts
import { useEffect, useState } from "react";
import { applyTheme, getSavedTheme, type Theme } from "../services/theme";

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(getSavedTheme());
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = (document.documentElement.getAttribute("data-theme") ||
        "dark") as Theme;
      setTheme(theme);
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const updateTheme = (theme: Theme) => {
    applyTheme(theme);
    setTheme(theme);
  };

  return [theme, updateTheme];
}

currencies are as you see coming from useCurrencyStore

also dude create a zustand store for me for so it will used and needed lots of places.
also functions like updating and creating new users.
in creating users do not add permissions but add role.

in front create a hook and add the functionalities there do not generate the userProfilePage only tell me where to add, what to add, where to delete, and what to change.

if you have any question just ask.