import type { FieldError, UseFormRegister } from "react-hook-form";

interface EditableFieldProps {
  label: string;
  name: "firstName" | "lastName" | "username" | "phone"; // Use literal types
  displayValue: string; // The value to show when not editing
  Icon: React.ElementType;
  isEditing: boolean;
  register: UseFormRegister<any>; // Pass the register function
  error?: FieldError; // Pass the error object for this field
  inputType?: string;
}
export default function EditableField({
  label,
  name,
  displayValue,
  Icon,
  isEditing,
  register,
  error,
  inputType = "text",
}: EditableFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
        <Icon className="w-4 h-4 me-2" />
        {label}
      </label>
      {isEditing ? (
        <>
          <input
            type={inputType}
            // value={displayValue}
            {...register(name)}
            // onChange={(e) => onValueChange(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
          )}
        </>
      ) : (
        <p className="mt-1 text-md text-gray-900 dark:text-gray-200">
          {displayValue}
        </p>
      )}
    </div>
  );
}
