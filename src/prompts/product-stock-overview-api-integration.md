import { useLocationStore } from "../../../../stores";

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useDirection } from "../../../../hooks/useDirection";

interface Props {
  productId: number;
}

function StockOverview({ productId }: Props) {
  const getStores = useLocationStore((s) => s.getStores);
  const stores = getStores ? getStores() : []; // Ensure getStores is a function
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .bg-blue-50 { background-color: #ebf8ff !important; }
        .bg-green-50 { background-color: #f0fff4 !important; }
      }
    `,
  });
  const direction = useDirection();
  // Static data for Product History table
  const productHistoryData = {
    Available: 200,
    Purchase: 500,
    Sold: 300,
    Returned: 0,
  };

  // Static data for Purchase List table (repeated for demonstration)
  const purchaseListData = [
    {
      quantity: 200,
      realCost: 100,
      salePrice: 150,
      vendor: "Alkozi",
      date: "10/03/2025",
      addedBy: "Musawer",
    },
    {
      quantity: 150,
      realCost: 80,
      salePrice: 120,
      vendor: "Balkhi Traders",
      date: "05/02/2025",
      addedBy: "Ahmad",
    },
    {
      quantity: 50,
      realCost: 25,
      salePrice: 40,
      vendor: "Karimi Supplies",
      date: "20/01/2025",
      addedBy: "Fatima",
    },
  ];

  return (
    <div className="  ">
      {/* Stock Selection Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
        <label
          htmlFor="stock-select"
          className="block text-gray-700 text-lg font-semibold mb-3"
        >
          Select Stock to see Overview
        </label>
        <select
          id="stock-select"
          className="w-full block p-3 border border-gray-300 bg-white rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all duration-200 ease-in-out text-gray-800
                       hover:border-blue-400"
        >
          {stores.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product History and Purchase List Section */}
      <div
        dir={direction}
        ref={contentRef}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 print:shadow-none print:rounded-none"
      >
        {/* Product History Card */}

        <div className="mb-8 relative">
          <h1 className="text-center text-gray-800 text-md md:text-3xl font-extrabold p-2 mb-4">
            Product History in "Stock"
          </h1>
          {/* PDF Button */}
          <button
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow print:hidden"
            title="Download PDF"
            onClick={reactToPrintFn}
          >
            PDF
          </button>
          <div className="bg-blue-50 rounded-lg shadow-inner  mx-auto">
            <table className="w-full text-gray-800 table-auto">
              <tbody>
                {Object.entries(productHistoryData).map(([key, value]) => (
                  <tr
                    key={key}
                    className="border-b border-blue-100 last:border-b-0"
                  >
                    <th className="p-3 text-left font-medium bg-blue-50 w-1/2 rounded-tl-lg">
                      {key}
                    </th>
                    <td className="p-3 text-right font-semibold bg-green-50 rounded-tr-lg">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchase List Card */}
        <div>
          <h1 className="p-2 text-3xl font-bold text-center mb-6 text-gray-800">
            Purchase List of "Product"
          </h1>
          <div className="overflow-auto w-96 print:w-full  md:w-full shadow-md rounded-lg ">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-blue-100">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-tl-lg">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Real Cost
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Sale Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Vendor
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 rounded-tr-lg">
                    Added By
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseListData.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4">{item.realCost}</td>
                    <td className="px-6 py-4">{item.salePrice}</td>
                    <td className="px-6 py-4">{item.vendor}</td>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4">{item.addedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockOverview;


endPoint: apiClient.get(/catalog/products/{productId}/stats/?location_id=1)

data:

{
    "name": "Coconut Water",
    "available": 29.0,
    "purchased": 30.0,
    "sold": 1.0,
    "returned": 0,
    "purchases": [
        {
            "purchase_id": 56,
            "cost_price": 2.0,
            "cost_currency": 1,
            "purchas_date": "2025-07-11T18:45:04.233774Z",
            "quantity": 30.0,
            "sale_price": 3.5,
            "sale_currency": 1,
            "vendor": "Alcozay",
            "added_by": "Suhail Sirat"
        }
    ]
}



hey bro

connect my fron to backend

use useCurrencyStore(s =>s.formatPriceWithCurrency)
formatPriceWithCurrency(amount, currencyId)
for sale and cost prices

use formatLocalDateTime() coming from /utils/formatLocalDateTime
for date

purchas list of "product name" put the name there. 

apiClient is an axios instance and is pre configured coming from /lib/api

use react query from @tanstack/react-query

if you have any other question ask, before you proceed