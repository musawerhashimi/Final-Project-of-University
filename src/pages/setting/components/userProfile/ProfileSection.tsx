interface SectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export default function ProfileSection({
  title,
  icon: Icon,
  children,
}: SectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-[#e4e4e7] dark:border-[#404045]">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Icon className="w-6 h-6 text-indigo-500 dark:text-indigo-400 me-3" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {title}
          </h2>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
