// components/Can.tsx
// components/Can.tsx
import type { ReactNode } from "react";
import { useUserProfileStore } from "../stores/useUserStore";
import type { Permission } from "../data/permissions";

export const Can = ({
  permission,
  children,
  all,
}: {
  permission?: Permission | Permission[];
  all?: boolean;
  children: ReactNode;
}) => {
  const hasPermission = useUserProfileStore((s) => s.hasPermission);
  if (!permission) return <>{children}</>;
  return hasPermission(permission, all) ? <>{children}</> : null;
};
