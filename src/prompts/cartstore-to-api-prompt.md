export interface CartItemData {
  available: number;
  quantityPrice: number;
  discountPrice: number;
  quantityCurrency: number;
  discountCurrency: number;
  discountPercent: number;
  notes: string;
  id: number;
  inventory: number;
  name: string;
  barcode: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
  cost_currency: number;
  selling_currency: number;
  unit_id: number;
  relativeUnits?: RelativeUnits[];
}

// stores/useCartStore.ts
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { CartItemData } from "../entities/CartItemData";
import type { InventoryItem } from "../entities/InventoryItem";
import type { Price } from "../entities/Price";
import type { SalePaymentData } from "../entities/SalePayment";
import { productToCart } from "../utils/productToCart";
import { convertCurrency, useCurrencyStore } from "./useCurrencyStore";
import { roundWithPrecision } from "../utils/roundWithPrecision";
import type { SaleCustomer } from "../entities/SaleCustomer";
import apiClient from "../lib/api";

interface CartState {
  id: number;
  items: CartItemData[];
  payments: SalePaymentData[];
  sale_date?: Date | null;
  discount_amount: number;
  added_to_acount: number;
  customer?: SaleCustomer;
  notes: string;
  subtotalCurrencyId: number;
  isOpen: boolean;
}

export interface SaleCustomer {
  id: number;
  name: string;
  balance: string;
  added_to_account?: number;
}

export interface SalePaymentData {
  id: number;
  amount: number;
  currency: number;
  cash_drawer: number;
  notes: string;
}

interface CartActions {
  // Cart management
  addItem: (product: InventoryItem) => void;
  updateItem: (updated: CartItemData) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  setItems: (items: CartItemData[]) => void;

  // Currency management
  setSubtotalCurrency: (currencyId: number) => void;

  // sales
  addPayment: (payment: Omit<SalePaymentData, "id">) => void;
  deletePayment: (id: number) => void;
  setSaleDate: (date: Date | null | string) => void;
  setNotes: (note: string) => void;
  // UI state
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;

  // Computed values
  getSubtotal: () => number;
  getTotalAmount: () => number;
  getItemCount: () => number;
  getItemById: (id: number) => CartItemData | undefined;
  getItemTotalAmount: (itemId: number) => number;
  setDiscountPrice: (discount_amount: number) => void;
  getFinalAmount: () => number;

  // Customer
  setCustomer: (customer?: SaleCustomer) => void;
  getCustomers: (keyword: string) => Promise<SaleCustomer[]>;
  addToCustomerAccount: (amount: number) => void;
  clearCustomerAccount: () => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      id: new Date().getTime(), // Unique ID based on timestamp
      items: [],
      subtotalCurrencyId: 0,
      isOpen: true,
      payments: [],
      sale_date: null,
      discount_amount: 0,
      notes: "",
      added_to_acount: 0,
      getCurrencyStore: useCurrencyStore,
      // Actions
      addItem: (newItem) => {
        const { items } = get();

        const existingItemIndex = items.findIndex(
          (item) => item.id === newItem.id
        );

        if (existingItemIndex > -1) {
          // Item exists, increment quantity by 1
          const existingItem = items[existingItemIndex];
          const newQuantity = existingItem.quantity + 1;

          // Check if new quantity exceeds available stock
          if (newQuantity > existingItem.available) {
            console.warn(
              `Cannot add more items. Available stock: ${existingItem.available}`
            );
            return;
          }

          // Calculate updated item with new quantity using the shared function
          const updatedItem = calculateItemUpdate(
            existingItem,
            "quantity",
            newQuantity,
            convertCurrency
          );

          set(
            (state) => ({
              items: state.items.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
              ),
            }),
            false,
            "addItem/increment"
          );
        } else {
          // New item, convert product to cart item
          const newCartItem = productToCart(newItem);
          set(
            (state) => ({
              items: [...state.items, newCartItem],
            }),
            false,
            "addItem/new"
          );
        }
      },

      updateItem: (updated: CartItemData) => {
        set(
          (state) => ({
            items: state.items.map((item) =>
              item.id === updated.id ? updated : item
            ),
          }),
          false,
          "updateItem"
        );
      },

      removeItem: (id: number) => {
        set(
          (state) => ({
            items: state.items.filter((item) => item.id !== id),
          }),
          false,
          "removeItem"
        );
      },

      clearCart: () => {
        set({ items: [] }, false, "clearCart");
      },

      setItems: (items: CartItemData[]) => {
        set({ items }, false, "setItems");
      },

      setSubtotalCurrency: (currencyId: number) => {
        set({ subtotalCurrencyId: currencyId }, false, "setSubtotalCurrency");
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }), false, "toggleCart");
      },

      setCartOpen: (isOpen: boolean) => {
        set({ isOpen }, false, "setCartOpen");
      },

      getSubtotal: () => {
        const { items, getItemTotalAmount } = get();
        return items.reduce((sum, item) => {
          const itemTotal = getItemTotalAmount(item.id);
          return sum + itemTotal;
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getItemById: (id: number) => {
        const { items } = get();
        return items.find((item) => item.id === id);
      },

      getItemTotalAmount: (itemId: number) => {
        const { subtotalCurrencyId, getItemById } = get();
        const item = getItemById(itemId);
        if (!item) return 0;
        // Convert quantityPrice to subtotal currency
        const quantityPriceInSubtotalCurrency = convertCurrency(
          item.quantityPrice,
          item.quantityCurrency,
          subtotalCurrencyId
        );

        // Convert discountPrice to subtotal currency
        const discountPriceInSubtotalCurrency = convertCurrency(
          item.discountPrice,
          item.discountCurrency,
          subtotalCurrencyId
        );

        // Calculate final amount: quantityPrice - discountPrice
        return Math.max(
          0,
          quantityPriceInSubtotalCurrency - discountPriceInSubtotalCurrency
        );
      },

      addPayment(payment) {
        const { payments, getFinalAmount, subtotalCurrencyId } = get();

        const finalAmount = getFinalAmount();
        if (finalAmount <= 0) {
          return;
        }
        const pay = convertCurrency(
          payment.amount,
          payment.currency,
          subtotalCurrencyId
        );
        if (pay > finalAmount) {
          payment.amount = convertCurrency(
            finalAmount,
            subtotalCurrencyId,
            payment.currency
          );
        }
        const id = payments.length;

        set(() => ({ payments: [...payments, { ...payment, id }] }));
      },
      deletePayment(id) {
        set((state) => ({
          payments: state.payments.filter((p) => p.id !== id),
        }));
      },
      setNotes(note) {
        set(() => ({ notes: note }));
      },
      setSaleDate(date) {
        let d: Date | null;

        if (typeof date == "string") {
          d = date.trim() === "" ? null : new Date(date);
        } else {
          d = date;
        }
        set(() => ({ sale_date: d }));
      },
      setDiscountPrice(discount) {
        if (discount < 0) {
          return;
        }
        const { getSubtotal } = get();
        set(() => ({ discount_amount: getSubtotal() - discount }));
      },
      getTotalAmount() {
        const { getSubtotal, discount_amount } = get();
        return getSubtotal() - discount_amount;
      },

      getFinalAmount() {
        const { payments, getTotalAmount, subtotalCurrencyId, customer } =
          get();
        const total_amount = getTotalAmount();
        return (
          total_amount -
          (customer?.added_to_account || 0) -
          payments.reduce(
            (prev, payment) =>
              prev +
              convertCurrency(
                payment.amount,
                payment.currency,
                subtotalCurrencyId
              ),
            0
          )
        );
      },
      setCustomer(customer) {
        set(() => ({ customer }));
      },
      async getCustomers(keyword) {
        if (!keyword) {
          return [];
        }

        const customers = (
          await apiClient.get<SaleCustomer[]>(
            "/customers/customers/search?q=" + keyword
          )
        ).data;
        return customers;
      },
      addToCustomerAccount(amount) {
        const { customer } = get();
        if (!customer) {
          return;
        }
        set(() => ({
          customer: {
            ...customer,
            added_to_account: (customer.added_to_account || 0) + amount,
          },
        }));
      },
      clearCustomerAccount() {
        const { customer } = get();
        if (!customer) {
          return;
        }
        set(() => ({ customer: { ...customer, added_to_account: undefined } }));
      },
    })),

    {
      name: "cart-store", // name for devtools
    }
  )
);

// Core calculation function with correct relationships
export const calculateItemUpdate = (
  item: CartItemData,
  field: string,
  value: number | string,
  convertCurrency: (
    price: number,
    fromCurrencyId: number,
    toCurrencyId: number
  ) => number
): CartItemData => {
  // Helper to convert any price to sellPrice currency
  const toSellCurrency = (price: Price) =>
    convertCurrency(price.price, price.currencyId, item.selling_currency);

  // Start with current values
  let selling_price = item.selling_price;
  let quantityPrice = item.quantityPrice;
  let discountPrice = item.discountPrice;
  let discountPercent = item.discountPercent;
  let quantity = item.quantity;
  let notes = item.notes;

  // Update the changed field first
  switch (field) {
    case "selling_price":
      selling_price = value as number;
      break;
    case "quantityPrice":
      quantityPrice = value as number;
      break;
    case "discountPrice":
      discountPrice = value as number;
      break;
    case "discountPercent":
      discountPercent = value as number;
      break;
    case "quantity":
      quantity = value as number;
      break;
    case "notes":
      notes = value as string;
      return { ...item, notes }; // Early return for notes
  }

  // Apply correct relationships based on what changed
  if (field === "selling_price") {
    // sellPrice changed -> update quantityPrice
    quantityPrice = convertCurrency(
      selling_price * quantity,
      item.selling_currency,
      item.quantityCurrency
    );
  } else if (field === "quantityPrice") {
    // quantityPrice changed -> update quantity (if sellPrice is not 0)
    if (selling_price !== 0) {
      const sellPriceInQuantityCurrency = convertCurrency(
        item.selling_price,
        item.selling_currency,
        item.quantityCurrency
      );
      quantity = roundWithPrecision(
        quantityPrice / sellPriceInQuantityCurrency,
        2
      );
    }
  } else if (field === "quantity") {
    // quantity changed -> update quantityPrice
    quantityPrice = convertCurrency(
      selling_price * quantity,
      item.selling_currency,
      item.quantityCurrency
    );
  } else if (field === "discountPrice") {
    // discountPrice changed -> update discountPercent
    const quantityPriceInSellCurrency = toSellCurrency({
      price: quantityPrice,
      currencyId: item.quantityCurrency,
    });
    const discountPriceInSellCurrency = toSellCurrency({
      price: discountPrice,
      currencyId: item.discountCurrency,
    });
    discountPercent =
      quantityPriceInSellCurrency > 0
        ? (discountPriceInSellCurrency / quantityPriceInSellCurrency) * 100
        : 0;
  } else if (field === "discountPercent") {
    // discountPercent changed -> update discountPrice
    const quantityPriceInSellCurrency = toSellCurrency({
      price: quantityPrice,
      currencyId: item.quantityCurrency,
    });
    const discountAmountInSellCurrency =
      (quantityPriceInSellCurrency * discountPercent) / 100;
    discountPrice = convertCurrency(
      discountAmountInSellCurrency,
      item.selling_currency,
      item.discountCurrency
    );
  }

  return {
    ...item,
    quantity,
    discountPercent,
    notes,
    selling_price: selling_price,
    quantityPrice: quantityPrice,
    discountPrice: discountPrice,
  };
};


// serializer

class SaleItemSerializer(serializers.ModelSerializer):
    """Serializer for sale items"""
    
    variant_name = serializers.CharField(source='inventory.variant.variant_name', read_only=True)
    unit_name = serializers.CharField(source='inventory.variant.product.base_unit.name', read_only=True)
    
    class Meta:
        model = SaleItem
        fields = [
            'id', 'inventory', 'variant_name', 'unit_name',
            'quantity', 'unit_price', 'line_total', 
            'discount_amount', 'created_at'
        ]
        read_only_fields = ['id', 'line_total', 'created_at']
    
    def validate(self, attrs):
        """Validate sale item data"""
        quantity = attrs.get('quantity')
        inventory = attrs.get("inventory")
        
        available_qty = inventory.available_quantity
        
        if quantity > available_qty:
            raise serializers.ValidationError(
                {'quantity': f'Insufficient inventory. Available: {available_qty}'}
            )
        
        return attrs


class SalePaymentSerializer(serializers.ModelSerializer):
    """Process payment for a sale"""
    
    class Meta:
        model = Payment
        fields = [
            'amount', 'currency',
            'cash_drawer', 'notes'
        ]
        required_fields = ["cash_drawer"]
    
    def validate(self, data):
        """Validate payment data"""
        amount = data['amount']
        
        if amount <= 0:
            raise serializers.ValidationError("Payment amount must be greater than 0")
        
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        """Create payment and update financial records"""
        sale = self.context['sale']
        # Create payment record
        payment = Payment.objects.create(
            tenant=sale.tenant,
            amount=validated_data['amount'],
            currency=validated_data['currency'],
            payment_method="cash",
            reference_type='sale',
            reference_id=sale.pk,
            cash_drawer=validated_data.get('cash_drawer'),
            notes=validated_data.get('notes', ''),
            created_by_user=self.context['request'].user
        )
        
        # Create transaction record for audit trail
        Transaction.objects.create(
            tenant=payment.tenant,
            transaction_date=payment.payment_date,
            amount=payment.amount,
            currency=payment.currency,
            description=f"{"Payment" if type=="tender" else "Change"} for Sale #{sale.sale_number}",
            party_type='customer',
            party_id=sale.customer.pk if sale.customer else None,
            transaction_type='income' if type=="tender" else "expense",
            reference_type='sale',
            reference_id=sale.pk,
            cash_drawer_id=payment.cash_drawer_id,
            created_by_user=payment.processed_by_user
        )
        
        # Update cash drawer for cash payments
        if payment.payment_method == 'cash' and payment.cash_drawer_id:
            cash_drawer_money, _ = CashDrawerMoney.objects.get_or_create(
                cash_drawer_id=payment.cash_drawer_id,
                currency=payment.currency,
                defaults={'amount': Decimal('0')}
            )
            cash_drawer_money.amount += payment.amount
            cash_drawer_money.save()
        
        # Update sale payment status
        sale.update_payment_status()

        return payment
    
    
class SaleCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating sales"""
    
    items = SaleItemSerializer(many=True)
    payments = SalePaymentSerializer(many=True)
    
    class Meta:
        model = Sales
        fields = [
            'customer', 'sale_date', 'receipt_id',
            'discount_amount', 'tax_amount', 'payments',
            'currency', 'notes', 'items'
        ]
    
    def validate(self, attrs):
        """Validate sale data"""
        items_data = attrs.get('items', [])
        
        if not items_data:
            raise serializers.ValidationError(
                {'items': 'At least one item is required.'}
            )
        
        # Validate customer if provided
        customer = attrs.get('customer')
        if customer and not customer.is_active:
            raise serializers.ValidationError(
                {'customer': 'Selected customer is not active.'}
            )
        
        return attrs
    
    @transaction.atomic
    def create(self, validated_data):
        """Create sale with items"""
        items_data = validated_data.pop('items')
        payments = validated_data.pop("payments")
        # Generate sale number
        last_sale = Sales.objects.order_by('-id').first()
        if last_sale:
            last_number = int(last_sale.sale_number.split('-')[-1])
            sale_number = f"SALE-{last_number + 1:06d}"
        else:
            sale_number = "SALE-000001"
        
        validated_data['sale_number'] = sale_number
        
        # Create sale
        sale = Sales.objects.create(**validated_data)
        
        # Create sale items and calculate totals
        subtotal = Decimal('0.00')
        total_discount = Decimal('0.00')
        
        for item_data in items_data:
            item_data['sale'] = sale
            item = SaleItem.objects.create(**item_data)
            subtotal += item.line_total
            total_discount += item.discount_amount
        
        # Update sale totals
        sale.subtotal = subtotal
        sale.discount_amount = total_discount
        sale.total_amount = subtotal + sale.tax_amount
        sale.save()
        
        for payment in payments:
            payment_serializer = SalePaymentSerializer(data=payment, context={'sale', sale})
            payment_serializer.is_valid(raise_exception=True)
            payment_serializer.save()
        
        sale.refresh_from_db()
        remaining_payment = sale.balance_due
        customer = sale.customer
        if remaining_payment > 0 and customer:
            customer.balance -= remaining_payment
            customer.save()
        
        # Update inventory
        self._update_inventory_on_sale(sale)
        
        return sale
    
    @transaction.atomic
    def update(self, instance, validated_data):
        """Update sale with items"""
        items_data = validated_data.pop('items', [])
        
        # Update sale basic info
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if items_data:
            # Remove existing items and restore inventory
            self._restore_inventory_on_cancel(instance)
            instance.items.all().delete()
            
            # Create new items
            subtotal = Decimal('0.00')
            total_discount = Decimal('0.00')
            
            for item_data in items_data:
                item_data['sale'] = instance
                item = SaleItem.objects.create(**item_data)
                subtotal += item.line_total
                total_discount += item.discount_amount
            
            # Update totals
            instance.subtotal = subtotal
            instance.discount_amount = total_discount
            instance.total_amount = subtotal + instance.tax_amount
            
            # Update inventory
            self._update_inventory_on_sale(instance)
        
        instance.save()
        return instance
    
    def _update_inventory_on_sale(self, sale):
        """Update inventory when sale is created/confirmed"""
        for item in sale.items.all():
            
            # Create stock movement
            from inventory.models import StockMovement
            StockMovement.objects.create(
                tenant=sale.tenant,
                variant=item.inventory.variant,
                batch=item.inventory.batch,
                location=item.inventory.location,
                movement_type='sale',
                quantity=-item.quantity,
                reference_type='sale',
                reference_id=sale.id,
                notes=f"Sale: {sale.sale_number}",
                created_by_user=sale.created_by_user
            )
    
    def _restore_inventory_on_cancel(self, sale):
        """Restore inventory when sale is cancelled"""
        for item in sale.items.all():
            inventory = item.inventory
            inventory.quantity_on_hand += item.quantity
            inventory.save()



HEY BRO THIS IS MY PROJECT WITH REACT TS FRONT AND DJANGO REST FRAMEWORK AT BACKEND NOW IN STORE ALL THE CALCULATIONS ARE DONE AND NOW I NEED YOU TO CONNECT ME TO THE BACKEND WITH THIS API (use apiClient which is imported from /lib/api.ts and is an axios instance with base_url: http://localhost:8000/api and the api is /sales/sales)

if you have any question, just ask before you proceed