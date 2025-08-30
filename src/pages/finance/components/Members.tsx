import CommingSoon from "../../../components/CommingSoon";
import RouteBox from "../../../components/RouteBox";

// Define the main App component
export default function Members() {
  const route = [
    {
      name: "Finance",
      path: "/finance",
    },
    {
      name: "Members",
      path: "/finance/members",
    },
  ];

  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <CommingSoon />
    </>
  );
}
