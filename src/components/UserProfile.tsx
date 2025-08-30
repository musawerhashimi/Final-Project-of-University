import { FaSignOutAlt } from "react-icons/fa";
import { useUserProfileStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function UserProfile() {
  const { t } = useTranslation();
  const logout = useUserProfileStore((s) => s.logout);
  const navigate = useNavigate();
  const userProfile = useUserProfileStore((s) => s.userProfile);
  const name = userProfile
    ? userProfile.firstName + " " + userProfile.lastName
    : "User";
  const avatar = userProfile ? userProfile.avatarUrl : "/default-avatar.png";
  const logoutUser = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="mt-1 flex items-start justify-around p-2">
      <div className=" border-gray-700">
        <img className=" h-12 w-12 rounded-full" src={avatar} alt="" />
      </div>
      <div>
        <h2 className="font-bold w-24">{name}</h2>
        <div className="text-white">
          <h4
            onClick={logoutUser}
            className="bg-blue-500 hover:bg-blue-700  ps-2 py-0.5 rounded-md shadow transition-colors cursor-pointer"
          >
            <FaSignOutAlt className="inline" />{" "}
            <span className="ms-1"> {t("Logout")}</span>
          </h4>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
