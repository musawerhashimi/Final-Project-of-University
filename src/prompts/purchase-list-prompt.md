import { FaEdit, FaEye } from "react-icons/fa";
import purchaselist from "../../../data/purchaseList";
import RouteBox from "../../../components/RouteBox";
import { Link } from "react-router-dom";

export default function PurchaseList() {
  const PurchaseLists = purchaselist;
  const routebox = [
    { path: "/purchase", name: "Purchase" },
    { path: "/purchase/purchaseList", name: "Purchase List" },
  ];  

  return (
    <>
      <RouteBox items={routebox} routlength={routebox.length} />
      <div className="p-5 m-3 shadow-muted-front shadow-md rounded-md bg-white">
        <table className="w-full overflow-auto  space-y-1">
          <thead className="p-3 font-bold border-b-2 border-e-active ">
            Purchase List
          </thead>

          <tr className="text-center bg-amber-200 ">
            <th>Date</th>
            <th>List Name</th>
            <th>Total Item</th>
            <th>Total Cost</th>
            <th>Status</th>
            <th colSpan={3}>Action</th>
          </tr>
          {PurchaseLists.map((list) => (
            <tr className="border-t-2 border-gray-300 text-center">
              <td>{list.date}</td>
              <td>{list.list_name}</td>
              <td>{list.total_item}</td>
              <td>
                {list.total_cost} {list.currency}
              </td>
              <td>{list.status}</td>
              <td>
                <Link
                  to={`/purchase/purchaseList/purchaseListDetails/${list.id}`}
                >
                  <FaEye className="text-blue-500 mx-auto " />
                </Link>
              </td>
              <td>
                <FaEdit className="text-success-front mx-auto " />
              </td>
              <td>
                <button className="m-1 px-2 rounded-2xl bg-success">
                  Clieck to Verifi
                </button>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
}


import { useParams } from "react-router-dom";
import RouteBox from "../../../components/RouteBox";
import PurchaseListReceipt from "./PurchaseListReceipt";
import purchaselist from "../../../data/purchaseList";

export default function PurchaseListDeatials() {
  const { id } = useParams();
  const list = purchaselist.find((item) => item.id === Number(id));

  const route = [
    { path: "/purchase", name: "Purchase" },
    { path: "/purchase/purchaseList", name: "Purchase List" },
    { path: "", name: list?.list_name },
  ];

  if (!list) return <p className="text-red-500 p-4 mx-auto">Not Found</p>;

  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <PurchaseListReceipt list={list} />
    </>
  );
}

import Logo from "../../../components/Logo";
import type { Purchaselist } from "../../../data/Purchaselist";
interface test {
  list: Purchaselist;
}
const logoSrc = "/images/logo.jpg";
export default function PurchaseListReceipt({ list }: test) {
  return (
    <>
      <div className="p-5 m-3 shadow-muted-front shadow-md rounded-md bg-white">
        <Logo src={logoSrc} children="Easy Shop" />
        <table className="w-full overflow-auto  space-y-1">
          <p>
            Purchase List Name:{" "}
            <span className="ms-2 font-bold">{list.list_name}</span>
          </p>
          <p>
            Date:
            <span className="ms-2 font-bold">{list.date}</span>
          </p>

          <tr className="text-center bg-amber-200 ">
            <th>Name</th>
            <th>Barcode</th>
            <th>Quantity</th>
            <th>Real Price</th>
            <th>Sub Total</th>
          </tr>
          {list.items.map((i) => (
            <tr className="border-t-2 border-gray-300 text-center">
              <td>{i.product_name}</td>
              <td>{i.product_barcode}</td>
              <td>
                {i.qty} {i.unit}
              </td>
              <td>
                {i.real_price}
                {list.currency}
              </td>
              <td>
                {i.real_price * i.qty}
                {list.currency}
              </td>
            </tr>
          ))}
          <tr className="border-t-2 border-gray-700 text-center font-bold">
            <th className="text-start">Totals</th>
            <td></td>
            <td>{list.total_item} item</td>
            <td>
              sum of costs
              {list.currency}
            </td>
            <td>
              {list.total_cost}
              {list.currency}
            </td>
          </tr>
        </table>
      </div>
    </>
  );
}

backend data coming from apiClient.get('/vendors/purchases/)
sample data:

{
    "count": 51,
    "next": "http://localhost:8000/api/vendors/purchases/?page=2",
    "previous": null,
    "results": [
        {
            "id": 36,
            "purchase_number": "PO000036",
            "vendor_name": "Alcozay",
            "location_name": "Central",
            "purchase_date": "2025-07-11T17:35:08.753429+04:30",
            "currency": 2,
            "total_amount": "600.00",
            "status": "received",
            "total_items": 1,
            "total_quantity": 200.0,
            "notes": ""
        },
        ....
    ]
}

sample data form:
{
  id: number,
  purchase_number: string,
  vendor_name: string,
  location_name: string,
  purchase_date: string,
  currency: number,
  total_amount: string,
  status: "received" | "pending",
  total_items: number,
  total_quantity: number,
  notes: string
}

backend data coming from apiClient.get(/vendors/purchases/{id})
sample data:

{
    "id": 57,
    "purchase_number": "PO000057",
    "vendor_name": "Alcozay",
    "location_name": "Central",
    "purchase_date": "2025-07-11T23:16:54.455433+04:30",
    "total_amount": "613.00",
    "currency": 1,
    "status": "received",
    "notes": "",
    "total_items": 6,
    "total_quantity": 192.0,
    "items": [
        {
            "product_name": "Face Tissue Box",
            "barcode": "00000065",
            "quantity": "50.000",
            "unit_cost": "2.00",
            "line_total": "100.00",
            "currency": 1
        },
        {
            "product_name": "Foam Plates",
            "barcode": "00000101",
            "quantity": "60.000",
            "unit_cost": "2.00",
            "line_total": "120.00",
            "currency": 1
        },
        {
            "product_name": "Frozen Mixed Vegetables",
            "barcode": "00000090",
            "quantity": "15.000",
            "unit_cost": "6.00",
            "line_total": "90.00",
            "currency": 1
        },
        {
            "product_name": "Garlic Powder",
            "barcode": "00000059",
            "quantity": "25.000",
            "unit_cost": "3.00",
            "line_total": "75.00",
            "currency": 1
        },
        {
            "product_name": "Ginger Paste",
            "barcode": "00000050",
            "quantity": "12.000",
            "unit_cost": "4.00",
            "line_total": "48.00",
            "currency": 1
        },
        {
            "product_name": "Hair Conditioner",
            "barcode": "00000092",
            "quantity": "30.000",
            "unit_cost": "6.00",
            "line_total": "180.00",
            "currency": 1
        }
    ]
}



hey bro this is some part of my code.
and i want you to connect the front to backend using react-query and axios
queryprovider is already made, apiClient is already made in /lib/api

in purchaseList component show data in a good ui table or anything you think is beautiful and fit this format of data.
purchase list data has status which can be pending or received, you can change there colors or things like this, those have pending status should have a button named receive which when clicked it asks for location maybe in a modal or any other you think is good. in location modal or anything else there are two buttons (store, warehouse) which enabling one disables another one and based on that the dropdown down that shows the data changes which for store comes from getStores and for warehouse comes from getWarehouses and both these functions come from useLocationStore(s => s.getStores/getWarehouses).
warehouse and store objects have id and name which can be used in dropdown.
and when clicking submit an call to api is made apiClient.post(/vendors/purchases/{id}/mark_recieved) and data to be sent is {location_id: location_id}.
and then the purchase is received.
there should be filters to filter received and pending purchases.
as you see the purchase list data coming from backend is paginated.
so i want you to implement an infinite scroll query using react-query and using react-infinite-scroll-component which i installed it.
date is shown wrapped in formatLocalDateTime coming from /utils/formatLocalDateTime.ts
total_amount and currency is passed to formatPriceWithCurrency(amount: number, currencyId: number) coming from useCurrencyStore(s => s.formatPriceWithCurrency) located in /stores/useCurrencyStore.ts

when the eye button or view button is clicked there is shown the detail of the purchase which purchase items and others as you can see the sample data, there also you can style it in a table or anything you think is fit for that format of data

if you have any question you can ask.
