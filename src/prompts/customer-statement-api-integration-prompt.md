import { useForm } from "react-hook-form";

import {
  statementFormSchema,
  type StatementFormData,
} from "../../../../schemas/statementFormSchema";
import customerStatement from "../../../../data/customer_statement";
import RouteBox from "../../../../components/RouteBox";
import customers from "../../../../data/customers";
import { useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";

function CustomerStatement() {
  const { id_card } = useParams();
  const customerInfo = customers.find(
    (item) => item.id_card === Number(id_card)
  );

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<StatementFormData>();

  const onSubmit = (formData: any) => {
    const result = statementFormSchema.safeParse(formData);

    if (!result.success) {
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof StatementFormData;
        setError(field, { type: "manual", message: err.message });
      });
      return;
    }
  };
  const routename = [
    { path: "/customers", name: "Customers" },
    {
      path: `/customers/${customerInfo?.id_card}`,
      name: `${customerInfo?.name}`,
    },
    { path: "", name: "Statement" },
  ];
  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />

      <div className="p-12 m-4 shadow rounded-sm bg-white">
        <h2 className="text-xl text-blue-400 font-semibold mb-6 inline-block px-3 py-2 bg-sky-100 rounded-md rounded-e-none shadow border-e-0  border border-gray-200">
          <FaUser className="inline me-2" /> {customerInfo?.name}
        </h2>
        <h2 className="text-xl font-semibold mb-6 inline-block px-2 py-2 bg-sky-100 rounded-md shadow rounded-s-none border-s-0 border border-gray-200">
          Statement
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1  gap-4 p-2"
        >
          {/* for sending customer id  */}
          <input type="hidden" />
          {/* ====================== */}
          <div>
            <input
              className="w-full mt-1  border border-gray-400 rounded-sm px-3 py-2"
              placeholder="Amount"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>
          <div>
            {" "}
            <select
              defaultValue=""
              className="mt-1 w-full border border-gray-400 rounded-sm px-3 py-2"
            >
              <option disabled value="">
                Select Currency
              </option>
              <option value="USD">USD</option>
              <option value="AFG">AFG</option>
            </select>
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <select
              defaultValue=""
              className="mt-1 w-full border border-gray-400 rounded-sm px-3 py-2"
            >
              <option disabled value="">
                Select type
              </option>
              <option value="Cash">Cash</option>
              <option value="Loan">Loan</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>
          <div>
            {" "}
            <select
              defaultValue="NO"
              className="mt-1 w-full border border-gray-400 rounded-sm px-3 py-2"
            >
              <option disabled value="">
                Select opening
              </option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.opening && (
              <p className="text-red-500 text-sm">{errors.opening.message}</p>
            )}
          </div>
          <div>
            {" "}
            <input
              className="mt-1 w-full  border border-gray-400 rounded-sm px-3 py-2"
              placeholder="add description here!"
            />
          </div>

          <button
            onClick={() => {
              console.log(customerInfo?.name);
            }}
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="overflow-auto w-96 p-3 md:w-full">
        <table className="w-full  text-center ">
          <thead className="bg-green-300">
            <tr>
              <th className="ps-2">ID</th>
              <th className="ps-2">Amount</th>
              <th className="ps-2">Type</th>
              <th className="ps-2">Description</th>
              <th className="ps-2">Opening</th>
              <th className="ps-2">Session</th>
              <th className="ps-2">Added By</th>
              <th className="ps-2">Date</th>
              <th className="px-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {customerStatement.map((row) => (
              <tr
                key={row.customer_id_card}
                className="border-t-2 border-gray-300 "
              >
                <td className="text-blue-600 font-medium">
                  {row.customer_id_card}
                </td>
                <td>{row.amount} AFG</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      row.type === "cash" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {row.type === "cash" ? "Cash Received" : "Loan"}
                  </span>
                </td>
                <td>
                  {row.description || <span className="text-blue-400">✎</span>}
                </td>
                <td>{row.opening}</td>
                <td>{row.session}</td>
                <td>{row.added_by}</td>
                <td>{row.date}</td>

                <td>
                  <button
                    onClick={() => console.log("deleted")}
                    className="text-red-500 hover:underline"
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
            {customerStatement.length === 0 && (
              <tr>
                <td colSpan={10} className="text-gray-400 py-4">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CustomerStatement;


for currencies use: useCurrencyStore(s => s.currencies) from /stores/useCurrencyStore.ts
which each currency has id and code you can use
remove openning field

add resources field which is a dropdown that shows from which cash drawers should be done this payment or receive.
the cash drawers list comes from useCashDrawerStore(s => s.cashDrawers)
which also has id and name


coming data from apiClient.get(/customers/customer-statements/)

[
    {
        "id": 4,
        "customer": 4,
        "amount": "100.00",
        "currency": 1,
        "statement_type": "cash",
        "statement_date": "2025-07-19T16:39:02.261853+04:30",
        "sale_receipt_id": "202345678987",
        "cash_drawer": 1,
        "notes": "For Dept",
        "created_by_name": "Suhail Sirat",
    },
    ...
]


expecting data

{
    "customer": number,
    "amount": number,
    "currency": number,
    "statement_type": "cash" | "loan",
    "cash_drawer": number,
    "notes": string
}

connect the front to backend

use @tanstack/react-query with axios

wrap amounts with currency formatPriceWithCurrency comeing from useCurrencyStore(s => s.formatPriceWithCurrency)

wrap dates with formatLocalDateTime


that's what i want
if you have any question ask me


hey bro i need you to change the styles and make it as beautiful as possible

and fit to coming data design the form beautiful and for showing data you can use a table or what you think is better

also i made a mistake the url is /customers/{id}/customer-statements/

coming and going vai apiClient.get and post