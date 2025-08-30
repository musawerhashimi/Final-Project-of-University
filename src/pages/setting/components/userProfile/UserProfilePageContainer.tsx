import { useParams } from "react-router-dom";
import UserProfilePage from "./UserProfile";

export function UserProfilePageContainer() {
  const { userId } = useParams();

  return <UserProfilePage userId={Number(userId)} />;
}
