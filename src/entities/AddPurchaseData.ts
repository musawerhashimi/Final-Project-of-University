
export interface AddVariantData {
    variant_name: string;
    is_default: boolean;
    image?: File; // an actual image not image url
    barcode: string;
    cost_price: number;
    cost_currency_id: number; // dropdown | select
    selling_price: number;
    selling_currency_id: number;
}

export interface AddProductData {
    name: string;
    category_id: number;
    base_unit_id: number;
    description?: string;
    reorder_level: number;
    variants: AddVariantData[]; // exactly one variant and is default=true
}

export interface AddPurchaseItemData {
    id: number;
    variant_id?: number;
    product_data: AddProductData;
    quantity: number;
    unit_cost: number;

    expiry_date?: string;
    supplier_batch_ref?: string;
}

export interface AddPurchaseData {
  vendor: number;
//   location: number;
  currency: number;
  notes: string;
  items: AddPurchaseItemData[];
}
