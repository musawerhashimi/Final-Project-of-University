import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "../../../../components/Loader";
import type { EmailSettings, ShopSettings } from "../../../../entities/Setting";
import { useSettingsStore } from "../../../../stores/useSettingsStore";
import { extractAxiosError } from "../../../../utils/extractError";
import { GeneralSettingsSection } from "./GeneralSettingSection";
import { EmailConfigSection } from "./EmailConfigSection";
import { LogoSettingsSection } from "./LogoSettingSection";
import RouteBox from "../../../../components/RouteBox";
import { useTranslation } from "react-i18next";

export default function GenralSettingsPage() {
  const { t } = useTranslation();
  const {
    shopSettings,
    emailSettings,
    logoSettings,
    isLoadingShop,
    isLoadingEmail,
    isLoadingLogo,
    isSavingShop,
    isSavingEmail,
    isSavingLogo,
    updateShopSettings,
    updateEmailSettings,
    updateLogoSettings,
    testEmailConfiguration,
  } = useSettingsStore();

  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (logoSettings?.logo) {
      setLogoPreview(logoSettings.logo);
    }
  }, [logoSettings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveShop = async (data: ShopSettings) => {
    try {
      await updateShopSettings(data);
      toast.success(t("Shop settings saved successfully!"));
    } catch (error) {
      const errorMessage = extractAxiosError(
        error,
        t("Failed to save shop settings")
      );
      toast.error(errorMessage);
    }
  };

  const handleSaveEmail = async (data: EmailSettings) => {
    try {
      await updateEmailSettings(data);
      toast.success(t("Email settings saved successfully!"));
    } catch (error) {
      const errorMessage = extractAxiosError(
        error,
        t("Failed to save email settings")
      );
      toast.error(errorMessage);
    }
  };

  const handleSaveLogo = async () => {
    if (!selectedLogo) {
      toast.error(t("Please select a logo first"));
      return;
    }

    try {
      await updateLogoSettings(selectedLogo);
      toast.success(t("Logo uploaded successfully!"));
      setSelectedLogo(null);
    } catch (error) {
      const errorMessage = extractAxiosError(error, t("Failed to upload logo"));
      toast.error(errorMessage);
    }
  };

  const handleTestEmail = async () => {
    try {
      await testEmailConfiguration();
      toast.success(t("Test email sent successfully!"));
    } catch (error) {
      const errorMessage = extractAxiosError(
        error,
        t("Failed to send test email")
      );
      toast.error(errorMessage);
    }
  };
  const route = [
    { name: t("settings"), path: "/settings" },
    { name: t("General Settings"), path: "" },
  ];

  if (!shopSettings || !emailSettings || !logoSettings) {
    return <Loader />;
  }
  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <div className="mt-[-15px] bg-add-purchase-bg w-full mx-auto p-4">
        <h1 className="text-3xl mb-2 font-bold text-foreground-settings">
          {t("General Settings")}
        </h1>

        <div className="space-y-8">
          <GeneralSettingsSection
            settings={shopSettings}
            // onChange={handleShopChange}
            onSave={handleSaveShop}
            isLoading={isLoadingShop}
            isSaving={isSavingShop}
          />

          <LogoSettingsSection
            logoPreview={logoPreview}
            onLogoChange={handleLogoChange}
            onSave={handleSaveLogo}
            isLoading={isLoadingLogo}
            isSaving={isSavingLogo}
            hasChanges={!!selectedLogo}
          />

          <EmailConfigSection
            config={emailSettings}
            onSave={handleSaveEmail}
            onTest={handleTestEmail}
            isLoading={isLoadingEmail}
            isSaving={isSavingEmail}
          />
        </div>
      </div>
    </>
  );
}
