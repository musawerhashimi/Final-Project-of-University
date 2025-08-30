// hooks/usePurchaseForm.ts
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { AddPurchaseItemData } from "../entities/AddPurchaseData";
import { apiClient } from "../lib/api";
import type { AddPurchaseItemSchemaData } from "../schemas/addPurchaseSchema";
import { addPurchaseItemSchema } from "../schemas/addPurchaseSchema";
import {
  useCurrencyStore,
  useDepartmentStore,
  useUnitStore,
  useVendorStore,
} from "../stores";
import { useAddPurchaseStore } from "../stores/useAddPurchaseStore";
import { extractAxiosError } from "../utils/extractError";

export interface Product {
  id: number;
  name: string;
  barcode: string;
  category_id: number;
  department_id: number;
  cost_price: number;
  selling_price: number;
  cost_currency: number;
  selling_currency: number;
  unit_id: number;
  reorder_level: number;
}

// UI state interface
interface PurchaseFormUIState {
  showAdvanced: boolean;
  isExistingProduct: boolean;
  selectedProduct: Product | null;

  // API states
  isGeneratingBarcode: boolean;
  isCheckingBarcode: boolean;
  barcodeError: string | null;
  barcodeIsUnique: boolean | null;

  // Products for autocomplete
  products: Product[];
  isLoadingProducts: boolean;

  // payments
  showPaymentModal: boolean;
}

export const usePurchaseForm = () => {
  // Store selectors
  const { departments, createDepartment, createCategory } =
    useDepartmentStore();
  const units = useUnitStore((s) => s.units);
  const currencies = useCurrencyStore((s) => s.currencies);
  const convertCurrency = useCurrencyStore((s) => s.convertCurrency);

  const vendors = useVendorStore((s) => s.vendors);
  // const locations = useLocationStore((s) => s.locations);

  // Purchase store
  const {
    vendor,
    // location,
    // notes: storeNotes,
    currency,
    items,
    isSubmitting,
    submitError,
    editingItemId,
    setVendor,
    // setLocation,
    setCurrency,
    setNotes,
    addItem,
    updateItem,
    removeItem,
    getItemById,
    setEditingItem,
    isEditing,
    getSubtotal,
    getItemCount,
    getTotalPurchaseAmount,
    submitPurchase,
    resetStore,
  } = useAddPurchaseStore();

  // React Hook Form
  const form = useForm<AddPurchaseItemSchemaData>({
    resolver: zodResolver(addPurchaseItemSchema),
    defaultValues: {
      name: "",
      barcode: "",
      departmentId: 1,
      categoryId: departments.find((d) => d.id === 1)?.categories[0].id,
      unitId: 1,
      costPrice: 0,
      costCurrencyId: 1,
      sellingPrice: 0,
      sellingCurrencyId: 1,
      quantity: 1,
      // vendorId: vendor || null,
      // locationId: location || null,

      image: undefined,
      expireDate: undefined,
      reorderLevel: 0,
      notes: "",
      // paymentMethod: "cash",
      // paymentCurrencyId: null,
    },
  });
  // UI State
  const [uiState, setUIState] = useState<PurchaseFormUIState>({
    showAdvanced: false,
    isExistingProduct: false,
    selectedProduct: null,
    isGeneratingBarcode: false,
    isCheckingBarcode: false,
    barcodeError: null,
    barcodeIsUnique: null,
    products: [],
    isLoadingProducts: false,
    showPaymentModal: false,
  });
  const baseCurrencyId = useCurrencyStore((s) => s.getBaseCurrency)().id;
  const togglePaymentModal = (toggle?: boolean) => {
    const show = toggle ? toggle : !uiState.showPaymentModal;
    setUIState((prev) => ({
      ...prev,
      showPaymentModal: show,
    }));
  };

  // Computed values
  const selectedDepartment = departments.find(
    (d) => d.id === form.watch("departmentId")
  );

  const availableCategories = selectedDepartment?.categories || [];

  const selectedCategory = availableCategories.find(
    (c) => c.id === form.watch("categoryId")
  );

  const selectedVendor = vendors.find((v) => v.id === vendor);
  const selectedUnit = units.find((u) => u.id === form.watch("unitId"));
  const selectedCurrency = currencies.find(
    (c) => c.id === form.watch("costCurrencyId")
  );

  // Filter units by type
  const getUnitsByType = (unitType: string) => {
    return units.filter((u) => u.unit_type === unitType);
  };

  // Generate barcode
  const generateBarcode = useCallback(async () => {
    setUIState((prev) => ({
      ...prev,
      isGeneratingBarcode: true,
      barcodeError: null,
    }));

    try {
      const response = await apiClient.post<{ barcode: string }>(
        "/catalog/generate-barcode",
        {
          existingBarcodes: items.map(
            (i) => i.product_data.variants[0].barcode
          ),
        }
      );
      form.setValue("barcode", response.data.barcode);
      setUIState((prev) => ({
        ...prev,
        isGeneratingBarcode: false,
        barcodeIsUnique: true,
      }));
    } catch (error) {
      const errorMessage = extractAxiosError(
        error,
        "Failed to generate barcode"
      );
      setUIState((prev) => ({
        ...prev,
        isGeneratingBarcode: false,
        barcodeError: errorMessage,
      }));
    }
  }, [form, items]);

  // Check barcode uniqueness
  const checkBarcodeUniqueness = useCallback(
    async (barcode: string) => {
      if (!barcode.trim()) {
        setUIState((prev) => ({
          ...prev,
          barcodeIsUnique: null,
          barcodeError: null,
        }));
        return;
      }

      for (const item of items) {
        if (item.product_data.variants[0].barcode === barcode) {
          setUIState((prev) => ({
            ...prev,
            barcodeIsUnique: false,
            barcodeError: "Barcode already exists",
          }));
          return;
        }
      }
      setUIState((prev) => ({
        ...prev,
        isCheckingBarcode: true,
        barcodeError: null,
      }));

      try {
        const response = await apiClient.post("/catalog/check-barcode", {
          barcode,
        });
        setUIState((prev) => ({
          ...prev,
          isCheckingBarcode: false,
          barcodeIsUnique: response.data.isUnique,
          barcodeError: response.data.isUnique
            ? null
            : "Barcode already exists",
        }));
      } catch (error) {
        setUIState((prev) => ({
          ...prev,
          isCheckingBarcode: false,
          barcodeError:
            error instanceof Error ? error.message : "Failed to check barcode",
        }));
      }
    },
    [items]
  );

  // Load products for autocomplete
  const loadProducts = useCallback(async (searchTerm: string = "") => {
    setUIState((prev) => ({ ...prev, isLoadingProducts: true }));
    try {
      const response = await apiClient.get(
        `/catalog/products/search?q=${searchTerm}`
      );
      setUIState((prev) => ({ ...prev, products: response.data }));
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setUIState((prev) => ({ ...prev, isLoadingProducts: false }));
    }
  }, []);

  // Select existing product
  const selectExistingProduct = useCallback(
    (product: Product) => {
      setUIState((prev) => ({
        ...prev,
        selectedProduct: product,
        barcodeError: null,
        barcodeIsUnique: null,
        isExistingProduct: true,
      }));
      // Update form with product data
      form.setValue("name", product.name);
      form.setValue("barcode", product.barcode);
      form.setValue("costPrice", product.cost_price);
      form.setValue("costCurrencyId", product.cost_currency);
      form.setValue("sellingPrice", product.selling_price);
      form.setValue("sellingCurrencyId", product.selling_currency);
      form.setValue("departmentId", product.department_id);
      form.setValue("categoryId", product.category_id);
      form.setValue("unitId", product.unit_id);
      form.setValue("reorderLevel", product.reorder_level);
      form.clearErrors();

      // Note: departmentId, categoryId, unitId, barcode will be populated from product variants
    },
    [form]
  );

  // Clear existing product selection
  const clearExistingProduct = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      selectedProduct: null,
      isExistingProduct: false,
      barcodeIsUnique: null,
      barcodeError: null,
    }));
    form.reset();
  }, [form]);

  // Toggle advanced fields
  const toggleAdvanced = useCallback(() => {
    setUIState((prev) => ({ ...prev, showAdvanced: !prev.showAdvanced }));
  }, []);

  // Calculate vendor balance after purchase
  const calculateVendorBalance = useCallback(() => {
    if (!selectedVendor || !selectedCurrency) return null;

    // const currentFormCost = form.watch("costPrice") * form.watch("quantity");
    const totalPurchaseAmount = convertCurrency(
      getTotalPurchaseAmount(),
      currency,
      baseCurrencyId
    ); // + currentFormCost;
    const newBalance = parseFloat(selectedVendor.balance) + totalPurchaseAmount;

    return {
      currentBalance: selectedVendor.balance,
      purchaseAmount: totalPurchaseAmount,
      newBalance,
    };
  }, [
    selectedVendor,
    selectedCurrency,
    getTotalPurchaseAmount,
    convertCurrency,
    currency,
    baseCurrencyId,
  ]);

  // Add item to store
  const addItemToStore = useCallback(
    (data: AddPurchaseItemSchemaData) => {
      if (!selectedUnit || !data.costCurrencyId) return;
      const newItem: Omit<AddPurchaseItemData, "id"> = {
        variant_id: uiState.isExistingProduct
          ? uiState.selectedProduct?.id
          : undefined,
        product_data: {
          name: data.name,
          category_id: data.categoryId!,
          base_unit_id: data.unitId!,
          description: data.notes,
          reorder_level: data.reorderLevel,
          variants: [
            {
              variant_name: "", // Default variant
              is_default: true,
              image: data.image,
              barcode: data.barcode,
              cost_price: data.costPrice,
              cost_currency_id: data.costCurrencyId,
              selling_price: data.sellingPrice,
              selling_currency_id: data.sellingCurrencyId!,
            },
          ],
        },
        quantity: data.quantity,
        unit_cost: data.costPrice,
        expiry_date: data.expireDate,
        supplier_batch_ref: undefined,
      };

      addItem(newItem);

      // Reset form for next item
      if (uiState.isExistingProduct) {
        clearExistingProduct();
        form.reset();
      } else {
        form.reset();
        setUIState((prev) => ({
          ...prev,
          barcodeIsUnique: null,
          barcodeError: null,
        }));
      }
    },
    [
      selectedUnit,
      uiState.isExistingProduct,
      uiState.selectedProduct?.id,
      addItem,
      clearExistingProduct,
      form,
    ]
  );

  // Edit item
  const editItem = useCallback(
    (id: number) => {
      const item = getItemById(id);
      if (!item) return;

      setEditingItem(id);

      const product = item.product_data;
      const variant = product.variants[0];

      form.setValue("name", product.name);
      form.setValue("categoryId", product.category_id);
      form.setValue(
        "departmentId",
        departments.find(
          (d) =>
            d.categories.findIndex((c) => c.id === product.category_id) > -1
        )!.id
      );
      form.setValue("unitId", product.base_unit_id);
      form.setValue("quantity", item.quantity);
      form.setValue("costPrice", variant.cost_price);
      form.setValue("costCurrencyId", variant.cost_currency_id);
      form.setValue("sellingPrice", variant.selling_price);
      form.setValue("sellingCurrencyId", variant.selling_currency_id);
      form.setValue("barcode", variant.barcode);
      form.setValue("image", variant.image);
      form.setValue("expireDate", item.expiry_date);
      form.setValue("reorderLevel", product.reorder_level);
      form.setValue("notes", product.description);

      // Populate form with item data
      if (item.variant_id) {
        // Existing product
        setUIState((prev) => ({
          ...prev,
          isExistingProduct: true,

          // selectedProduct: null,

          selectedProduct: {
            id: item.variant_id!,
            name: product.name,
            barcode: variant.barcode,
            category_id: product.category_id,
            department_id: departments.find(
              (d) =>
                d.categories.findIndex((c) => c.id === product.category_id) > -1
            )!.id,
            cost_price: variant.cost_price,
            selling_price: variant.selling_price,
            cost_currency: variant.cost_currency_id,
            selling_currency: variant.selling_currency_id,
            unit_id: product.base_unit_id,
            reorder_level: product.reorder_level,
          }, // You might want to load the full product data
        }));
        // form.setValue("quantity", item.quantity);
        // form.setValue("costPrice", item.unit_cost);
        // form.setValue("expireDate", item.expiry_date);
      } else if (product) {
        // New product
        setUIState((prev) => ({ ...prev, isExistingProduct: false }));
      }
    },
    [getItemById, setEditingItem, form, departments]
  );

  // Update item in store
  const updateItemInStore = useCallback(
    (data: AddPurchaseItemSchemaData) => {
      if (!editingItemId) return;
      const item = getItemById(editingItemId);

      const updatedData: Partial<AddPurchaseItemData> = {
        quantity: data.quantity,
        unit_cost: data.costPrice,
        expiry_date: data.expireDate,
        product_data: {
          ...item!.product_data,
          variants: [
            {
              ...item!.product_data.variants[0],
              cost_price: data.costPrice,
              cost_currency_id: data.costCurrencyId!,
            },
          ],
        },
      };

      // Update product_data if it's a new product
      if (item && !item.variant_id) {
        updatedData.product_data = {
          ...item.product_data,
          name: data.name,
          category_id: data.categoryId!,
          base_unit_id: data.unitId!,
          description: data.notes,
          reorder_level: data.reorderLevel,
          variants: [
            {
              ...item.product_data.variants[0],
              cost_price: data.costPrice,
              cost_currency_id: data.costCurrencyId!,
              selling_price: data.sellingPrice,
              selling_currency_id: data.sellingCurrencyId!,
              barcode: data.barcode,
              image: data.image,
            },
          ],
        };
      }

      updateItem(editingItemId, updatedData);
      setEditingItem(null);
      clearExistingProduct();
    },
    [
      editingItemId,
      getItemById,
      updateItem,
      setEditingItem,
      clearExistingProduct,
    ]
  );

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setEditingItem(null);
    clearExistingProduct();
  }, [setEditingItem, clearExistingProduct]);

  // Handle form submission
  const handleSubmit = useCallback(
    (data: AddPurchaseItemSchemaData) => {
      if (uiState.barcodeError || uiState.barcodeIsUnique === false) {
        return;
      }
      if (editingItemId) {
        updateItemInStore(data);
      } else {
        addItemToStore(data);
      }
    },
    [
      uiState.barcodeError,
      uiState.barcodeIsUnique,
      editingItemId,
      updateItemInStore,
      addItemToStore,
    ]
  );

  // Handle final purchase submission
  const handlePurchaseSubmit = useCallback(async () => {
    try {
      const result = await submitPurchase();
      return result;
    } catch (error) {
      console.error("Purchase submission failed:", error);
      throw error;
    }
  }, [submitPurchase]);

  // Initialize data on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle department change - clear category
  useEffect(() => {
    if (selectedDepartment && selectedDepartment.categories.length > 0) {
      form.setValue("categoryId", selectedDepartment.categories[0].id);
    } else {
      form.setValue("categoryId", 0);
    }
    // return () => subscription.unsubscribe();
  }, [selectedDepartment, form]);

  const addDepartment = async (department: string) => {
    const departmentId = await createDepartment({ name: department });
    if (departmentId) {
      form.setValue("departmentId", departmentId);
    }
  };
  const addCategory = async (category: string) => {
    if (selectedDepartment) {
      const categoryId = await createCategory(category, selectedDepartment.id);
      if (categoryId) {
        form.setValue("categoryId", categoryId);
      }
    }
  };

  return {
    // React Hook Form
    form,
    handleSubmit: form.handleSubmit(handleSubmit),

    // UI State
    uiState,
    toggleAdvanced,
    togglePaymentModal,
    errors: form.formState.errors,

    setUIState,

    // Store data
    departments,
    availableCategories,
    units,
    currencies,
    vendors,
    // locations,

    // Store state
    purchaseItems: items,
    isSubmitting,
    submitError,
    editingItemId,
    isEditing,

    // Store actions
    addDepartment,
    addCategory,
    setVendor,
    // setLocation,
    setCurrency,
    setNotes,
    removeItem,
    editItem,
    cancelEdit,
    resetStore,

    // Calculations
    getSubtotal,
    getItemCount,
    getTotalPurchaseAmount,
    calculateVendorBalance,

    // Helper functions
    getUnitsByType,

    // Product handling
    loadProducts,
    selectExistingProduct,
    clearExistingProduct,

    // Barcode handling
    generateBarcode,
    checkBarcodeUniqueness,

    // Final submission
    handlePurchaseSubmit,

    // Computed values
    selectedDepartment,
    selectedCategory,
    selectedVendor,
    selectedUnit,
    selectedCurrency,
  };
};
