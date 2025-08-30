import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Props for the generic EditableField component
interface EditableFieldProps {
  label: string;
  value: string | number;
  type: "text" | "number" | "select" | "textarea";
  options?: string[]; // Required for type 'select'
  onSave: (newValue: string | number) => void; // Callback to update parent state
  className?: string; // Optional additional styling for the value display
  error?: string;
  disabled?: boolean;
}

// Generic Editable Field Component
export default function EditableField({
  label,
  value,
  type,
  options,
  onSave,
  className,
  error,
  disabled,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >(null);

  // Update internal state if the prop value changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text for easier editing in text/number fields
      if (type === "text" || type === "number") {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, type]);

  const { t } = useTranslation();
  const handleEditClick = () => {
    if (disabled) return;
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Only save if the value has actually changed
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    let newValue: string | number = e.target.value;
    if (type === "number") {
      newValue = parseFloat(e.target.value);
      if (isNaN(newValue)) {
        newValue = 0; // Default to 0 or handle error as needed
      }
    }
    setCurrentValue(newValue);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (e.key === "Enter" && type !== "textarea") {
      // Enter key saves for single-line inputs
      e.preventDefault(); // Prevent new line in text input
      handleBlur();
    } else if (e.key === "Escape") {
      // Escape key cancels editing
      setCurrentValue(value); // Revert to original value
      setIsEditing(false);
    }
  };

  // Render the appropriate input element based on 'type'
  const renderInput = () => {
    // New styles for editable mode
    const editableClasses =
      " bg-blue-50 border-2 border-blue-500 rounded-lg px-4 py-2 text-blue-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 focus:shadow-lg transition-all duration-300 ease-in-out";

    switch (type) {
      case "text":
      case "number":
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            disabled={disabled}
            value={currentValue as string | number}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={editableClasses}
          />
        );
      case "select":
        return (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={currentValue as string}
            onChange={handleChange}
            disabled={disabled}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={editableClasses}
          >
            {/* Add empty option for better UX if no value is selected */}
            {!currentValue && <option value="">{t("Select an option")}</option>}
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentValue as string}
            onChange={handleChange}
            disabled={disabled}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            rows={4} // Allow multiple lines
            className={`${editableClasses} resize-y`}
          />
        );
      default:
        return null;
    }
  };

  // Get display value for non-editing state
  const getDisplayValue = () => {
    if (type === "select" && (!value || value === 0)) {
      return "Select an option";
    }
    return value || "";
  };

  return (
    <div className="flex flex-col py-3 last:border-b-0">
      <span className="text-sm font-semibold text-gray-500 mb-2">{label}</span>
      {isEditing ? (
        renderInput()
      ) : (
        <span
          className={`text-blue-600 text-lg font-semibold cursor-pointer hover:bg-indigo-50 rounded-lg px-4 py-2 -mx-4 -my-2 transition-all duration-300 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
          onClick={handleEditClick}
        >
          {getDisplayValue()}
        </span>
      )}
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}
