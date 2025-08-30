import CommingSoon from "../../../components/CommingSoon";
import RouteBox from "../../../components/RouteBox";

export const UserCashFlow = () => {
  const route = [
    {
      name: "Reports",
      path: "/reports",
    },
    { name: "User Cash Flow", path: "" },
  ];
  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <CommingSoon />
    </>
  );
};
