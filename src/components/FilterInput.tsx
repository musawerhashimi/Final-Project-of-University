import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  onChange: (value: string | number) => void;
  options: { key: string | number; value: string }[];
  placeholder: string;
  onAdd?: (value: string) => void;
  disabled?: boolean;
}

function FilterInput({
  value,
  onChange,
  options,
  placeholder,
  onAdd,
  disabled = false,
}: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredOptions = options.filter((option) =>
    option.value.toLowerCase().includes(filter.toLowerCase())
  );
  const componentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={componentRef}>
      <div
        className={`flex border overflow-hidden rounded-lg transition-all duration-200 ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-[var(--color-surface-mock)]"
            : "bg-[var(--color-background-mock)]"
        } border-border-add-purchase focus-within:border-[var(--color-primary-mock)] focus-within:shadow-sm`}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          // onBlur={() => setIsOpen(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 px-3 py-2 bg-transparent
            text-[var(--color-text-primary-mock)]
            placeholder-[var(--color-text-muted-mock)]
            focus:outline-none ${disabled && "cursor-not-allowed"}`}
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="px-2 hover:bg-[var(--color-surface-hover-mock)] transition-colors duration-200"
        >
          <ChevronDown
            className={`w-4 h-4 text-[var(--color-text-secondary-mock)] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-background-mock)] border border-border-add-purchase rounded-lg shadow-lg z-50  overflow-auto">
          <div className="p-2">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter..."
              className="w-full px-2 py-1 text-sm bg-[var(--color-surface-mock)] border border-border-add-purchase rounded text-[var(--color-text-primary-mock)] placeholder-[var(--color-text-muted-mock)] focus:outline-none focus:border-[var(--color-primary-mock)]"
            />
          </div>
          <div className="max-h-32 overflow-auto">
            {filteredOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(option.key);
                  setIsOpen(false);
                  setFilter("");
                }}
                className="w-full text-left px-3 py-2 hover:bg-[var(--color-surface-hover-mock)] text-[var(--color-text-primary-mock)] transition-colors duration-150"
              >
                {option.value}
              </button>
            ))}
          </div>
          {onAdd && (
            <div className="border-t border-border-add-purchase p-2">
              <button
                type="button"
                onClick={() => {
                  if (!filter) return;
                  onAdd(filter);
                  setIsOpen(false);
                  setFilter("");
                }}
                className="w-full flex items-center gap-2 px-2 py-1 text-sm text-[var(--color-primary-mock)] hover:bg-[var(--color-surface-hover-mock)] rounded transition-colors duration-150"
              >
                <Plus className="w-3 h-3" />
                {t("Add New")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterInput;
