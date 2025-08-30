import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import type { Vendor } from "../../../entities/Vendor";

interface Props {
  value: string;
  items: Vendor[];
  placeholder?: string;
  onChangeInput: (value: string) => void;
  onSelectItem: (item: Vendor) => void;
}
const VendorFilterInput = ({
  value,
  items,
  placeholder,
  onChangeInput,
  onSelectItem,
}: Props) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setIsListOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (item: Vendor) => {
    // onChangeInput(item.name)
    onSelectItem(item);
    setIsListOpen(false);
  };
  return (
    <div className="relative" ref={componentRef}>
      {/* The main input field container */}
      <div className="flex items-center w-full border rounded-lg shadow-sm transition-all duration-200 border-border-color text-[var(--color-text-primary-mock)] focus-within:border-[var(--color-primary-mock)] focus-within:shadow-sm">
        <div className="pl-4 pr-2 text-muted-foreground-mock123">
          <FaSearch />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChangeInput(e.target.value);
            setIsListOpen(true);
          }}
          onFocus={() => setIsListOpen(true)}
          className="w-full px-3 py-2 focus:outline-none placeholder-[var(--color-text-muted-mock)]"
        />
      </div>

      {/* The results list dropdown */}
      {isListOpen && items.length > 0 && (
        <div className="absolute top-full w-full origin-top shadow-xxl rounded-lg bg-base z-10 bg-popover-mock123 overflow-hidden">
          <ul className="flex flex-wrap py-1 max-h-80 overflow-y-auto">
            {items.map((item) => (
              <li
                key={item.id}
                className="hover:bg-sky-100 hover:text-black w-1/2 border-r last:border-r-0 border-border-color"
              >
                <button
                  onClick={() => handleItemClick(item)}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-popover-foreground-mock123 hover:bg-secondary-mock123 transition-colors"
                >
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{item.name}</p>
                  </div>
                  <span className="text-xs bg-muted-mock123 text-muted-foreground-mock123 px-2 py-1 rounded-full">
                    {" "}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VendorFilterInput;
