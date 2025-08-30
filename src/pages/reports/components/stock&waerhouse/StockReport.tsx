import { useParams } from "react-router-dom";
import InventoryTable from "./sto";

export const SWReport = () => {
  const { location_id } = useParams();
  return <InventoryTable location_id={Number(location_id)} />;
};
