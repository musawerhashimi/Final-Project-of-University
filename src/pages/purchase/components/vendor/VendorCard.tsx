import { Link } from "react-router-dom";
import getRandomColor from "./RandomColors";
import { useVendorStore } from "../../../../stores";

function VendorCard() {
  const vendors = useVendorStore((s) => s.vendors);
  return (
    <>
      {vendors.map((i) => (
        <Link to={`/purchase/vendors/${i.id}`}>
          <div className="flex items-center gap-3 bg-white hover:bg-active shadow p-4 rounded-md w-full max-w-xs">
            <div
              className={`w-10 h-10 ${getRandomColor()} text-white flex items-center justify-center rounded-full font-bold`}
            >
              {i.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm text-sky-700 font-medium">{i.name}</div>
          </div>
        </Link>
      ))}
    </>
  );
}

export default VendorCard;
