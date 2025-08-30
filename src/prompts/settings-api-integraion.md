import {
  Building2,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Save,
  TestTube2,
  UploadCloud,
} from "lucide-react";
import React, { useState, type ChangeEvent } from "react";

// --- Helper: Define types for our settings data ---
interface GeneralSettingsData {
  shopName: string;
  phone: string;
  email: string;
  address: string;
}

interface EmailConfigData {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
}

// --- Main App Component ---
// This component sets up the theme and renders the main settings page.
export default function GeneralSetting() {
  return (
    // The main container for the app with theme-aware background and text colors
    <div className="min-h-screen w-full bg-background-settings text-foreground-settings font-sans antialiased">
      <SettingsPage />
    </div>
  );
}

// --- Reusable UI Components ---

// A card component to wrap each settings section
const SectionCard = ({ title, description, children, footer }) => (
  <div className="bg-card-settings border border-border-settings rounded-xl shadow-sm overflow-hidden">
    <div className="p-6">
      <h2 className="text-xl font-bold text-card-foreground-settings">
        {title}
      </h2>
      <p className="mt-1 text-muted-foreground-settings">{description}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
    {footer && (
      <div className="bg-input-settings/50 px-6 py-4 border-t border-border-settings flex justify-end items-center">
        {footer}
      </div>
    )}
  </div>
);

// A styled input field component
const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-muted-foreground-settings mb-1"
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground-settings" />
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-border-settings bg-input-settings px-4 py-2 text-foreground-settings focus:ring-2 focus:ring-primary-settings focus:border-primary-settings focus:outline-0 transition-shadow duration-200 ${
          Icon ? "pl-10" : ""
        }`}
      />
    </div>
  </div>
);

// A styled button component
const Button = ({ children, onClick, variant = "primary", className = "" }) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-settings";
  const variants = {
    primary:
      "bg-primary-settings text-primary-foreground-settings hover:bg-primary-settings/90 focus:ring-primary-settings",
    secondary:
      "bg-input-settings text-card-foreground-settings hover:bg-border-settings focus:ring-primary-settings border border-border-settings",
  };
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Settings Page and Sections ---

// The main settings page layout
const SettingsPage = () => {
  // Mock initial data - in a real app, this would come from a DRF API call
  const initialGeneralSettings: GeneralSettingsData = {
    shopName: "The Corner Store",
    phone: "+1 (555) 123-4567",
    email: "contact@thecornerstore.com",
    address: "123 Market St, San Francisco, CA 94103",
  };

  const initialEmailConfig: EmailConfigData = {
    smtpHost: "smtp.example.com",
    smtpPort: 587,
    smtpUser: "user@example.com",
    smtpPass: "••••••••••••••••",
    fromEmail: "noreply@thecornerstore.com",
  };

  // State for our settings forms
  const [generalSettings, setGeneralSettings] = useState(
    initialGeneralSettings
  );
  const [emailConfig, setEmailConfig] = useState(initialEmailConfig);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    "https://placehold.co/128x128/64748b/ffffff?text=Logo"
  );

  // Handlers to update state
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEmailConfig((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveGeneral = () => {
    console.log("Saving General Settings:", generalSettings);
    // Here you would make an API call to your Django DRF backend
    alert("General settings saved! (Check console for data)");
  };

  const handleSaveEmail = () => {
    console.log("Saving Email Config:", emailConfig);
    alert("Email configuration saved! (Check console for data)");
  };

  const handleSaveLogo = () => {
    if (logo) {
      console.log("Uploading logo:", logo.name);
      alert("Logo uploaded! (Check console for data)");
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground-settings">
            Settings
          </h1>
          <p className="text-muted-foreground-settings mt-1">
            Manage your shop's configuration and preferences.
          </p>
        </div>
      </header>

      <div className="space-y-8">
        <GeneralSettingsSection
          settings={generalSettings}
          onChange={handleGeneralChange}
          onSave={handleSaveGeneral}
        />
        <LogoSettingsSection
          logoPreview={logoPreview}
          onLogoChange={handleLogoChange}
          onSave={handleSaveLogo}
        />
        <EmailConfigSection
          config={emailConfig}
          onChange={handleEmailChange}
          onSave={handleSaveEmail}
        />
      </div>
    </div>
  );
};

// General Settings Section Component
const GeneralSettingsSection = ({ settings, onChange, onSave }) => (
  <SectionCard
    title="General Information"
    description="Update your shop's public details."
    footer={
      <Button onClick={onSave}>
        <Save className="h-4 w-4" /> Save Changes
      </Button>
    }
  >
    <InputField
      id="shopName"
      label="Shop Name"
      value={settings.shopName}
      onChange={onChange}
      placeholder="Your Supermarket Name"
      icon={Building2}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        id="phone"
        label="Phone Number"
        value={settings.phone}
        onChange={onChange}
        placeholder="+1 234 567 890"
        icon={Phone}
      />
      <InputField
        id="email"
        label="Contact Email"
        type="email"
        value={settings.email}
        onChange={onChange}
        placeholder="contact@yourshop.com"
        icon={Mail}
      />
    </div>
    <InputField
      id="address"
      label="Address"
      value={settings.address}
      onChange={onChange}
      placeholder="123 Main Street, Anytown, USA"
      icon={MapPin}
    />
  </SectionCard>
);

// Logo Settings Section Component
const LogoSettingsSection = ({
  logoPreview,
  onLogoChange,
  onSave,
}: {
  logoPreview: string | null;
  onLogoChange: (e: ChangeEvent) => void;
  onSave: () => void;
}) => (
  <SectionCard
    title="Shop Logo"
    description="Upload your company logo. Recommended size: 256x256px."
    footer={
      <Button onClick={onSave}>
        <Save className="h-4 w-4" /> Save Logo
      </Button>
    }
  >
    <div className="flex items-center gap-6">
      <img
        src={
          logoPreview || "https://placehold.co/128x128/adb5bd/ffffff?text=Logo"
        }
        alt="Logo Preview"
        className="h-32 w-32 rounded-full object-cover bg-input-settings border-4 border-border-settings"
        onError={(e) => {
          e.currentTarget.src =
            "https://placehold.co/128x128/f03e3e/ffffff?text=Error";
        }}
      />
      <div className="flex-1">
        <label
          htmlFor="logo-upload"
          className="cursor-pointer w-full border-2 border-dashed border-border-settings rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary-settings hover:bg-input-settings transition-colors"
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground-settings mb-2" />
          <span className="font-semibold text-primary-settings">
            Click to upload
          </span>
          <p className="text-xs text-muted-foreground-settings">
            PNG, JPG, or SVG (MAX. 800x800px)
          </p>
        </label>
        <input
          id="logo-upload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/svg+xml"
          onChange={onLogoChange}
        />
      </div>
    </div>
  </SectionCard>
);

// Email Configuration Section Component
const EmailConfigSection = ({ config, onChange, onSave }) => (
  <SectionCard
    title="Email Configuration"
    description="Configure SMTP settings for sending transactional emails."
    footer={
      <div className="flex justify-end items-center gap-3 w-full">
        <Button variant="secondary">
          <TestTube2 className="h-4 w-4" /> Send Test Email
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>
    }
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        id="smtpHost"
        label="SMTP Host"
        value={config.smtpHost}
        onChange={onChange}
        placeholder="smtp.mailprovider.com"
      />
      <InputField
        id="smtpPort"
        label="SMTP Port"
        type="number"
        value={config.smtpPort}
        onChange={onChange}
        placeholder="587"
      />
    </div>
    <InputField
      id="smtpUser"
      label="SMTP Username"
      value={config.smtpUser}
      onChange={onChange}
      placeholder="your-username"
    />
    <InputField
      id="smtpPass"
      label="SMTP Password"
      type="password"
      value={config.smtpPass}
      onChange={onChange}
      placeholder="Enter your password"
      icon={KeyRound}
    />
    <InputField
      id="fromEmail"
      label="From Email"
      type="email"
      value={config.fromEmail}
      onChange={onChange}
      placeholder="noreply@yourshop.com"
      icon={Mail}
    />
  </SectionCard>
);


endpoints:

apiClient.get|put(/core/settings/shop/)
format:
{
    "shop_name": "EasyShop",
    "phone_number": "",
    "contact_email": "admin@easyshop.com",
    "address": ""
}

apiClient.get|put(/core/settings/logo/)

{
    "logo": null
}

apiClient.get|put(/core/settings/email)

{
    "smtp_host": "",
    "smtp_port": "",
    "smtp_username": "",
    "smtp_password": null,
    "from_email": ""
}

hey bro i want you to connect the front to the backend.
you can use the apiClient which is coming from /lib/api
for messaging use toast sonner which i configured
you can use react-query if you think is needed.
the front ts file is not properly typed, make it good and well typed.
better ux
also bro, please create a zustand store for me cause this would be needed a lot of places.

if you have any question just ask.
