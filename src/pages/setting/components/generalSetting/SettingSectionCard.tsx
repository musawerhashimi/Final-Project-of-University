import { Loader2 } from "lucide-react";

interface SectionCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

export function SectionCard({
  title,
  description,
  children,
  footer,
  isLoading = false,
}: SectionCardProps) {
  return (
    <div className="bg-card-settings border border-border-settings rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-card-foreground-settings">
            {title}
          </h2>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-primary-settings" />
          )}
        </div>
        <p className="mt-1 text-muted-foreground-settings">{description}</p>
        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-input-settings rounded w-1/4 mb-2"></div>
                  <div className="h-10 bg-input-settings rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
      {footer && (
        <div className="bg-input-settings/50 px-6 py-4 border-t border-border-settings flex justify-end items-center">
          {footer}
        </div>
      )}
    </div>
  );
}
