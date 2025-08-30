import { useState } from "react";
import LeftsideProfile from "./LeftsideProfile";
import RightsideProfile from "./RightsideProfile";
import customers from "../../../../data/customers";
import { useParams } from "react-router-dom";
import RouteBox from "../../../../components/RouteBox";
import { FaBars, FaTimes } from "react-icons/fa";

export default function CustomerProfile() {
  const { id_card } = useParams();

  const customer = customers.find((item) => item.id_card === Number(id_card));

  const [showSidebar, setShowSidebar] = useState(false);

  const routename = [
    { path: "/customers", name: "Customers" },
    { path: "", name: `${customer?.name}` },
  ];

  if (!customer) {
    return <p className="text-red-500">Customer not found</p>;
  }

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />

      {/* Mobile: Open Sidebar Button */}
      <button
        className="md:hidden relative  top-17 left-5 z-50 bg-blue-600 text-white p-2 rounded-full shadow"
        onClick={() => setShowSidebar(true)}
        aria-label="Open customer info"
      >
        <FaBars size={20} />
      </button>

      <div className="min-h-screen bg-gray-100 flex font-inter">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="w-70 bg-white p-6 shadow-md  flex-col hidden md:block">
          <LeftsideProfile items={customer} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full p-8">
          <RightsideProfile items={customer} />
        </main>
      </div>

      {/* Mobile Sidebar Modal */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-white/60 backdrop:blur-3xl bg-opacity-40"
            onClick={() => setShowSidebar(false)}
          ></div>
          {/* Sidebar */}
          <aside className="relative w-70 max-w-xs bg-white p-6 shadow-lg h-full z-50 animate-slide-in-left overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowSidebar(false)}
              aria-label="Close customer info"
            >
              <FaTimes size={24} />
            </button>
            <LeftsideProfile items={customer} />
          </aside>
        </div>
      )}
    </>
  );
}





import { useState } from "react";
import { FaEye, FaEdit, FaUser } from "react-icons/fa";
import { Button } from "primereact/button";
import ReceiptDialog from "../../../sales/components/ReceiptDialog";
import CustomDialog from "../../../../components/CustomDialog";
import receipt from "../../../../data/receipt";
import type { Customers } from "../../../../data/customers";
import type { Receipt } from "../../../../entities/Receipt";
import { customerSchema } from "../../../../schemas/customerProfileValidation";
import { Link } from "react-router-dom";

//---------------------------------------------------//

interface RightsideProfileProp {
  items: Customers;
}

export default function RightsideProfile({ items }: RightsideProfileProp) {
  //----------------------------------------------------------------

  const [visible, setVisible] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [position, setPosition] = useState<string>("center");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const customerReceipts = receipt.filter(
    (r) => r.customer_id === items.id_card
  );
  const totalsByCurrency: Record<string, number> = customerReceipts.reduce(
    (acc, curr) => {
      acc[curr.currency] = (acc[curr.currency] || 0) + curr.total_amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const show = (position: string) => {
    setPosition(position);
    setVisible(true);
  };

  const [formData, setFormData] = useState({
    name: items.name || "",
    email: items.email || "",
    address: items.address || "",
    phone: String(items.phone || ""),
    city: items.city || "",
    birth: items.date_of_birth || "",
    gender: items.gender?.toLowerCase() || "male",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const result = customerSchema.safeParse(formData);
    if (!result.success) {
      // Map Zod errors to a field: message object
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    // ...submit logic...
    setVisible(false);
  };

  //----------------------------------------------------------------------
  return (
    <>
      {selectedReceipt && (
        <ReceiptDialog
          visible={true}
          onHide={() => setSelectedReceipt(null)}
          receipt={selectedReceipt}
        />
      )}
      <div className="flex justify-end mb-8 space-x-4">
        <Link
          to={`/customers/${items.id_card}/statement`}
          className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white"
        >
          Statement
        </Link>
        <Button
          className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white "
          label="Edit Profile"
          icon={
            <FaEdit
              className="me-2
              "
            />
          }
          onClick={() => show("center")}
        ></Button>
        <CustomDialog
          visible={visible}
          onHide={() => setVisible(false)}
          position={position}
          headerchildren={
            <>
              <p className="font-bold p-2">Edit Customer Information</p>
            </>
          }
          bodychildren={
            <>
              <div className="grid grid-cols-1 gap-3 p-2">
                {Object.entries(formData).map(
                  ([key, val]) =>
                    key !== "gender" && (
                      <div key={key} className="mb-2">
                        <input
                          type={key === "birth" ? "date" : "text"}
                          name={key}
                          value={val}
                          onChange={handleInputChange}
                          placeholder={key}
                          className="border p-2 rounded w-full"
                        />
                        {formErrors[key] && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors[key]}
                          </p>
                        )}
                      </div>
                    )
                )}
                <div className="flex items-center gap-4">
                  <label className="font-bold">Gender:</label>
                  {["male", "female"].map((g) => (
                    <label key={g} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleInputChange}
                      />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                  {formErrors.gender && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.gender}
                    </p>
                  )}
                </div>
              </div>
            </>
          }
          footerchildren={
            <>
              <div className="mt-3">
                <div className="inline me-2">
                  <Button
                    className="bg-red-500 px-2 py-1 rounded-md text-white hover:bg-red-800"
                    label="Close"
                    icon="pi pi-check"
                    onClick={() => setVisible(false)}
                    autoFocus
                  />
                </div>
                <div className="inline">
                  <Button
                    className="bg-green-500 px-2 py-1 rounded-md text-white hover:bg-green-800"
                    label="Submit"
                    onClick={handleSubmit}
                    autoFocus
                  />
                </div>
              </div>
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Purchased Amount Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div className="p-3">
            <h3 className="text-gray-500 mb-3">Purchased Amount</h3>
            {Object.entries(totalsByCurrency).map(([currency, amount]) => (
              <p
                key={currency}
                className="text-xl font-bold text-gray-800 inline mx-1"
              >
                {amount}{" "}
                <span className="text-sm text-gray-500">{currency}</span>
              </p>
            ))}
          </div>
          <div className="bg-blue-100 rounded-full p-3">
            <span className="text-blue-600 text-2xl">🏆</span>{" "}
            {/* Placeholder for icon */}
          </div>
        </div>

        {/* ID Number Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-gray-600  mb-3">ID Number</h3>
            <p className="text-2xl font-bold text-gray-800">{items.id_card}</p>
          </div>
          <div className="bg-gray-100 rounded-full p-3">
            <FaUser size={28} className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Purchase History
        </h2>
        <div className=" border border-gray-200 rounded-lg p-4 mb-4">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2">Full Name</th>
                <th className="py-2">Date</th>
                <th className="py-2">Recipt Id</th>
                <th className="py-2">Amount</th>
                <th className="py-2">See More</th>
              </tr>
            </thead>

            <tbody>
              {customerReceipts.map((r) => (
                <>
                  <tr
                    key={r.id}
                    className="border-b border-gray-100 text-center"
                  >
                    <td className="py-2">{items.name}</td>
                    <td className="py-2">
                      {new Date(r.sale_date).toLocaleString()}
                    </td>
                    <td className="py-2">{r.id}</td>
                    <td className="py-2">
                      {r.total_amount} {r.currency}
                    </td>
                    <td className="py-2">
                      <Button
                        className=" bg-success hover:bg-green-600 text-white  p-1 rounded-sm transition-colors duration-300"
                        icon={<FaEye />}
                        onClick={() => setSelectedReceipt(r)}
                      />
                    </td>
                  </tr>
                </>
              ))}
            </tbody>

            <tfoot>
              <tr className="p-2 bg-gray-100">
                <th className="font-bold text-gray-800">Total</th>
                <td></td>
                <td></td>
                <td className="py-2 font-bold text-red-600 text-center ">
                  {Object.entries(totalsByCurrency).map(
                    ([currency, amount]) => (
                      <p
                        key={currency}
                        className="text-xl font-bold text-gray-800 inline mx-1"
                      >
                        {amount}{" "}
                        <span className="text-sm text-gray-500">
                          {currency}
                        </span>
                      </p>
                    )
                  )}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
}


import { useRef, useState } from "react";
import {
  FaChevronCircleDown,
  FaEnvelope,
  FaMap,
  FaMapMarkedAlt,
  FaPhone,
} from "react-icons/fa";
import DiscountCircle from "./DiscountBox";
import type { Customers } from "../../../../data/customers";

interface LeftProfilePro {
  items: Customers;
}

export default function LeftsideProfile({ items }: LeftProfilePro) {
  // Use local state for image preview
  const [image, setImage] = useState(items.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit image handler
  const handleEditImage = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setImage(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Ensure balances is always an object with string keys and number values
  const accountBalances: Record<string, number> = items.balance;

  return (
    <>
      <div className="relative flex justify-center mb-2">
        <img
          src={image}
          alt="Logo"
          className="w-40 h-40 object-cover rounded-full border-4 border-blue-400 shadow"
        />
        <button
          className="absolute bottom-2 right-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition"
          title="Edit Image"
          onClick={handleEditImage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6"
            />
          </svg>
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      <h2 className="text-md font-semibold text-gray-700 mb-1 text-center border-2 shadow-md border-gray-200 rounded-md">
        {items.name}
      </h2>
      <nav>
        <ul className="mt-3 bg-white shadow-lg p-2 border-t border-gray-200 rounded-md">
          <h1 className="text-center p-2 border-b border-gray-200 mb-3">
            Customer Informations
          </h1>
          <li className="mb-4">
            <FaPhone className="inline me-1" /> {items.phone}
          </li>
          <li className="mb-4">
            <FaEnvelope className="inline me-1" /> {items.email}
          </li>
          <li className="mb-4">
            <FaMapMarkedAlt className="inline me-1" /> {items.address}
          </li>
          <li className="mb-4">
            <FaMap className="inline me-1" /> {items.city}
          </li>
        </ul>
      </nav>
      <div className="bg-white p-6 rounded-lg shadow-lg border-t border-gray-200 text-center mt-6">
        <h3 className="text-gray-600 mb-4">Customer Account Balance</h3>
        <div className="bg-gray-100 rounded-md p-2 text-green-500">
          {Object.entries(accountBalances).map(([currency, balance]) => (
            <div key={currency}>
              <p className="text-3xl font-bold mb-2">{Number(balance)}</p>
              <p className="text-sm text-gray-500 mb-2">({currency})</p>
            </div>
          ))}
          <div className="flex justify-center mt-3">
            <button className="bg-red-100 rounded-full p-2 flex items-center justify-center">
              <FaChevronCircleDown size={24} />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 border-t border-gray-200 rounded-lg shadow-md flex flex-col items-center mt-6">
        <h3 className="text-gray-600 mt-4 text-center">
          Customer Unique Discount
        </h3>
        <DiscountCircle label="Discount" percentage={0} />
      </div>
    </>
  );
}


coming data from apiClient.get(/customers/customers/{id})

sample data:

{
    "id": 1,
    "customer_number": "CUS-000001",
    "name": "Nabi",
    "gender": "Male",
    "photo": "http://localhost:8000/media/customers/images/nabi-47524e.png",
    "email": "nabi@gmail.com",
    "phone": "0789123456",
    "discount_percentage": 0.0,
    "balance": "-1025.080000000",
    "date_joined": "2025-07-15",
    "status": "active",
    "notes": "",
    "birth_date": "2000-05-17",
    "total_purchases": "55.50",
    "purchase_count": 7,
    "address": "Jangalak",
    "city": "Kabul",
    "created_by_user_name": "Suhail Sirat",
    "sales": [
        {
            "id": 21,
            "sale_number": "SALE-000021",
            "customer": {
                "id": 1,
                "name": "Nabi",
                "balance": -1025.08,
                "added_to_account": 16.0
            },
            "receipt_id": "1752734605030",
            "sale_date": "2025-44-07/17/25-06",
            "currency": 2,
            "payment_status": "pending",
            "subtotal": "1600.0000",
            "total_amount": "1600.0000",
            "discount_amount": "0.0000",
            "status": "Processed",
            "type": "Loan",
            "items_count": 3,
            "paid_amount": "0.0000",
            "balance_due": "1600.0000",
            "user": "Suhail Sirat",
            "items": [
                {
                    "id": 26,
                    "inventory": 85,
                    "name": "Frozen Mixed Vegetables",
                    "quantity": 1.0,
                    "price": 720.0,
                    "discount": 0.0,
                    "subtotal": 720.0
                },
                ...
            ]
        },
        ...
    ]
}

hey bro

i want you to connect the front to backend

in see more button of purchase history
call ReceiptDialog and pass sale as receipt prop
this is props of ReceiptDialog

interface ReceiptDialogProps {
  visible: boolean;
  onHide: () => void;
  receipt: Receipt;
}

update data api expected:
{
    "name": "Nabi",
    "birth_date": "2000-05-17",
    "email": "nabi@gmail.com",
    "phone": "0789123456",
    "address": "Jangalak",
    "city": "Kabul",
    "gender": "M"
}

do not do anything to statement button
for editing profile, you can either edit it traditionally using a modal and the edit profile button as is or you know better
and if you prefer modal, open a beatiful designed modal to edit profile
handle photo update
show purchase history any way you like.
for dates use formatLocalDateTime function coming from /utils/formatLocalDateTime

for amounts + currencies use formatPriceWithCUrrency coming from useCurrencyStore(s => s.formatPriceWithCUrrency) located in /stores/useCurrencyStore

and if no currency use getBaseCurrency().id from useCurrencyStore(s => s.getBaseCurrency)

if you have any question ask me
