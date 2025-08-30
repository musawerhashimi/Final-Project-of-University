import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  children: ReactNode | ReactNode[];
}

function Popup({ children, isOpen, setOpen }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  return (
    <div className="relative">
      <div
        ref={ref}
        className="absolute top-2  start-0 z-50 min-w-max animate-in slide-in-from-top-2 duration-200"
      >
        {children}
      </div>
    </div>
  );
}

export default Popup;
