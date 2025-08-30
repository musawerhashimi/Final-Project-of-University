import { Button } from "primereact/button";
import { useState } from "react";
import { FaInfo, FaMoneyBill, FaPlus, FaStore } from "react-icons/fa";
import CustomDialog from "../../../components/CustomDialog";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import RouteBox from "../../../components/RouteBox";

import { useCurrencyStore, useLocationStore } from "../../../stores";
import { useCashDrawerStore } from "../../../stores/useCashDrawerStore";
import { useForm } from "react-hook-form";
import {
  resourceSchema,
  type ResourceFormData,
} from "../../../schemas/resourceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

function Resources() {
  const { t } = useTranslation();
  const routename = [
    { path: "/finance", name: t("Finance") },
    { path: "", name: t("Resources") },
  ];
  const getCurrency = useCurrencyStore((s) => s.getCurrency);
  const resources = useCashDrawerStore((s) => s.cashDrawers);
  const [visible, setVisible] = useState<boolean>(false);
  const show = () => {
    setVisible(true);
  };
  const getStores = useLocationStore((s) => s.getStores);
  const createCashDrawer = useCashDrawerStore((s) => s.createCashDrawer);
  const stores = getStores();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const CustomTooltip = (props: {
    active?: boolean;
    payload?: { value: string }[];
    label?: string;
  }) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-gray-800 text-white rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{`${label}: ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const AddResource = (data: ResourceFormData) => {
    const payload = {
      name: data.name,
      description: data.description,
      location: data.store,
    };
    createCashDrawer(payload)
      .then(() => {
        setVisible(false);
        toast.success(t("Resource Added Successfully!"));
        reset();
      })
      .catch(() => {
        toast.error(t("Failed to Add Resource"));
      });
  };

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />

      <div className=" flex justify-center mt-6 ">
        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded shadow"
          label={t("Add New Resource")}
          icon={
            <FaPlus
              className="me-2
              "
            />
          }
          onClick={show}
        ></Button>
        <CustomDialog
          position="top"
          visible={visible}
          onHide={() => setVisible(false)}
          headerchildren={
            <>
              <p className="font-bold p-2">{t("Add New Resource")}</p>
            </>
          }
          bodychildren={
            <div className="mt-5 p-1">
              <form onSubmit={handleSubmit(AddResource)}>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaMoneyBill className="inline-block mr-1 h-4 w-4 text-gray-500" />
                  {t("Resource Name")}
                </label>
                <input
                  id="name"
                  {...register("name")}
                  type="text"
                  placeholder="e.g., Cash, Bank"
                  className="block w-full input border p-2 rounded mb-3"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaInfo className="inline-block mr-1 h-4 w-4 text-gray-500" />
                  {t("Description")}
                </label>
                <input
                  id="description"
                  type="text"
                  {...register("description")}
                  placeholder="e.g., Cash Drawer for Center shope"
                  className="block w-full input border p-2 rounded mb-3"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
                <div className="relative">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <FaStore className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
                    {t("Store")}
                  </label>
                  <select
                    id="location"
                    {...register("store", { valueAsNumber: true })}
                    className="w-full border border-gray-300 p-3 rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 pr-10 bg-white"
                  >
                    <option value="">{t("Select Store")}</option>
                    {stores.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                  {errors.store && (
                    <p className="text-red-500 text-sm">
                      {errors.store.message}
                    </p>
                  )}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="inline me-2">
                    <Button
                      className="bg-red-500 px-2 py-1 rounded-md text-white hover:bg-red-800"
                      label={t("Close")}
                      type="button"
                      icon="pi pi-check"
                      onClick={() => setVisible(false)}
                      autoFocus
                    />
                  </div>
                  <div className="inline">
                    <Button
                      className="bg-green-500 px-2 py-1 rounded-md text-white hover:bg-green-800"
                      type="submit"
                      label={t("Submit")}
                      icon="pi pi-check"
                      autoFocus
                    />
                  </div>
                </div>
              </form>
            </div>
          }
          footerchildren={undefined}
        />
      </div>
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="my-6  p-4 sm:p-6 lg:p-8 flex items-center justify-center font-inter "
        >
          <div className="w-full  bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header Section */}

            <div className="bg-gradient-to-r from-green-500 to-blue-700 p-6 text-white text-center rounded-t-xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {resource.name} {t("Overview")}
              </h1>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-8  bg-blue-200">
              {/* USD Amount and Graph */}

              <div className="bg-blue-50 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                {resource.amounts.map((amount) => (
                  <div
                    key={amount.id}
                    className="flex-shrink-0 border border-gray-200 bg-sky-100 p-3 rounded-md  text-center md:text-left"
                  >
                    <h2 className="text-xl font-bold text-gray-500  mb-2">
                      {t("Amount")} {"  "}
                      <span className="text-gray-600">
                        {getCurrency(amount.currency).code}
                      </span>
                    </h2>
                    <p className="text-2xl font-bold text-blue-500">
                      {amount.value}
                    </p>
                  </div>
                ))}
                <div className="w-full md:w-2/3 h-48 md:h-56 bg-sky-100 rounded-lg shadow-inner p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={resource.amounts.map((n) => ({
                        name: getCurrency(n.currency).code,
                        value: parseFloat(n.value),
                      }))}
                      margin={{ top: 10, right: 10, left: 20, bottom: 10 }}
                    >
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        className="text-sm text-gray-600"
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        className="text-sm text-gray-600"
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(0,0,0,0.1)" }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#4F46E5"
                        barSize={50}
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Resources;
