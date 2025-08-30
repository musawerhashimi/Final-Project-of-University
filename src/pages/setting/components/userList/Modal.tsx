import { useEffect, useRef } from "react";

export function Modal({
  isOpen,
  onClose,
  children,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const XIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...p}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  );
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === event.target) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-background-secondary-users rounded-xl shadow-2xl w-full max-w-lg m-4 border border-border-primary-users max-h-[90vh] overflow-y-auto">
        <header className="flex items-center justify-between p-5 border-b border-border-primary-users sticky top-0 bg-background-secondary-users">
          <h2 className="text-xl font-bold text-text-primary-users">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-text-secondary-users hover:bg-background-accent-users"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
