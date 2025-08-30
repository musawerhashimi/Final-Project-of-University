// import type { ReactNode } from "react";

// const colorMap = {
// blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
// gray: "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300",
// red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
// green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
// yellow:
//   "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
// indigo:
//   "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
// purple:
//   "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
// pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
// };

// interface Props {
//   color?: keyof typeof colorMap;
//   children: ReactNode;
// }

// function Badge({ color = "gray", children }: Props) {
//   return (
//     <div
//       className={
//         colorMap[color] + " text-xs font-medium px-2.5 py-0.5 rounded-md"
//       }
//     >
//       {children}
//     </div>
//   );
// }

// export default Badge;

import type { ReactNode } from "react";

// This map of full class strings is the key to making this work.
// By listing all possible class names explicitly, the Tailwind JIT
// compiler can easily find and include them in the final CSS bundle.
const colorMap = {
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
};

interface Props {
  color?: keyof typeof colorMap;
  children: ReactNode;
}

// The component is now a little simpler because we're relying on the
// colorMap to provide the full set of classes. We combine the static
// classes with the dynamic ones.
function Badge({ color = "purple", children }: Props) {
  // We use template literals to create the full className string.
  // This is a common and reliable pattern for Tailwind.
  const baseClasses = "text-xs font-medium px-2.5 py-0.5 rounded-md";
  const colorClasses = colorMap[color] || colorMap.purple; // Fallback to yellow

  return <span className={`${baseClasses} ${colorClasses}`}>{children}</span>;
}

export default Badge;
