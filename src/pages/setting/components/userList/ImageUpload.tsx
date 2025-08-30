import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function ImageUpload({
  value,
  onChange,
  error,
}: {
  value?: File;
  onChange: (file: File | undefined) => void;
  error?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      onChange(file);
    }
  };

  const removePhoto = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const UploadIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...p}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17,8 12,3 7,8"></polyline>
      <line x1="12" x2="12" y1="3" y2="15"></line>
    </svg>
  );
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      {preview ? (
        <div className="flex items-center space-x-4">
          <img
            src={preview}
            alt="Preview"
            className="w-16 h-16 rounded-full object-cover border-2 border-border-primary-users"
          />
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 text-sm bg-background-accent-users text-accent-primary-users rounded-md hover:bg-border-primary-users transition-colors"
            >
              {t("Change")}
            </button>
            <button
              type="button"
              onClick={removePhoto}
              className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
            >
              {t("Remove")}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border-primary-users rounded-lg p-6 text-center cursor-pointer hover:border-accent-primary-users transition-colors"
        >
          <UploadIcon className="w-8 h-8 mx-auto mb-2 text-text-secondary-users" />
          <div className="text-text-secondary-users">
            <p className="text-sm">{t("Click to upload a photo")}</p>
            <p className="text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
