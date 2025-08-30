import { Loader2, Save, UploadCloud } from "lucide-react";
import { useCan } from "../../../../hooks/useCan";
import type { ChangeEvent } from "react";
import { SectionCard } from "./SettingSectionCard";
import { Button } from "./SettingButton";
import { useTranslation } from "react-i18next";

interface LogoSettingsSectionProps {
  logoPreview: string | null;
  onLogoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  isLoading: boolean;
  isSaving: boolean;
  hasChanges: boolean;
}

export function LogoSettingsSection({
  logoPreview,
  onLogoChange,
  onSave,
  isLoading,
  isSaving,
  hasChanges,
}: LogoSettingsSectionProps) {
  const allowed = useCan("settings");
  const { t } = useTranslation();
  return (
    <SectionCard
      title={t("Company Logo")}
      description={t("Upload your company logo. Recommended size: 256x256px.")}
      isLoading={isLoading}
      footer={
        <Button
          onClick={onSave}
          loading={isSaving}
          disabled={!hasChanges || isLoading}
        >
          <Save className="h-4 w-4" /> {t("Save Logo")}
        </Button>
      }
    >
      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={logoPreview || undefined}
            alt="Logo"
            className="h-32 w-32 rounded-full object-cover bg-input-settings border-4 border-border-settings"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <label
            htmlFor="logo-upload"
            className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${
              isLoading || !allowed
                ? "border-border-settings bg-input-settings/50 cursor-not-allowed"
                : "border-border-settings hover:border-primary-settings hover:bg-input-settings cursor-pointer"
            }`}
          >
            <UploadCloud className="h-10 w-10 text-muted-foreground-settings mb-2" />
            <span className="font-semibold text-primary-settings">
              {isLoading ? "Loading..." : "Click to upload"}
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
            disabled={isLoading || !allowed}
          />
        </div>
      </div>
    </SectionCard>
  );
}
