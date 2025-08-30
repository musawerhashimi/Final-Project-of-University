// import { Dialog } from "primereact/dialog";
// import Input from "./Input";
// import { useAddPurchaseStore, useCurrencyStore } from "../stores";
// import { usePurchaseForm } from "../hooks/usePurchaseForm";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   paymentFormSchema,
//   type PaymentFormData,
// } from "../schemas/paymentFormSchema";
// import { useCashDrawerStore } from "../stores/useCashDrawerStore";
// import type { PaymentMethodType } from "../stores/useAddPurchaseStore";

// interface Props {
//   visible: boolean;
//   onHide: () => void;
//   onSubmit: () => void;
// }

// function PaymentModal({ visible, onHide, onSubmit }: Props) {
//   const purchaseItems = useAddPurchaseStore((s) => s.items);
//   const c = useAddPurchaseStore((s) => s.currency);
//   const getItemCount = useAddPurchaseStore((s) => s.getItemCount);
//   const setNotes = useAddPurchaseStore((s) => s.setNotes);
//   const setPaymentMethod = useAddPurchaseStore((s) => s.setPaymentMethod);
//   const currency = useCurrencyStore((s) => s.getCurrency)(c);
//   const currencies = useCurrencyStore((s) => s.currencies);
//   const baseCurrencyId = useCurrencyStore((s) => s.getBaseCurrency)().id;

//   const getTotalPurchaseAmount = useAddPurchaseStore(
//     (s) => s.getTotalPurchaseAmount
//   );
//   const formatPriceWithCurrency = useCurrencyStore(
//     (s) => s.formatPriceWithCurrency
//   );
//   const { calculateVendorBalance } = usePurchaseForm();
//   const vendorBalance = calculateVendorBalance();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<PaymentFormData>({
//     resolver: zodResolver(paymentFormSchema),
//     defaultValues: {
//       paymentMethod: "loan",
//     },
//   });
//   const paymentMethod = watch("paymentMethod");
//   const cashDrawers = useCashDrawerStore((s) => s.cashDrawers);
//   const onValid = (data: PaymentFormData) => {
//     let method: PaymentMethodType;
//     if (data.paymentMethod == "cash") {
//       method = {
//         cash_drawer: data.paymentSource!,
//         currency: data.paymentCurrency!,
//       };
//     } else {
//       method = data.paymentMethod;
//     }
//     setPaymentMethod(method);
//     onSubmit();
//     onHide();
//   };
//   return (
//     <Dialog
//       onHide={onHide}
//       visible={visible}
//       className="bg-base w-[50rem] backdrop-blur-md rounded-md p-2 pt-3 pr-3 shadow-lg"
//       modal
//       header={
//         <div className="p-2 border-b border-border-color">
//           <h1 style={{ fontSize: 26 }} className="text-base-front">
//             Confirm Purchase
//           </h1>
//         </div>
//       }
//       footer={
//         <>
//           <hr className="text-border-color" />
//           <div className="m-1 mt-3 flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={() => onHide()}
//               className="px-4 py-2 rounded-lg font-medium transition-all
//             duration-200 text-white shadow-md bg-error hover:bg-error-hover"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit(onValid)}
//               className="px-4 py-2 rounded-lg font-medium transition-all
//             duration-200 text-white shadow-md bg-success-mock
//             hover:bg-success-mock/90"
//             >
//               Order Purchase
//             </button>
//           </div>
//         </>
//       }
//     >
//       <div className="p-2 pt-5">
//         <br /> <br />
//         <br />
//         <table className="text-secondary-front w-full text-start">
//           <thead>
//             <tr className="border-b-2 border-indigo font-bold">
//               <th className="text-start px-2 pb-2">Product Name</th>
//               <th className="text-start px-2 pb-2">Cost Price</th>
//               <th className="text-start px-2 pb-2">Quantity</th>
//               <th className="text-start px-2 pb-2">Subtotal</th>
//             </tr>
//           </thead>
//           <tbody>
//             {purchaseItems.map((item, idx) => (
//               <tr key={idx} className="border-b border-border-color">
//                 <td className="p-1 px-2">{item.product_data.name}</td>
//                 {/* <span>{formatPriceWithCurrency(item.product_data.variants[0].cost_price, item.product_data.variants[0].cost_currency_id)}</span> */}
//                 <td>
//                   {formatPriceWithCurrency(
//                     item.unit_cost,
//                     item.product_data.variants[0].cost_currency_id
//                   )}
//                 </td>
//                 <td>{item.quantity}</td>
//                 <td>
//                   {formatPriceWithCurrency(
//                     item.unit_cost * item.quantity,
//                     item.product_data.variants[0].cost_currency_id
//                   )}
//                 </td>
//               </tr>
//             ))}
//             <tr className="font-bold">
//               <td className="p-1 px-2 pt-2 font-bold">Total</td>
//               {/* <span>{formatPriceWithCurrency(item.product_data.variants[0].cost_price, item.product_data.variants[0].cost_currency_id)}</span> */}
//               <td></td>
//               <td>{getItemCount()}</td>
//               <td>
//                 {formatPriceWithCurrency(getTotalPurchaseAmount(), currency.id)}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//         {/* Payment Method */}
//         <div className="border-t border-[var(--color-border-mock)] pt-6">
//           <h3 className="text-lg font-semibold text-[var(--color-text-primary-mock)] mb-4">
//             Payment Method
//           </h3>
//           <div className="flex gap-2 mb-4">
//             {(
//               [
//                 { id: "loan", label: "Loan" },
//                 { id: "cash", label: "Cash/Credit Card" },
//                 { id: "free", label: "Free" },
//               ] as const
//             ).map((method) => (
//               <button
//                 key={method.id}
//                 type="button"
//                 onClick={() => setValue("paymentMethod", method.id)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                   paymentMethod === method.id
//                     ? "bg-[var(--color-primary-mock)] text-white shadow-md"
//                     : "bg-[var(--color-surface-mock)] text-[var(--color-text-primary-mock)] hover:bg-[var(--color-surface-hover-mock)]"
//                 }`}
//               >
//                 {method.label}
//               </button>
//             ))}
//           </div>

//           {paymentMethod === "loan" && (
//             <div className="bg-[var(--color-surface-mock)] border border-[var(--color-border-mock)] rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
//               <h4 className="font-medium text-[var(--color-text-primary-mock)] mb-3">
//                 Vendor Balance
//               </h4>
//               <div className="grid grid-cols-3 gap-4 text-sm">
//                 <div>
//                   <span className="text-[var(--color-text-secondary-mock)]">
//                     Current Balance:
//                   </span>
//                   <p className="font-semibold text-[var(--color-text-primary-mock)]">
//                     {formatPriceWithCurrency(
//                       parseFloat(vendorBalance?.currentBalance || "0"),
//                       baseCurrencyId
//                     )}
//                   </p>
//                 </div>
//                 <div>
//                   <span className="text-[var(--color-text-secondary-mock)]">
//                     Purchase Amount:
//                   </span>
//                   <p className="font-semibold text-[var(--color-primary-mock)]">
//                     {formatPriceWithCurrency(
//                       vendorBalance?.purchaseAmount || 0,
//                       baseCurrencyId
//                     )}
//                   </p>
//                 </div>
//                 <div>
//                   <span className="text-[var(--color-text-secondary-mock)]">
//                     New Balance:
//                   </span>
//                   <p className="font-semibold text-[var(--color-success-mock)]">
//                     {formatPriceWithCurrency(
//                       vendorBalance?.newBalance || 0,
//                       baseCurrencyId
//                     )}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {paymentMethod === "cash" && (
//             <div className="bg-[var(--color-surface-mock)] border border-[var(--color-border-mock)] rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
//                     Payment Source
//                   </label>
//                   <select
//                     {...register("paymentSource", { valueAsNumber: true })}
//                     className="w-full px-3 py-2 border border-[var(--color-border-mock)] rounded-lg bg-[var(--color-background-mock)] text-[var(--color-text-primary-mock)] focus:outline-none focus:border-[var(--color-primary-mock)] focus:shadow-sm transition-all duration-200"
//                   >
//                     <option value="">Select source</option>
//                     {cashDrawers.map((drawer) => (
//                       <option key={drawer.id} value={drawer.id}>
//                         {drawer.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.paymentSource && (
//                     <span className="text-red-500 text-sm">
//                       {errors.paymentSource.message}
//                     </span>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
//                     Payment Currency
//                   </label>
//                   <select
//                     {...register("paymentCurrency", { valueAsNumber: true })}
//                     className="w-full px-3 py-2 border border-[var(--color-border-mock)] rounded-lg bg-[var(--color-background-mock)] text-[var(--color-text-primary-mock)] focus:outline-none focus:border-[var(--color-primary-mock)] focus:shadow-sm transition-all duration-200"
//                   >
//                     {currencies.map((currency) => (
//                       <option key={currency.id} value={currency.id}>
//                         {currency.code}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.paymentCurrency && (
//                     <span className="text-red-500 text-sm">
//                       {errors.paymentCurrency.message}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//         <br />
//         <Input
//           type="textarea"
//           onChange={(value) => setNotes(value)}
//           placeholder="Notes"
//           placeholderBg="bg-base"
//         />
//         <br />
//       </div>
//     </Dialog>
//   );
// }

// export default PaymentModal;

import { Dialog } from "primereact/dialog";
import Input from "./Input";
import { useAddPurchaseStore, useCurrencyStore } from "../stores";
import { usePurchaseForm } from "../hooks/usePurchaseForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paymentFormSchema,
  type PaymentFormData,
} from "../schemas/paymentFormSchema";
import { useCashDrawerStore } from "../stores/useCashDrawerStore";
import type { PaymentMethodType } from "../stores/useAddPurchaseStore";
import { useTranslation } from "react-i18next";

interface Props {
  visible: boolean;
  onHide: () => void;
  onSubmit: () => void;
}

function PaymentModal({ visible, onHide, onSubmit }: Props) {
  const purchaseItems = useAddPurchaseStore((s) => s.items);
  const c = useAddPurchaseStore((s) => s.currency);
  const getItemCount = useAddPurchaseStore((s) => s.getItemCount);
  const setNotes = useAddPurchaseStore((s) => s.setNotes);
  const setPaymentMethod = useAddPurchaseStore((s) => s.setPaymentMethod);
  const currency = useCurrencyStore((s) => s.getCurrency)(c);
  const currencies = useCurrencyStore((s) => s.currencies);
  const baseCurrencyId = useCurrencyStore((s) => s.getBaseCurrency)().id;

  const getTotalPurchaseAmount = useAddPurchaseStore(
    (s) => s.getTotalPurchaseAmount
  );
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const { calculateVendorBalance } = usePurchaseForm();
  const vendorBalance = calculateVendorBalance();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "loan",
    },
  });
  const paymentMethod = watch("paymentMethod");
  const cashDrawers = useCashDrawerStore((s) => s.cashDrawers);
  const { t } = useTranslation();

  const onValid = (data: PaymentFormData) => {
    let method: PaymentMethodType;
    if (data.paymentMethod == "cash") {
      method = {
        cash_drawer: data.paymentSource!,
        currency: data.paymentCurrency!,
      };
    } else {
      method = data.paymentMethod;
    }
    setPaymentMethod(method);
    onSubmit();
    onHide();
  };

  return (
    <Dialog
      onHide={onHide}
      visible={visible}
      className="bg-gray-100 dark:bg-gray-800 w-[50rem] backdrop-blur-md rounded-2xl p-6 shadow-2xl"
      modal
      header={
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("Confirm Purchase")}
          </h1>
        </div>
      }
      footer={
        <>
          <hr className="text-gray-300 dark:text-gray-700" />
          <div className="mt-4 flex justify-end space-x-3 p-4">
            <button
              type="button"
              onClick={() => onHide()}
              className="px-6 py-2 rounded-xl font-semibold transition-all duration-300 text-white shadow-md bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit(onValid)}
              className="px-6 py-2 rounded-xl font-semibold transition-all duration-300 text-white shadow-md bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {t("Order Purchase")}
            </button>
          </div>
        </>
      }
    >
      <div className="p-4">
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="px-4 py-3 font-bold"> {t("Product Name")}</th>
                <th className="px-4 py-3 font-bold">{t("Cost Price")}</th>
                <th className="px-4 py-3 font-bold">{t("Quantity")}</th>
                <th className="px-4 py-3 font-bold text-right">
                  {t("Subtotal")}
                </th>
              </tr>
            </thead>
            <tbody>
              {purchaseItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <td className="p-4">{item.product_data.name}</td>
                  <td className="p-4">
                    {formatPriceWithCurrency(
                      item.unit_cost,
                      item.product_data.variants[0].cost_currency_id
                    )}
                  </td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4 text-right">
                    {formatPriceWithCurrency(
                      item.unit_cost * item.quantity,
                      item.product_data.variants[0].cost_currency_id
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-200 dark:bg-gray-700 font-bold text-gray-800 dark:text-gray-200">
                <td className="p-4 font-bold">Total</td>
                <td className="p-4"></td>
                <td className="p-4">{getItemCount()}</td>
                <td className="p-4 text-right">
                  {formatPriceWithCurrency(
                    getTotalPurchaseAmount(),
                    currency.id
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-8 border-t border-gray-300 dark:border-gray-700 pt-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t("Payment Method")}
          </h3>
          <div className="flex gap-4 mb-6">
            {(
              [
                { id: "loan", label: t("Loan") },
                { id: "cash", label: t("Cash") },
                { id: "free", label: t("Free") },
              ] as const
            ).map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setValue("paymentMethod", method.id)}
                // Button styles are more consistent and visually appealing.
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-sm
                  ${
                    paymentMethod === method.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
              >
                {method.label}
              </button>
            ))}
          </div>

          {paymentMethod === "loan" && (
            <div className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-6 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4">
                {t("Vendor Balance")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="block text-gray-600 dark:text-gray-400 font-medium">
                    {t("Current Balance")}
                  </span>
                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatPriceWithCurrency(
                      parseFloat(vendorBalance?.currentBalance || "0"),
                      baseCurrencyId
                    )}
                  </p>
                </div>
                <div>
                  <span className="block text-gray-600 dark:text-gray-400 font-medium">
                    {t("Purchase Amount")}
                  </span>
                  <p className="mt-1 text-lg font-bold text-indigo-600">
                    {formatPriceWithCurrency(
                      vendorBalance?.purchaseAmount || 0,
                      baseCurrencyId
                    )}
                  </p>
                </div>
                <div>
                  <span className="block text-gray-600 dark:text-gray-400 font-medium">
                    {t("New Balance")}
                  </span>
                  <p className="mt-1 text-lg font-bold text-emerald-600">
                    {formatPriceWithCurrency(
                      vendorBalance?.newBalance || 0,
                      baseCurrencyId
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "cash" && (
            <div className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-6 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {t("Payment Source")}
                  </label>
                  <select
                    {...register("paymentSource", { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  >
                    <option value="">{t("Select source")}</option>
                    {cashDrawers.map((drawer) => (
                      <option key={drawer.id} value={drawer.id}>
                        {drawer.name}
                      </option>
                    ))}
                  </select>
                  {errors.paymentSource && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.paymentSource.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {t("Payment Currency")}
                  </label>
                  <select
                    {...register("paymentCurrency", { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.code}
                      </option>
                    ))}
                  </select>
                  {errors.paymentCurrency && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.paymentCurrency.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Input
            type="textarea"
            onChange={(value) => setNotes(value)}
            placeholder="Notes"
            placeholderBg="bg-gray-200 dark:bg-gray-700"
          />
        </div>
      </div>
    </Dialog>
  );
}

export default PaymentModal;
