import type { Path, UseFormRegister } from "react-hook-form";
import { useCan } from "../../../../hooks/useCan";
import { AlertCircle } from "lucide-react";

interface InputFieldProps<T extends Record<string, any>> {
  label: string;
  type?: string;
  name: Path<T>;
  register: UseFormRegister<T>;

  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  error?: string;
}
export function InputField<T extends Record<string, any>>({
  label,
  type = "text",
  name,
  register,
  // value,
  // onChange,
  placeholder,
  icon: Icon,
  disabled = false,
  error,
}: InputFieldProps<T>) {
  const allowed = useCan("settings");
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-muted-foreground-settings my-1"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground-settings" />
        )}
        <input
          type={type}
          id={name}
          // value={value}
          // onChange={onChange}
          placeholder={placeholder}
          disabled={disabled || !allowed}
          className={`w-full rounded-lg border bg-input-settings px-4 py-2 text-foreground-settings focus:ring-2 focus:ring-primary-settings focus:border-primary-settings focus:outline-0 transition-all duration-200 ${
            Icon ? "pl-10" : ""
          } ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-border-settings"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          {...register(name, { valueAsNumber: type === "number" })}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
