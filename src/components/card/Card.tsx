import type { ReactNode } from "react";

function Card({ children }: { children: ReactNode }) {
  return (
    <div
      className="group
      relative min-w-[230px] max-w-xs bg-primary
      text-primary-front rounded-xl shadow-md
      dark:shadow-lg overflow-hidden hover:shadow-xl
      transition-[border-color,translate] duration-400
      border-1 border-transparent hover:border-blue-400
      hover:-translate-y-1"
    >
      {children}
    </div>
  );
}

export default Card;
