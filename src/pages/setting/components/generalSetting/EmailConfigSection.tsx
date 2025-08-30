import type { EmailSettings } from "../../../../entities/Setting";
import { KeyRound, Mail, Save } from "lucide-react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { emailSettingsSchema } from "../../../../schemas/settingsSchema";
import { Button } from "./SettingButton";
import { InputField } from "./SettingInputField";
import { SectionCard } from "./SettingSectionCard";
import { useTranslation } from "react-i18next";

interface EmailConfigSectionProps {
  config: EmailSettings;
  // onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (data: EmailSettings) => Promise<void>;
  onTest: () => void;
  isLoading: boolean;
  isSaving: boolean;
}

export function EmailConfigSection({
  config,
  // onChange,
  onSave,
  // onTest,
  isLoading,
  isSaving,
}: EmailConfigSectionProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EmailSettings>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: config,
  });

  useEffect(() => {
    reset(config);
  }, [config, reset]);
  const { t } = useTranslation();
  return (
    <SectionCard
      title={t("Email Configuration")}
      description={t(
        "Configure SMTP settings for sending transactional emails."
      )}
      isLoading={isLoading}
      footer={
        <div className="flex justify-end items-center gap-3 w-full">
          <Button
            type="submit"
            form="email-config-form"
            loading={isSaving}
            disabled={!isDirty || isLoading || isSaving}
          >
            <Save className="h-4 w-4" /> {t("Save Changes")}
          </Button>
        </div>
      }
    >
      <form id="email-config-form" onSubmit={handleSubmit(onSave)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField<EmailSettings>
            name="smtp_host"
            label={t("SMTP Host")}
            placeholder={t("smtp.mailprovider.com")}
            disabled={isLoading}
            register={register}
            error={errors.smtp_host?.message}
          />
          <InputField<EmailSettings>
            name="smtp_port"
            label={t("SMTP Port")}
            type="number"
            // value={config.smtp_port}
            // onChange={onChange}
            placeholder="587"
            disabled={isLoading}
            register={register}
            error={errors.smtp_port?.message}
          />
        </div>
        <InputField<EmailSettings>
          name="smtp_username"
          label={t("SMTP Username")}
          // value={config.smtp_username}
          // onChange={onChange}
          placeholder={t("Your Username")}
          disabled={isLoading}
          register={register}
          error={errors.smtp_username?.message}
        />
        <InputField<EmailSettings>
          name="smtp_password"
          label={t("SMTP Password")}
          type="password"
          // value={config.smtp_password || ""}
          // onChange={onChange}
          placeholder={t("Enter your password")}
          icon={KeyRound}
          disabled={isLoading}
          register={register}
          error={errors.smtp_password?.message}
        />
        <InputField<EmailSettings>
          name="from_email"
          label={t("From Email")}
          type="email"
          placeholder="noreply@yourshop.com"
          icon={Mail}
          disabled={isLoading}
          register={register}
          error={errors.from_email?.message}
        />
      </form>
    </SectionCard>
  );
}
