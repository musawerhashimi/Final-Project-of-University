import { type ReactNode } from "react";

interface Props {
  className?: string;
  isRotate: boolean;
  onClick: () => void;
  children: ReactNode;
}

function SliderButton({ className, isRotate, onClick, children }: Props) {
  return (
    <button
      onClick={onClick}
      className={`${className} px-2 py-4 ${
        isRotate ? "rotate-y-0" : "rotate-y-[1turn]"
      } transition-all ltr:rounded-r-none rtl:rounded-l-none transform duration-400 hover:bg-gray-600 rounded-lg z-50`}
    >
      {children}
    </button>
  );
}

export default SliderButton;
