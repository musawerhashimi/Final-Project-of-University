import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Building2, Phone, Mail, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { ShopSettings } from "../../../../entities/Setting";
import { shopSettingsSchema } from "../../../../schemas/settingsSchema";
import { SectionCard } from "./SettingSectionCard";
import { Button } from "./SettingButton";
import { InputField } from "./SettingInputField";
import { useTranslation } from "react-i18next";

interface GeneralSettingsSectionProps {
  settings: ShopSettings;
  onSave: (data: ShopSettings) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}

export function GeneralSettingsSection({
  settings,
  onSave,
  isLoading,
  isSaving,
}: GeneralSettingsSectionProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ShopSettings>({
    resolver: zodResolver(shopSettingsSchema),
    defaultValues: settings, // pass from props
  });
  useEffect(() => {
    reset(settings);
  }, [settings, reset]);
  const { t } = useTranslation();
  return (
    <SectionCard
      title={t("General Information")}
      description={t("Update your company public details.")}
      isLoading={isLoading}
      footer={
        <Button
          type="submit"
          form="general-settings-form"
          loading={isSaving}
          disabled={!isDirty || isLoading || isSaving}
        >
          <Save className="h-4 w-4" /> {t("Save Changes")}
        </Button>
      }
    >
      <form id="general-settings-form" onSubmit={handleSubmit(onSave)}>
        <InputField<ShopSettings>
          name="shop_name"
          label={t("Company Name")}
          // value={settings.shop_name}
          // onChange={onChange}
          placeholder="e.g. Amazon, Shafa ..."
          register={register}
          icon={Building2}
          disabled={isLoading}
          error={errors.shop_name?.message}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField<ShopSettings>
            name="phone_number"
            label={t("Phone Number")}
            // value={settings.phone_number}
            // onChange={onChange}
            register={register}
            placeholder="+93 (0) 700 000 000"
            icon={Phone}
            disabled={isLoading}
            error={errors.phone_number?.message}
          />
          <InputField<ShopSettings>
            name="contact_email"
            label={t("Contact Email")}
            type="email"
            // value={settings.contact_email}
            // onChange={onChange}
            placeholder="contact@yourcompany.com"
            icon={Mail}
            register={register}
            disabled={isLoading}
            error={errors.contact_email?.message}
          />
        </div>
        <InputField<ShopSettings>
          name="address"
          label={t("Address")}
          // value={settings.address}
          // onChange={onChange}
          placeholder="123 Main Street, Kabul, AFG"
          icon={MapPin}
          disabled={isLoading}
          register={register}
          error={errors.address?.message}
        />
      </form>
    </SectionCard>
  );
}
