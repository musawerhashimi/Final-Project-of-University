import { Button } from "primereact/button";
import {
  useState,
  type HTMLInputTypeAttribute,
  type InputHTMLAttributes,
} from "react";

export interface ButtonElement {
  type: "button";
  text: string;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
}

export interface DropdownElement<T = number> {
  type: "dropdown";
  className?: string;
  default?: T;
  options: { key: T; value: string }[];
  onChange: (value: string) => void;
}

interface Props {
  type?: HTMLInputTypeAttribute | "textarea";
  value?: InputHTMLAttributes<HTMLElement>["value"];
  step?: number;
  min?: number;
  disabled?: boolean;
  placeholder?: string;
  placeholderBg?: string;
  onChange: (val: string) => void;
  rightElements?: (ButtonElement | DropdownElement)[];
}

function Input({
  placeholder,
  type,
  value,
  step,
  disabled,
  min,
  placeholderBg = "bg-base",
  onChange,
  rightElements = [],
}: Props) {
  const [isFocus, setFocus] = useState(false);
  const isFloating = isFocus || (value !== undefined && value !== "");
  return (
    <div
      className={`flex relative rounded-md  border-blue-300  border  duration-300 
          
      `}
    >
      <span
        className={`absolute px-1 pointer-events-none ${
          isFloating && placeholderBg
        } start-2 transition-[top] ${
          isFloating ? "-top-3" : "top-2 opacity-80"
        }`}
      >
        {placeholder}
      </span>
      <div className="flex-1">
        {type === "textarea" ? (
          <textarea
            rows={3}
            value={value}
            disabled={disabled}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className="outline-none w-full px-3 py-2 resize-none"
          />
        ) : (
          <input
            type={type}
            step={step}
            value={value}
            disabled={disabled}
            min={min}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className="outline-none w-full px-3 py-2"
          />
        )}
      </div>
      {rightElements.length > 0 && (
        <div className="flex border-s-1 border-indigo rounded-e-md overflow-hidden">
          {rightElements.map((element, index) => (
            <div className="border-e border-indigo last:border-0">
              {element.type === "button" ? (
                <Button
                  key={index}
                  disabled={element.disabled}
                  className={`h-full p-1 border-e-1 border-indigo hover:bg-hover transition-colors duration-300 cursor-pointer ${element.className}`}
                  onClick={element.onClick}
                >
                  {element.text}
                </Button>
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
                    <option key={option.key} value={option.key}>
                      {option.value}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Input;
