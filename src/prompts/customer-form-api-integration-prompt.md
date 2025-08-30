import { useEffect, useState } from "react";
import CircleAnimation from "../../components/animation";
import LeftSideMenu from "./components/LeftSide";
import RightSide from "./components/RightSide";
import CustomDialog from "../../components/CustomDialog";
import { Button } from "primereact/button";
import { FaPlus } from "react-icons/fa";

export default function Customers() {
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
  >("center");
  const show = (
    position:
      | "center"
      | "top"
      | "bottom"
      | "left"
      | "right"
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right"
  ) => {
    setPosition(position);
    setVisible(true);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <CircleAnimation />
  ) : (
    <div className="flex flex-col md:flex-row min-h-screen bg-blue-100">
      {/* Mobile/Tablet: Show Details button at top and RightSide at bottom */}
      <div className="block md:hidden w-full">
        {/* Button at the top */}
        <div className="p-4 text-center">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow "
            label="Add New Customer"
            icon={<FaPlus className="me-2" />}
            onClick={() => show("top")}
          ></Button>
        </div>

        <CustomDialog
          visible={visible}
          headerchildren={<p className="font-bold p-2">Add New Customer</p>}
          bodychildren={
            <div className="w-full bg-white">
              <RightSide />
            </div>
          }
          footerchildren={
            <div className="inline me-2">
              <Button
                className="bg-amber-300 px-2 py-1 rounded-md "
                label="Close"
                icon="pi pi-check"
                onClick={() => setVisible(false)}
                autoFocus
              />
            </div>
          }
          position={position}
          onHide={() => setVisible(false)}
        />
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-1/4 ">
        <LeftSideMenu />
      </aside>

      {/* Main content for desktop */}
      <main className="w-3/4 p-6 hidden  md:block">
        <RightSide />
      </main>
    </div>
  );
}


import { Dialog } from "primereact/dialog";

interface DialogProps {
  visible: boolean;
  headerchildren: React.ReactNode;
  bodychildren: React.ReactNode;
  footerchildren: React.ReactNode;
  position:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  onHide: () => void;
}

export default function CustomDialog({
  visible,
  onHide,
  headerchildren,
  bodychildren,
  footerchildren,
  position,
}: DialogProps) {
  return (
    <Dialog
      position={position}
      className="bg-white p-5 border-2 shadow-md rounded-md border-success"
      visible={visible}
      modal
      header={headerchildren}
      footer={footerchildren}
      style={{ width: "50rem" }}
      onHide={onHide}
    >
      {bodychildren}
    </Dialog>
  );
}



// import { FaUsers } from "react-icons/fa";
// // import { Link, useParams } from "react-router-dom";
// import customers from "../../../data/customers";
// import { useState } from "react";
// import { Link } from "react-router-dom";

// function LeftSideMenu() {
//   const [search, setSearch] = useState("");
//   // Filter customers by name (case-insensitive)
//   const filteredCustomers = customers.filter((item) =>
//     item.name.toLowerCase().includes(search.toLowerCase())
//   );
//   return (
//     <>
//       <div className="w-full p-4">
//         <h1 className="p-2 font-bold  border-b-2 rounded-md bg-blue-100">
//           <span>
//             <FaUsers className="inline me-2" />
//           </span>
//           Customers
//         </h1>
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search Customers"
//           className="mt-2 w-full p-2 border border-gray-500 rounded"
//         />

//         <ul
//           className="overflow-auto p-4 mt-2 space-y-2"
//           style={{ height: 800 }}
//         >
//           {filteredCustomers.length === 0 ? (
//             <li className="text-center text-red-500">Not found</li>
//           ) : (
//             filteredCustomers.map((item, index) => (
//               <Link
//                 onClick={() => console.log(item.id_card)}
//                 to={`/customers/${item.id_card}`}
//               >
//                 <li
//                   key={index}
//                   className="p-1 mb-1.5 border-1 border-gray-400 rounded-sm text-center bg-blue-100 "
//                 >
//                   {item.name}
//                 </li>
//               </Link>
//             ))
//           )}
//         </ul>
//       </div>
//     </>
//   );
// }

// export default LeftSideMenu;

import { FaUsers } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import customers from "../../../data/customers"; // Assuming this path is correct based on your snippet

function LeftSideMenu() {
  const [search, setSearch] = useState("");
  // Filter customers by name (case-insensitive)
  const filteredCustomers = customers.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="w-full  p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-xl border border-blue-200">
        <h1 className="p-3 mb-4 text-xl font-extrabold text-blue-800 border-b-4 border-blue-300 rounded-md bg-blue-200 flex items-center justify-center">
          <FaUsers className="inline mr-3 text-blue-600 text-2xl" />
          Customers
        </h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Customers..."
          className="mt-4 w-full p-3 border border-blue-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out text-gray-700 placeholder-gray-400"
        />

        <ul
          className="overflow-auto p-4 mt-4 space-y-2 bg-white rounded-lg shadow-inner border border-gray-200"
          style={{ height: 700 }}
        >
          {filteredCustomers.length === 0 ? (
            <li className="text-center text-red-500 font-medium py-4">
              No customers found.
            </li>
          ) : (
            filteredCustomers.map((item, index) => (
              <Link
                key={index} // Use key on the Link component
                onClick={() => console.log(item.id_card)}
                to={`/customers/${item.id_card}`}
                className="block" // Ensure Link takes full width
              >
                <li className="p-3 mb-2 bg-blue-100 border border-blue-300 rounded-md text-center font-semibold text-blue-700 hover:bg-blue-200 hover:border-blue-400 transform hover:scale-105 transition duration-200 ease-in-out shadow-md cursor-pointer">
                  {item.name}
                </li>
              </Link>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

export default LeftSideMenu;



import { FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// Define the Zod schema for form validation
const customerSchema = z.object({
  customerName: z.string().min(1, "Customer Name is required"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  photo: z.any().optional(), // File input, can be refined for file type/size validation
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
});

type CustomerFormData = z.infer<typeof customerSchema>;

function RightSide() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );

  const onSubmit = (data: CustomerFormData) => {
    console.log("Form data submitted:", data);
    setMessage({
      type: "success",
      text: "Customer details submitted successfully!",
    });
    reset(); // Reset form after successful submission
    setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
  };

  return (
    <>
      <div className="p-8 bg-white shadow-2xl rounded-xl w-full  border border-gray-200">
        <h2 className="mb-6 p-4 text-2xl font-extrabold text-blue-800 border-b-4 border-blue-300 rounded-lg bg-blue-100 flex items-center justify-center">
          <FaUser className="inline mr-3 text-blue-600 text-2xl" /> Add New
          Customer
        </h2>

        {message && (
          <div
            className={`p-3 mb-4 rounded-md text-center font-semibold ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 p-4">
          {/* Customer Name and Date of Birth */}
          <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="customerName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Customer Name
              </label>
              <input
                id="customerName"
                type="text"
                placeholder="Enter customer name"
                {...register("customerName")}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out text-gray-800 placeholder-gray-400"
              />
              {errors.customerName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="dateOfBirth"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out text-gray-800"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          </div>

          {/* Email, Phone, Address, City */}
          <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...register("email")}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out text-gray-800 placeholder-gray-400"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Phone
              </label>
              <input
                id="phone"
                type="text"
                placeholder="Enter phone number"
                {...register("phone")}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out text-gray-800 placeholder-gray-400"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                placeholder="Enter address"
                {...register("address")}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out text-gray-800 placeholder-gray-400"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="Enter city"
                {...register("city")}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out text-gray-800 placeholder-gray-400"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="relative">
            <label
              htmlFor="photo"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Photo
            </label>
            <input
              id="photo"
              type="file"
              {...register("photo")}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {typeof errors.photo?.message === "string" && (
              <p className="text-red-500 text-xs mt-1">
                {errors.photo.message}
              </p>
            )}
          </div>

          {/* Gender Selection */}
          <div className="flex items-center gap-6 mt-4">
            <p className="font-bold text-gray-700 text-sm">Gender:</p>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="male"
                {...register("gender")}
                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-800">Male</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="female"
                {...register("gender")}
                className="form-radio h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
              />
              <span className="text-gray-800">Female</span>
            </label>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-right mt-8">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default RightSide;




coming data from apiClient.get(/customers/customers)

sample data:

{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      id: 1
      "name": "",
      "birth_date": null,
      "email": "",
      "phone": "",
      "address": "",
      "city": "",
      "photo": null,
      "gender": null
    },
    ...
  ]
}



end_point to send: apiClient.post(/customers/customers/)


connect the front to backend

use @tanstack/react-query with axios

change the styles as you think beatiful
plus you can change the structure of how to show data, handle will the paginated responses if you wanted you can use the infinite query plus, react-infinite-scroll-component


that's what i want
if you have any question ask me
