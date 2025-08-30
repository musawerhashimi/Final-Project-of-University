
import { useState, forwardRef } from "react";
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import type { ButtonElement, DropdownElement } from "./Input";

interface Props {
  type?: HTMLInputTypeAttribute | "textarea";
  value?: InputHTMLAttributes<HTMLElement>["value"];
  step?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  placeholderBg?: string;
  onChange: (val: string) => void;
  rightElements?: (ButtonElement | DropdownElement)[];
  error?: string;
  name?: string;
}

const FormInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({
    placeholder,
    type,
    value,
    step,
    min,
    max,
    placeholderBg = "bg-base",
    onChange,
    rightElements = [],
    error,
    name,
    ...props
  }, ref) => {
    const [isFocus, setFocus] = useState(false);
    const isFloating = isFocus || (value !== undefined && value !== "");
    const hasError = !!error;

    return (
      <div className="space-y-1">
        <div
          className={`flex relative rounded-md focus-within:rounded-md focus-within:border-indigo border border-b-2 duration-300 ${
            hasError
              ? "border-red-500 border-b-red-500"
              : rightElements.length > 0 || (value !== undefined && value !== "") || type === "textarea"
              ? "border-indigo border-b-indigo"
              : "border-transparent border-b-indigo rounded-b-none"
          }`}
        >
          <span
            className={`absolute pointer-events-none px-1 ${
              isFloating && placeholderBg
            } start-2 transition-[top] ${
              isFloating ? "-top-3" : "top-2 opacity-80"
            } ${hasError ? "text-red-500" : ""}`}
          >
            {placeholder}
          </span>
          
          <div className="flex-1">
            {type === "textarea" ? (
              <textarea
                ref={ref as React.Ref<HTMLTextAreaElement>}
                rows={3}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                className={`outline-none w-full px-3 py-2 resize-none ${
                  hasError ? "text-red-900" : ""
                }`}
                name={name}
                {...props}
              />
            ) : (
              <input
                ref={ref as React.Ref<HTMLInputElement>}
                type={type}
                step={step}
                value={value}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                className={`outline-none w-full px-3 py-2 ${
                  hasError ? "text-red-900" : ""
                }`}
                name={name}
                {...props}
              />
            )}
          </div>
          
          {rightElements.length > 0 && (
            <div className="border-s-1 border-indigo rounded-e-md overflow-hidden">
              {rightElements.map((element, index) =>
                element.type === "button" ? (
                  <button
                    key={index}
                    className={`h-full p-1 border-e-1 border-indigo hover:bg-hover transition-colors duration-300 cursor-pointer ${element.className}`}
                    onClick={element.onClick}
                    type="button"
                  >
                    {element.text}
                  </button>
                ) : (
                  <select
                    key={index}
                    defaultValue={element.default}
                    className={`p-1 h-full hover:bg-hover transition-colors duration-300 ${element.className}`}
                    onChange={(event) => {
                      element.onChange(event.target.value);
                    }}
                  >
                    {element.options.map((option) => (
                      <option key={option.value} value={option.key}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                )
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-error-front text-xs mt-1 px-2">{error}</p>
        )}
      </div>
    );
  }
);

export default FormInput;