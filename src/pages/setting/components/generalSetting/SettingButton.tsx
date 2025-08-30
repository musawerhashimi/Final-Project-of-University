import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  form?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
}

export function Button({
  children,
  onClick,

  variant = "primary",
  className = "",
  form,
  disabled = false,
  loading = false,
  type = "button",
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-settings disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-primary-settings text-primary-foreground-settings hover:bg-primary-settings/90 focus:ring-primary-settings disabled:hover:bg-primary-settings",
    secondary:
      "bg-input-settings text-card-foreground-settings hover:bg-border-settings focus:ring-primary-settings border border-border-settings disabled:hover:bg-input-settings",
  };

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
