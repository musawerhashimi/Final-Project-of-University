import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ==================== INTERFACES ====================
export interface AddVariantData {
  variant_name: number;
  is_default: boolean;
  image: string; // actual image not image url
  barcode: string;
  cost_price: number;
  cost_currency_id: number;
  selling_price: number;
  selling_currency_id: number;
}

export interface AddProductData {
  name: string;
  category_id: number;
  base_unit_id: number;
  description: string;
  reorder_level: number;
  variants: AddVariantData[];
}

export interface AddPurchaseItemData {
  variant_id?: number;
  product_data?: AddProductData;
  quantity: number;
  unit_cost: number;
  expiry_date?: Date;
  supplier_batch_ref?: string;
}

export interface AddPurchaseData {
  vendor: number;
  location: number;
  currency: number;
  notes: string;
  items: AddPurchaseItemData[];
}

// Extended interfaces for full product/purchase data
export interface Product extends AddProductData {
  id: number;
  created_at: Date;
  updated_at: Date;
  total_stock?: number;
  status: 'active' | 'inactive' | 'discontinued';
}

export interface Purchase extends AddPurchaseData {
  id: number;
  purchase_number: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

// ==================== PRODUCT STORE ====================
interface ProductStore {
  // State
  products: Product[];
  draftProduct: Partial<AddProductData> | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    category_id?: number;
    status?: Product['status'];
    low_stock?: boolean;
  };

  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProductById: (id: number) => Product | undefined;
  
  // Search and Filter
  setSearchTerm: (term: string) => void;
  setFilters: (filters: ProductStore['filters']) => void;
  getFilteredProducts: () => Product[];
  
  // Draft Management
  setDraftProduct: (draft: Partial<AddProductData>) => void;
  updateDraftProduct: (updates: Partial<AddProductData>) => void;
  clearDraftProduct: () => void;
  
  // Variant Management
  addVariantToDraft: (variant: AddVariantData) => void;
  updateVariantInDraft: (index: number, updates: Partial<AddVariantData>) => void;
  removeVariantFromDraft: (index: number) => void;
  
  // UI State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utility
  resetStore: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    immer((set, get) => ({
      // Initial State
      products: [],
      draftProduct: null,
      isLoading: false,
      error: null,
      searchTerm: '',
      filters: {},

      // Actions
      setProducts: (products) => set({ products }),
      
      addProduct: (product) => set((state) => {
        state.products.push(product);
      }),
      
      updateProduct: (id, updates) => set((state) => {
        const index = state.products.findIndex(p => p.id === id);
        if (index !== -1) {
          Object.assign(state.products[index], updates);
        }
      }),
      
      deleteProduct: (id) => set((state) => {
        state.products = state.products.filter(p => p.id !== id);
      }),
      
      getProductById: (id) => {
        return get().products.find(p => p.id === id);
      },

      // Search and Filter
      setSearchTerm: (term) => set({ searchTerm: term }),
      
      setFilters: (filters) => set({ filters }),
      
      getFilteredProducts: () => {
        const { products, searchTerm, filters } = get();
        let filtered = products;

        // Search by name or description
        if (searchTerm) {
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply filters
        if (filters.category_id) {
          filtered = filtered.filter(p => p.category_id === filters.category_id);
        }
        
        if (filters.status) {
          filtered = filtered.filter(p => p.status === filters.status);
        }
        
        if (filters.low_stock) {
          filtered = filtered.filter(p => 
            p.total_stock !== undefined && p.total_stock <= p.reorder_level
          );
        }

        return filtered;
      },

      // Draft Management
      setDraftProduct: (draft) => set({ draftProduct: draft }),
      
      updateDraftProduct: (updates) => set((state) => {
        if (state.draftProduct) {
          Object.assign(state.draftProduct, updates);
        } else {
          state.draftProduct = updates;
        }
      }),
      
      clearDraftProduct: () => set({ draftProduct: null }),

      // Variant Management
      addVariantToDraft: (variant) => set((state) => {
        if (!state.draftProduct) {
          state.draftProduct = { variants: [] };
        }
        if (!state.draftProduct.variants) {
          state.draftProduct.variants = [];
        }
        state.draftProduct.variants.push(variant);
      }),
      
      updateVariantInDraft: (index, updates) => set((state) => {
        if (state.draftProduct?.variants?.[index]) {
          Object.assign(state.draftProduct.variants[index], updates);
        }
      }),
      
      removeVariantFromDraft: (index) => set((state) => {
        if (state.draftProduct?.variants) {
          state.draftProduct.variants.splice(index, 1);
        }
      }),

      // UI State
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Utility
      resetStore: () => set({
        products: [],
        draftProduct: null,
        isLoading: false,
        error: null,
        searchTerm: '',
        filters: {},
      }),
    })),
    {
      name: 'product-store',
      partialize: (state) => ({
        products: state.products,
        draftProduct: state.draftProduct,
      }),
    }
  )
);

// ==================== PURCHASE STORE ====================
interface PurchaseStore {
  // State
  purchases: Purchase[];
  draftPurchase: Partial<AddPurchaseData> | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    vendor?: number;
    location?: number;
    status?: Purchase['status'];
    date_range?: {
      start: Date;
      end: Date;
    };
  };

  // Actions
  setPurchases: (purchases: Purchase[]) => void;
  addPurchase: (purchase: Purchase) => void;
  updatePurchase: (id: number, updates: Partial<Purchase>) => void;
  deletePurchase: (id: number) => void;
  getPurchaseById: (id: number) => Purchase | undefined;
  
  // Search and Filter
  setSearchTerm: (term: string) => void;
  setFilters: (filters: PurchaseStore['filters']) => void;
  getFilteredPurchases: () => Purchase[];
  
  // Draft Management
  setDraftPurchase: (draft: Partial<AddPurchaseData>) => void;
  updateDraftPurchase: (updates: Partial<AddPurchaseData>) => void;
  clearDraftPurchase: () => void;
  
  // Item Management
  addItemToDraft: (item: AddPurchaseItemData) => void;
  updateItemInDraft: (index: number, updates: Partial<AddPurchaseItemData>) => void;
  removeItemFromDraft: (index: number) => void;
  clearDraftItems: () => void;
  
  // Calculations
  calculateDraftTotal: () => number;
  calculatePurchaseTotal: (purchase: Purchase) => number;
  
  // UI State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utility
  resetStore: () => void;
}

export const usePurchaseStore = create<PurchaseStore>()(
  persist(
    immer((set, get) => ({
      // Initial State
      purchases: [],
      draftPurchase: null,
      isLoading: false,
      error: null,
      searchTerm: '',
      filters: {},

      // Actions
      setPurchases: (purchases) => set({ purchases }),
      
      addPurchase: (purchase) => set((state) => {
        state.purchases.push(purchase);
      }),
      
      updatePurchase: (id, updates) => set((state) => {
        const index = state.purchases.findIndex(p => p.id === id);
        if (index !== -1) {
          Object.assign(state.purchases[index], updates);
        }
      }),
      
      deletePurchase: (id) => set((state) => {
        state.purchases = state.purchases.filter(p => p.id !== id);
      }),
      
      getPurchaseById: (id) => {
        return get().purchases.find(p => p.id === id);
      },

      // Search and Filter
      setSearchTerm: (term) => set({ searchTerm: term }),
      
      setFilters: (filters) => set({ filters }),
      
      getFilteredPurchases: () => {
        const { purchases, searchTerm, filters } = get();
        let filtered = purchases;

        // Search by purchase number or notes
        if (searchTerm) {
          filtered = filtered.filter(p => 
            p.purchase_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.notes.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply filters
        if (filters.vendor) {
          filtered = filtered.filter(p => p.vendor === filters.vendor);
        }
        
        if (filters.location) {
          filtered = filtered.filter(p => p.location === filters.location);
        }
        
        if (filters.status) {
          filtered = filtered.filter(p => p.status === filters.status);
        }
        
        if (filters.date_range) {
          filtered = filtered.filter(p => {
            const purchaseDate = new Date(p.created_at);
            return purchaseDate >= filters.date_range!.start && 
                   purchaseDate <= filters.date_range!.end;
          });
        }

        return filtered;
      },

      // Draft Management
      setDraftPurchase: (draft) => set({ draftPurchase: draft }),
      
      updateDraftPurchase: (updates) => set((state) => {
        if (state.draftPurchase) {
          Object.assign(state.draftPurchase, updates);
        } else {
          state.draftPurchase = updates;
        }
      }),
      
      clearDraftPurchase: () => set({ draftPurchase: null }),

      // Item Management
      addItemToDraft: (item) => set((state) => {
        if (!state.draftPurchase) {
          state.draftPurchase = { items: [] };
        }
        if (!state.draftPurchase.items) {
          state.draftPurchase.items = [];
        }
        state.draftPurchase.items.push(item);
      }),
      
      updateItemInDraft: (index, updates) => set((state) => {
        if (state.draftPurchase?.items?.[index]) {
          Object.assign(state.draftPurchase.items[index], updates);
        }
      }),
      
      removeItemFromDraft: (index) => set((state) => {
        if (state.draftPurchase?.items) {
          state.draftPurchase.items.splice(index, 1);
        }
      }),
      
      clearDraftItems: () => set((state) => {
        if (state.draftPurchase) {
          state.draftPurchase.items = [];
        }
      }),

      // Calculations
      calculateDraftTotal: () => {
        const { draftPurchase } = get();
        if (!draftPurchase?.items) return 0;
        
        return draftPurchase.items.reduce((total, item) => {
          return total + (item.quantity * item.unit_cost);
        }, 0);
      },
      
      calculatePurchaseTotal: (purchase) => {
        return purchase.items.reduce((total, item) => {
          return total + (item.quantity * item.unit_cost);
        }, 0);
      },

      // UI State
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Utility
      resetStore: () => set({
        purchases: [],
        draftPurchase: null,
        isLoading: false,
        error: null,
        searchTerm: '',
        filters: {},
      }),
    })),
    {
      name: 'purchase-store',
      partialize: (state) => ({
        purchases: state.purchases,
        draftPurchase: state.draftPurchase,
      }),
    }
  )
);

// ==================== HELPER HOOKS ====================

// Product Store Helpers
export const useProductActions = () => {
  const {
    addProduct,
    updateProduct,
    deleteProduct,
    setDraftProduct,
    updateDraftProduct,
    clearDraftProduct,
    addVariantToDraft,
    updateVariantInDraft,
    removeVariantFromDraft,
  } = useProductStore();

  return {
    addProduct,
    updateProduct,
    deleteProduct,
    setDraftProduct,
    updateDraftProduct,
    clearDraftProduct,
    addVariantToDraft,
    updateVariantInDraft,
    removeVariantFromDraft,
  };
};

export const useProductData = () => {
  const {
    products,
    draftProduct,
    isLoading,
    error,
    getFilteredProducts,
    getProductById,
  } = useProductStore();

  return {
    products,
    draftProduct,
    isLoading,
    error,
    getFilteredProducts,
    getProductById,
  };
};

// Purchase Store Helpers
export const usePurchaseActions = () => {
  const {
    addPurchase,
    updatePurchase,
    deletePurchase,
    setDraftPurchase,
    updateDraftPurchase,
    clearDraftPurchase,
    addItemToDraft,
    updateItemInDraft,
    removeItemFromDraft,
    clearDraftItems,
  } = usePurchaseStore();

  return {
    addPurchase,
    updatePurchase,
    deletePurchase,
    setDraftPurchase,
    updateDraftPurchase,
    clearDraftPurchase,
    addItemToDraft,
    updateItemInDraft,
    removeItemFromDraft,
    clearDraftItems,
  };
};

export const usePurchaseData = () => {
  const {
    purchases,
    draftPurchase,
    isLoading,
    error,
    getFilteredPurchases,
    getPurchaseById,
    calculateDraftTotal,
    calculatePurchaseTotal,
  } = usePurchaseStore();

  return {
    purchases,
    draftPurchase,
    isLoading,
    error,
    getFilteredPurchases,
    getPurchaseById,
    calculateDraftTotal,
    calculatePurchaseTotal,
  };
};