// hooks/useCan.ts
import type { Permission } from "../data/permissions";
import { useUserProfileStore } from "../stores/useUserStore";

export const useCan = (
  permission: Permission | Permission[],
  all?: boolean
) => {
  return useUserProfileStore((s) => s.hasPermission(permission, all));
};
