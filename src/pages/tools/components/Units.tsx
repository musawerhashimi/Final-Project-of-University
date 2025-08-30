﻿import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Ruler, Tag, XCircle } from "lucide-react";
import { Button } from "primereact/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import RouteBox from "../../../components/RouteBox";
import type { Unit } from "../../../entities/Unit";
import { unitSchema, type UnitFormData } from "../../../schemas/unitValidation";
import { useUnitStore } from "../../../stores";
import { useTranslation } from "react-i18next";

export default function Units() {
  const { t } = useTranslation();
  const routename = [
    { path: "/tools", name: t("Tools") },
    { path: "", name: t("Units") },
  ];

  const { units, createUnit, updateUnit, loading } = useUnitStore();

  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
  });

  const onSubmit = async (data: UnitFormData) => {
    if (editingUnitId !== null) {
      updateUnit(editingUnitId, data);
      setEditingUnitId(null);
    } else {
      createUnit(data);
    }
    reset();
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnitId(unit.id);
    setValue("name", unit.name);
    setValue("abbreviation", unit.abbreviation);
  };

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />

      <div className="mt-[-15px] bg-gradient-to-br from-blue-100 to-purple-100 p-4 font-inter flex flex-col items-center">
        <div className="w-full bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {editingUnitId ? t("Edit Unit") : t("Add New Unit")}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Ruler className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
                {t("Unit Name")}
              </label>
              <input
                {...register("name")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t("e.g., Kilogram, Liter, Piece")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Tag className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
                {t("Abbreviation")}
              </label>
              <input
                {...register("abbreviation")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., kg, L, pc"
              />
              {errors.abbreviation && (
                <p className="text-red-500 text-sm">
                  {errors.abbreviation.message}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <div className="flex-1">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  label={editingUnitId ? t("Update Unit") : t("Add New Unit")}
                />
              </div>

              {editingUnitId && (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setEditingUnitId(null);
                  }}
                  className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <XCircle className="inline-block mr-2 h-5 w-5" />{" "}
                  {t("Cancel Edit")}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="w-full bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t("Available Units")}
          </h2>
          {units.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {t("No units added yet.")}
            </p>
          ) : (
            <div className="space-y-4">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm border-1 border-gray-200"
                >
                  <div className="flex items-center flex-grow w-full">
                    <div className="flex-shrink-0 mr-4">
                      <span className="flex items-center justify-center h-12 w-12 rounded-full bg-sky-200 text-red-500 text-2xl font-bold">
                        {unit.abbreviation}
                      </span>
                    </div>
                    <div className="font-semibold text-lg text-gray-700">
                      {unit.name}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => handleEdit(unit)}
                      className="p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      title={t("Edit Unit")}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
