import { Link } from "react-router-dom";
import type { BackendUser, Location } from "./UserList";
import { useTranslation } from "react-i18next";

export function UserCard({
  user,
  location,
}: {
  user: BackendUser;
  location?: Location;
}) {
  const MailIcon = (p: React.SVGProps<SVGSVGElement>) => (
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
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  );

  const PhoneIcon = (p: React.SVGProps<SVGSVGElement>) => (
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );

  const BuildingIcon = (p: React.SVGProps<SVGSVGElement>) => (
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
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
      <path d="M9 22v-4h6v4"></path>
      <path d="M8 6h.01"></path>
      <path d="M16 6h.01"></path>
      <path d="M12 6h.01"></path>
      <path d="M12 10h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 10h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 10h.01"></path>
      <path d="M8 14h.01"></path>
    </svg>
  );
  const { t } = useTranslation();
  return (
    <div className="bg-background-secondary-users rounded-xl shadow-sm border border-border-primary-users p-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 transition-all duration-300 hover:shadow-lg hover:border-accent-primary-users">
      <img
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover flex-shrink-0"
        src={user.avatar_url}
        alt={`${user.first_name} ${user.last_name}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "images/user.jpeg";
        }}
      />
      <div className="flex-grow text-center sm:text-start">
        <span className="text-xs font-semibold bg-background-accent-users text-accent-primary-users px-2 py-1 rounded-full">
          {user.role_name}
        </span>
        <h3 className="text-lg font-bold text-text-primary-users mt-1">
          {user.first_name} {user.last_name}
        </h3>
        <p className="text-sm text-text-secondary-users">@{user.username}</p>

        <div className="mt-3 pt-3 border-t border-border-primary-users text-sm text-text-secondary-users space-y-2">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <MailIcon className="w-4 h-4" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <PhoneIcon className="w-4 h-4" />
              <span className="truncate">{user.phone}</span>
            </div>
          )}
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <BuildingIcon className="w-4 h-4" />
            <span className="truncate">
              {location?.name || "Unknown Location"}
            </span>
          </div>
        </div>
      </div>
      <div className="self-center sm:self-end">
        <Link
          to={`/settings/users/${user.id}/profile`}
          className="inline-block px-4 py-2 text-sm font-semibold text-white bg-accent-primary-users rounded-lg shadow-sm transition-colors hover:bg-accent-hover-users focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary-users focus:ring-offset-background-secondary-users"
        >
          {t("Profile")}
        </Link>
      </div>
    </div>
  );
}
