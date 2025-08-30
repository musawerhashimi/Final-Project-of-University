import { Barcode, Eye, EyeOff, Plus } from "lucide-react";
import React from "react";
import { Controller } from "react-hook-form";
import FilterInput from "../../components/FilterInput";
import { usePurchaseForm } from "../../hooks/usePurchaseForm";
import RightSide from "./components/RightSide";
import PaymentModal from "../../components/PaymentModal";
import ProductFilterInput from "./components/ProductFilterInput";
import { toast } from "sonner";
import { extractAxiosError } from "../../utils/extractError";
import { useTranslation } from "react-i18next";
import RouteBox from "../../components/RouteBox";

function AddPurchase() {
  const {
    form,
    handleSubmit,
    togglePaymentModal,

    uiState,
    toggleAdvanced,
    setUIState,

    departments,
    availableCategories,
    units,
    currencies,

    purchaseItems,

    submitError,

    // Store actions
    removeItem,
    editItem,
    setVendor,

    addDepartment,
    addCategory,
    // Product handling
    loadProducts,
    selectExistingProduct,
    // clearExistingProduct,

    // Barcode handling
    generateBarcode,
    checkBarcodeUniqueness,

    // Final submission
    handlePurchaseSubmit,

    // Computed values
    selectedDepartment,
    selectedCategory,
    selectedVendor,
  } = usePurchaseForm();
  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  // Handle barcode change with debounce
  const handleBarcodeChange = React.useCallback(
    (barcode: string) => {
      setValue("barcode", barcode);
      const timeoutId = setTimeout(() => {
        checkBarcodeUniqueness(barcode);
      }, 500);
      return () => clearTimeout(timeoutId);
    },
    [setValue, checkBarcodeUniqueness]
  );

  // Handle product search
  const handleProductSearch = React.useCallback(
    (searchTerm: string) => {
      loadProducts(searchTerm);
    },
    [loadProducts]
  );

  // Handle final purchase submission
  const onFinalSubmit = async () => {
    try {
      await handlePurchaseSubmit();
      toast.success("Purchase submitted successfully!");
    } catch (error) {
      const errorMessage = extractAxiosError(error, "Failed to Purchase Items");
      toast.error(errorMessage);
    }
  };
  const { t } = useTranslation();
  const route = [{ path: "", name: t("Add Purchase") }];
  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <div className="bg-add-purchase-bg backdrop-blur-sm flex flex-col h-dvh mt-[-15px]">
        {/* Header */}
        <div className=" flex items-center justify-between  border-b border-[var(--color-border-add-purchase)]">
          <h2 className="inline p-2  ms-4 text-2xl font-bold text-[var(--color-text-primary-mock)]">
            {t("Add Product")}
          </h2>
        </div>

        <div className="mb-1">
          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {submitError}
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3">
            <div className=" p-3 rounded-sm shadow-md bg-add-purchase-form">
              <form className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
                    {t("Product Name")}
                  </label>
                  <div className="mb-4">
                    <Controller
                      control={form.control}
                      name="name"
                      render={({ field: { onChange, value } }) => (
                        <ProductFilterInput
                          value={value}
                          placeholder={t("Enter or select product name")}
                          onChangeInput={(value) => {
                            setUIState((prev) => ({
                              ...prev,
                              isExistingProduct: false,
                              selectedProduct: null,
                              isCheckingBarcode: false,
                              isGeneratingBarcode: false,
                              barcodeIsUnique: null,
                              barcodeError: null,
                            }));
                            form.setValue("barcode", "");
                            onChange(value);
                            const purchaseItem = purchaseItems.find(
                              (p) => p.product_data.name == value
                            );
                            if (!purchaseItem) {
                              handleProductSearch(value);
                            }
                          }}
                          editItem={editItem}
                          items={uiState.products}
                          onSelectItem={selectExistingProduct}
                        />
                      )}
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Barcode */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
                    {t("Barcode")}
                  </label>
                  <div className="flex gap-">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        {...register("barcode")}
                        onChange={(e) => handleBarcodeChange(e.target.value)}
                        disabled={uiState.isExistingProduct}
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                          uiState.isExistingProduct &&
                          "bg-surface-mock opacity-50 cursor-not-allowed"
                        } border-border-add-purchase text-[var(--color-text-primary-mock)] placeholder-[var(--color-text-muted-mock)] focus:outline-none focus:border-[var(--color-primary-mock)] focus:shadow-sm`}
                        placeholder="Enter barcode"
                      />
                      {uiState.isCheckingBarcode && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--color-primary-mock)] border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={generateBarcode}
                      disabled={
                        uiState.isExistingProduct || uiState.isGeneratingBarcode
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        uiState.isExistingProduct
                          ? "bg-[var(--color-surface-mock)] text-[var(--color-text-muted-mock)] cursor-not-allowed"
                          : "bg-[var(--color-primary-mock)] hover:bg-[var(--color-primary-hover-mock)] text-white hover:shadow-md"
                      }`}
                    >
                      <Barcode className="w-4 h-4" />
                      {uiState.isGeneratingBarcode
                        ? t("Generating...")
                        : t("Generate")}
                    </button>
                  </div>
                  {/* Barcode Status */}
                  {uiState.isCheckingBarcode && (
                    <div className="text-sm text-blue-600 mt-1">
                      {t("Checking barcode...")}
                    </div>
                  )}
                  {uiState.barcodeIsUnique === true && (
                    <div className="text-sm text-green-600 mt-1">
                      {t("✓ Barcode is unique")}
                    </div>
                  )}
                  {uiState.barcodeError && (
                    <div className="text-sm text-red-600 mt-1">
                      {uiState.barcodeError}
                    </div>
                  )}
                  {!(
                    uiState.barcodeError ||
                    uiState.barcodeIsUnique ||
                    uiState.isCheckingBarcode
                  ) &&
                    errors.barcode && (
                      <span className="text-red-500 text-sm">
                        {errors.barcode.message}
                      </span>
                    )}
                </div>

                {/* Department & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
                      {t("Department")}
                    </label>

                    <Controller
                      control={form.control}
                      name="departmentId"
                      render={({ field: { onChange } }) => (
                        <FilterInput
                          onChange={(value) => {
                            onChange(value);
                          }}
                          value={selectedDepartment?.name || ""}
                          options={departments.map((d) => ({
                            key: d.id,
                            value: d.name,
                          }))}
                          placeholder={t("Select department")}
                          onAdd={addDepartment}
                          disabled={uiState.isExistingProduct}
                        />
                      )}
                    />
                    {errors.departmentId && (
                      <span className="text-red-500 text-sm">
                        {errors.departmentId.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
                      {t("Category")}
                    </label>
                    <Controller
                      control={form.control}
                      name="categoryId"
                      render={({ field: { onChange } }) => (
                        <FilterInput
                          onChange={(value) => {
                            onChange(value);
                          }}
                          value={selectedCategory?.name || ""}
                          options={availableCategories.map((c) => ({
                            key: c.id,
                            value: c.name,
                          }))}
                          placeholder={t("Select Category")}
                          onAdd={addCategory}
                          disabled={uiState.isExistingProduct}
                        />
                      )}
                    />
                    {errors.categoryId && (
                      <span className="text-red-500 text-sm">
                        {errors.categoryId.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
                      {t("Cost Price")}
                      {uiState.isExistingProduct && (
                        <span className="ml-2 text-sm text-[var(--color-text-muted-mock)]">
                          ({t("Previous:")}{" "}
                          {uiState.selectedProduct?.cost_price}{" "}
                          {
                            currencies.find(
                              (c) =>
                                c.id === uiState.selectedProduct?.cost_currency
                            )?.code
                          }
                          )
                        </span>
                      )}
                    </label>
                    <div className="flex border border-border-add-purchase rounded-lg overflow-hidden focus-within:border-primary-mock focus-within:shadow-sm transition-all duration-200">
                      <input
                        {...register("costPrice", { valueAsNumber: true })}
                        type="number"
                        className="flex-1 px-3 py-2 bg-[var(--color-background-mock)] text-[var(--color-text-primary-mock)] focus:outline-none"
                        placeholder="0.00"
                      />
                      <select
                        {...register("costCurrencyId", { valueAsNumber: true })}
                        className="px-3 py-2 bg-[var(--color-surface-mock)] text-[var(--color-text-primary-mock)] border-l border-[var(--color-border-add-purchase)] focus:outline-none"
                      >
                        {currencies.map((currency) => (
                          <option key={currency.id} value={currency.id}>
                            {currency.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.costPrice && (
                      <span className="text-red-500 text-sm">
                        {errors.costPrice.message}
                      </span>
                    )}
                    {errors.costCurrencyId && (
                      <span className="text-red-500 text-sm">
                        {errors.costCurrencyId.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
                      {t("Selling Price")}
                    </label>
                    <div
                      className={`flex border border-border-add-purchase rounded-lg overflow-hidden
                focus-within:border-primary-mock focus-within:shadow-sm
                  transition-all duration-200 ${
                    uiState.isExistingProduct
                      ? "opacity-50 cursor-not-allowed bg-surface-mock"
                      : "bg-background-mock"
                  }`}
                    >
                      <input
                        type="number"
                        {...register("sellingPrice", { valueAsNumber: true })}
                        disabled={uiState.isExistingProduct}
                        className={`flex-1 px-3 py-2 text-[var(--color-text-primary-mock)] focus:outline-none ${
                          uiState.isExistingProduct && "cursor-not-allowed"
                        }`}
                        placeholder="0.00"
                      />
                      <select
                        {...register("sellingCurrencyId", {
                          valueAsNumber: true,
                        })}
                        disabled={uiState.isExistingProduct}
                        className="px-3 py-2 bg-[var(--color-surface-mock)] text-[var(--color-text-primary-mock)] border-l border-[var(--color-border-add-purchase)] focus:outline-none"
                      >
                        {currencies.map((currency) => (
                          <option key={currency.id} value={currency.id}>
                            {currency.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.sellingPrice && (
                      <span className="text-red-500 text-sm">
                        {errors.sellingPrice.message}
                      </span>
                    )}
                    {errors.sellingCurrencyId && (
                      <span className="text-red-500 text-sm">
                        {errors.sellingCurrencyId.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity, Vendor, Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary-mock mb-2">
                      {t("Quantity")}
                    </label>
                    <div
                      className="flex border border-border-add-purchase rounded-lg overflow-hidden
                focus-within:border-primary-mock focus-within:shadow-sm
                  transition-all duration-200"
                    >
                      <input
                        type="number"
                        {...register("quantity", { valueAsNumber: true })}
                        className="flex-1 px-3 py-2 text-text-primary-mock focus:outline-none bg-background-mock"
                        placeholder="0"
                      />
                      <select
                        {...register("unitId", {
                          valueAsNumber: true,
                        })}
                        disabled={uiState.isExistingProduct}
                        className={`px-3 py-2 text-text-primary-mock border-l border-border-add-purchase focus:outline-none ${
                          uiState.isExistingProduct
                            ? "opacity-50 cursor-not-allowed bg-surface-mock"
                            : "bg-background-mock"
                        }`}
                      >
                        {units.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.abbreviation}
                          </option>
                        ))}
                      </select>
                    </div>

                    {errors.quantity && (
                      <span className="text-red-500 text-sm">
                        {errors.quantity.message}
                      </span>
                    )}
                    {errors.unitId && (
                      <span className="text-red-500 text-sm">
                        {errors.unitId.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Advanced Fields Toggle */}
                <div className="border-t border-[var(--color-border-add-purchase)] pt-6">
                  <button
                    type="button"
                    onClick={() => toggleAdvanced()}
                    className="flex items-center gap-2 text-[var(--color-primary-mock)] hover:text-[var(--color-primary-hover-mock)] font-medium transition-colors duration-200"
                  >
                    {uiState.showAdvanced ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    {uiState.showAdvanced ? t("Hide") : t("Show")}{" "}
                    {t("Advanced Fields")}
                  </button>
                </div>

                {/* Advanced Fields */}
                {uiState.showAdvanced && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
                          {t("Product Image")}
                        </label>
                        <input
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            form.setValue("image", file);
                          }}
                          type="file"
                          disabled={uiState.isExistingProduct}
                          className={`w-full px-3 py-2 border border-border-add-purchase
                      rounded-lg text-text-primary-mock
                      placeholder-text-muted-mock focus:outline-none
                      focus:border-primary-mock focus:shadow-sm transition-all
                      duration-200 ${
                        uiState.isExistingProduct
                          ? "opacity-50 cursor-not-allowed bg-surface-mock"
                          : "bg-background-mock"
                      }`}
                        />
                        {errors.image && (
                          <span className="text-red-500 text-sm">
                            {errors.image.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
                          {t("Expire Date")}
                        </label>
                        <input
                          type="date"
                          {...register("expireDate")}
                          className="w-full px-3 py-2 border border-[var(--color-border-add-purchase)] rounded-lg bg-[var(--color-background-mock)] text-[var(--color-text-primary-mock)] focus:outline-none focus:border-[var(--color-primary-mock)] focus:shadow-sm transition-all duration-200"
                        />
                        {errors.expireDate && (
                          <span className="text-red-500 text-sm">
                            {errors.expireDate.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
                          {t("Reorder Level")}
                        </label>
                        <input
                          type="number"
                          {...register("reorderLevel", { valueAsNumber: true })}
                          disabled={uiState.isExistingProduct}
                          className={`w-full px-3 py-2 border border-border-add-purchase rounded-lg
                      bg-background-mock text-text-primary-mock
                      placeholder-text-muted-mock focus:outline-none
                      focus:border-primary-mock focus:shadow-sm transition-all
                      duration-200  ${
                        uiState.isExistingProduct
                          ? "opacity-50 cursor-not-allowed bg-surface-mock"
                          : "bg-background-mock"
                      }`}
                          placeholder={t("Minimum stock level")}
                        />
                        {errors.reorderLevel && (
                          <span className="text-red-500 text-sm">
                            {errors.reorderLevel.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary-mock)] mb-2">
                          {t("Notes")}
                        </label>
                        <textarea
                          {...register("notes")}
                          className="w-full px-3 py-2 border border-[var(--color-border-add-purchase)] rounded-lg bg-[var(--color-background-mock)] text-[var(--color-text-primary-mock)] placeholder-[var(--color-text-muted-mock)] focus:outline-none focus:border-[var(--color-primary-mock)] focus:shadow-sm transition-all duration-200"
                          placeholder={t("Additional notes")}
                          rows={2}
                        />
                        {errors.notes && (
                          <span className="text-red-500 text-sm">
                            {errors.notes.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Add to Purchase List Button */}
                <div className="flex justify-end ">
                  <button
                    type="button"
                    onClick={() => {
                      // togglePaymentModal(true);
                      handleSubmit();
                    }}
                    className="px-6 py-3 bg-[var(--color-success-mock)] hover:bg-[var(--color-success-mock)]/90 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-md flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t("Add to Purchase List")}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <PaymentModal
            onHide={() => togglePaymentModal(false)}
            visible={uiState.showPaymentModal}
            onSubmit={onFinalSubmit}
          />
          {/* Purchase List Section */}
          <RightSide
            editItem={editItem}
            removeItem={removeItem}
            onPurchase={togglePaymentModal}
            onSelectVendor={(v) => setVendor(v.id)}
            selectedVendor={selectedVendor}
            onClearVendor={() => setVendor(0)}
          />
        </div>
      </div>
    </>
  );
}

export default AddPurchase;
