// components/sidebar/SidebarItem.tsx
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { hasRoutePermission } from "../../data/permissions";
import type { SidebarItemData } from "../../data/sidebarItems";
import { useUserProfileStore } from "../../stores/useUserStore";

interface SidebarItemProps {
  item: SidebarItemData;
  isOpen: boolean;
}

export default function SidebarItem({ item, isOpen }: SidebarItemProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const main_path = "/" + pathname.slice(1).split("/")[0];
  const isActive =
    main_path === item.link ||
    (main_path === "/dashboard" && item.label === "dashboard");
  const userPermissions = useUserProfileStore(
    (s) => s.userProfile?.permissions
  );
  if (!userPermissions) return;
  
  const hasRoutePerm = hasRoutePermission(item.link, userPermissions);
  return hasRoutePerm ? (
    <li>
      <Link
        to={item.link}
        className={`flex items-center p-2 rounded transition-colors duration-200 
          ${
            isActive
              ? "bg-sky-600 text-white font-semibold"
              : "hover:bg-hover-effect"
          }`}
      >
        <item.Icon
          className={`transition-[font-size,line-height] duration-700 text-3xl
          ${isOpen ? "md:me-3 md:text-xl" : "text-3xl"}`}
        />
        {isOpen && (
          <span className="hidden md:block whitespace-nowrap">
            {t(item.label)}
          </span>
        )}
      </Link>
    </li>
  ) : null;
}
