Backend Models:

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from decimal import Decimal
from core.models import TenantBaseModel, Currency
from core.threads import get_current_tenant
from core.utils import CurrencyConverter
from vendors.models import Vendor
from accounts.models import User
from inventory.models import Location


class CashDrawer(TenantBaseModel):
    """Cash drawers for different locations"""
    name = models.CharField(max_length=100)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='cash_drawers')
    description = models.CharField(max_length=100, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_cash_drawers')

    class Meta:
        db_table = 'cash_drawers'
        unique_together = ['tenant', 'name', 'location']
        indexes = [
            models.Index(fields=['tenant', 'location']),
            models.Index(fields=['tenant', 'is_active']),
        ]

    def __str__(self):
        return f"{self.name} - {self.location.name}"

    @property
    def total_balance(self):
        """Calculate total balance across all currencies"""
        base_currency_id = Currency.get_base_currency().id

        return sum(
            CurrencyConverter.convert_amount(
                money.amount, money.currency_id,
                to_currency_id=base_currency_id
            ) for money in self.cash_drawer_money.all()
        )

    def get_balance_by_currency(self, currency):
        """Get balance for specific currency"""
        try:
            money = self.cash_drawer_money.get(currency=currency)
            return money.amount
        except CashDrawerMoney.DoesNotExist:
            return Decimal('0.00')


class CashDrawerMoney(models.Model):
    """Money in each cash drawer by currency"""
    cash_drawer = models.ForeignKey(CashDrawer, on_delete=models.CASCADE, related_name='cash_drawer_money')
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    last_counted_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'cash_drawer_money'
        unique_together = ['cash_drawer', 'currency']
        indexes = [
            models.Index(fields=['cash_drawer', 'currency']),
        ]

    def __str__(self):
        return f"{self.cash_drawer.name} - {self.currency.code}: {self.amount}"


class Payment(TenantBaseModel):
    """Payment records for sales, purchases, expenses"""
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('mobile_money', 'Mobile Money'),
        ('check', 'Check'),
        ('other', 'Other'),
    ]
    
    REFERENCE_TYPES = [
        ('sale', 'Sale'),
        ('purchase', 'Purchase'),
        ('expense', 'Expense'),
        ('salary', 'Salary'),
        ('dividend', 'Dividend'),
        ('loan', 'Loan'),
        ('other', 'Other'),
    ]
    
    payment_number = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    payment_date = models.DateTimeField(default=timezone.now)
    reference_type = models.CharField(max_length=20, choices=REFERENCE_TYPES)
    reference_id = models.PositiveIntegerField(null=True, blank=True)
    cash_drawer = models.ForeignKey(CashDrawer, on_delete=models.SET_NULL, null=True, blank=True)
    card_transaction_id = models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_by_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_payments')

    class Meta:
        db_table = 'payments'
        indexes = [
            models.Index(fields=['tenant', 'payment_date']),
            models.Index(fields=['tenant', 'reference_type', 'reference_id']),
            models.Index(fields=['tenant', 'payment_method']),
            models.Index(fields=['tenant', 'cash_drawer']),
            models.Index(fields=['payment_number']),
        ]

    def __str__(self):
        return f"{self.payment_number} - {self.amount} {self.currency.code}"

    def save(self, *args, **kwargs):
        if not self.payment_number:
            self.payment_number = self.generate_payment_number()
        super().save(*args, **kwargs)

    def generate_payment_number(self):
        """Generate unique payment number"""
        tenant = get_current_tenant()
        if not tenant:
            raise ValueError("No tenant context available")
        
        from django.utils import timezone
        date_str = timezone.now().strftime('%Y%m%d')
        
        # Get last payment number for today
        last_payment = Payment.objects.filter(
            tenant=tenant,
            payment_number__startswith=f'PAY-{date_str}'
        ).order_by('-payment_number').first()
        
        if last_payment:
            try:
                last_seq = int(last_payment.payment_number.split('-')[-1])
                new_seq = last_seq + 1
            except (ValueError, IndexError):
                new_seq = 1
        else:
            new_seq = 1
        
        return f'PAY-{date_str}-{new_seq:04d}'


class Transaction(TenantBaseModel):
    """General ledger transactions"""
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
        ('transfer', 'Transfer'),
        ('adjustment', 'Adjustment'),
    ]
    
    REFERENCE_TYPE_CHOICES = [
        ('sale', 'Sale'),
        ('purchase', 'Purchase'),
        ('expense', 'Expense'),
        ('adjustment', 'Adjustment'),
        ('return', 'Return'),
        ('other', 'Other'),
    ]
    
    PARTY_TYPES = [
        ('customer', 'Customer'),
        ('vendor', 'Vendor'),
        ('employee', 'Employee'),
        ('member', 'Member'),
        ('other', 'Other'),
    ]
    
    transaction_date = models.DateTimeField(default=timezone.now)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    description = models.CharField(max_length=255, null=True, blank=True)
    party_type = models.CharField(max_length=20, choices=PARTY_TYPES, null=True, blank=True)
    party_id = models.PositiveIntegerField(null=True, blank=True)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    reference_type = models.CharField(max_length=50, choices=REFERENCE_TYPE_CHOICES, default="other")
    reference_id = models.PositiveIntegerField(null=True, blank=True)
    cash_drawer = models.ForeignKey(CashDrawer, on_delete=models.SET_NULL, null=True, blank=True)
    created_by_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'transactions'
        indexes = [
            models.Index(fields=['tenant', 'transaction_date']),
            models.Index(fields=['tenant', 'transaction_type']),
            models.Index(fields=['tenant', 'party_type', 'party_id']),
            models.Index(fields=['tenant', 'reference_type', 'reference_id']),
            models.Index(fields=['tenant', 'cash_drawer']),
        ]

    def __str__(self):
        return f"{self.description} - {self.amount} {self.currency.code}"


class ExpenseCategory(TenantBaseModel):
    """Categories for organizing expenses"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    parent_category = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'expense_categories'
        unique_together = ['tenant', 'name', 'parent_category']
        indexes = [
            models.Index(fields=['tenant', 'is_active']),
            models.Index(fields=['tenant', 'parent_category']),
        ]

    def __str__(self):
        if self.parent_category:
            return f"{self.parent_category.name} > {self.name}"
        return self.name

    @property
    def full_path(self):
        """Get full category path"""
        if self.parent_category:
            return f"{self.parent_category.full_path} > {self.name}"
        return self.name


class Expense(TenantBaseModel):
    """Business expense records"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('paid', 'Paid'),
        ('rejected', 'Rejected'),
    ]
    
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('check', 'Check'),
        ('other', 'Other'),
    ]
    
    expense_number = models.CharField(max_length=50, unique=True)
    expense_category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE, related_name='expenses')
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses')
    amount = models.DecimalField(max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    expense_date = models.DateField()
    description = models.TextField(null=True, blank=True)
    receipt_reference = models.CharField(max_length=100, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_expenses')
    created_by_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_expenses')

    class Meta:
        db_table = 'expenses'
        indexes = [
            models.Index(fields=['tenant', 'expense_date']),
            models.Index(fields=['tenant', 'status']),
            models.Index(fields=['tenant', 'expense_category']),
            models.Index(fields=['tenant', 'vendor']),
            models.Index(fields=['expense_number']),
        ]

    def __str__(self):
        return f"{self.expense_number} - {self.description[:50]}"

    def save(self, *args, **kwargs):
        if not self.expense_number:
            self.expense_number = self.generate_expense_number()
        super().save(*args, **kwargs)

    def generate_expense_number(self):
        """Generate unique expense number"""
        tenant = get_current_tenant()
        if not tenant:
            raise ValueError("No tenant context available")
        
        from django.utils import timezone
        date_str = timezone.now().strftime('%Y%m%d')
        
        # Get last expense number for today
        last_expense = Expense.objects.filter(
            tenant=tenant,
            expense_number__startswith=f'EXP-{date_str}'
        ).order_by('-expense_number').first()
        
        if last_expense:
            try:
                last_seq = int(last_expense.expense_number.split('-')[-1])
                new_seq = last_seq + 1
            except (ValueError, IndexError):
                new_seq = 1
        else:
            new_seq = 1
        
        return f'EXP-{date_str}-{new_seq:04d}'


class MonthlyPayment(TenantBaseModel):
    """Recurring monthly payments like rent, utilities, etc."""
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('auto_debit', 'Auto Debit'),
        ('check', 'Check'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    payment_day = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(31)])
    expense_category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE, related_name='monthly_payments')
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True, related_name='monthly_payments')
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'monthly_payments'
        unique_together = ['tenant', 'name']
        indexes = [
            models.Index(fields=['tenant', 'is_active']),
            models.Index(fields=['tenant', 'start_date']),
            models.Index(fields=['tenant', 'payment_day']),
            models.Index(fields=['tenant', 'expense_category']),
        ]

    def __str__(self):
        return f"{self.name} - {self.amount} {self.currency.code}"

    def is_due_for_month(self, year, month):
        """Check if payment is due for given month"""
        from datetime import date
        
        if not self.is_active:
            return False
            
        payment_date = date(year, month, min(self.payment_day, 28))  # Avoid issues with Feb 29/30/31
        
        if payment_date < self.start_date:
            return False
            
        if self.end_date and payment_date > self.end_date:
            return False
            
        return True

    def create_expense_for_month(self, year, month, user=None):
        """Create expense record for this monthly payment"""
        from datetime import date
        
        if not self.is_due_for_month(year, month):
            return None
            
        payment_date = date(year, month, min(self.payment_day, 28))
        
        # Check if expense already exists for this month
        existing_expense = Expense.objects.filter(
            tenant=self.tenant,
            description__contains=f"{self.name} - {year}-{month:02d}",
            expense_date=payment_date
        ).first()
        
        if existing_expense:
            return existing_expense
            
        expense = Expense.objects.create(
            tenant=self.tenant,
            expense_category=self.expense_category,
            vendor=self.vendor,
            amount=self.amount,
            currency=self.currency,
            expense_date=payment_date,
            description=f"{self.name} - {year}-{month:02d}",
            payment_method=self.payment_method,
            status='pending',
            created_by_user=user
        )
        
        return expense



Front End Logic:

import { useState } from "react";
import { Edit, Trash2, XCircle } from "lucide-react";
import RouteBox from "../../../../../components/RouteBox";
import PaymentReceiveForm from "./PaymentReceiveForm";
import type { PaymentReceiveFormData } from "../../../../../schemas/paymentReceiveSchema";
import type { Transaction } from "../../../../../data/transactions";
import { transactions as staticTransactions } from "../../../../../data/transactions"; // <-- Import your static transactions

const initialTransactions: Transaction[] = [];

export default function PaymentsReceive() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const routename = [
    { path: "/finance", name: "Finance" },
    { path: "", name: "Payment & Receive" },
  ];

  const handleFormSubmit = (data: PaymentReceiveFormData) => {
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === editingTransaction.id
            ? {
                ...tx,
                ...data,
                transaction_category:
                  data.transaction_category as Transaction["transaction_category"],
              }
            : tx
        )
      );
      setEditingTransaction(null);
      setIsEditModalOpen(false);
    } else {
      setTransactions((prev) => [
        ...prev,
        {
          ...data,
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          transaction_category:
            data.transaction_category as Transaction["transaction_category"],
        },
      ]);
    }
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== deleteId));
      setDeleteId(null);
      setIsDeleteModalOpen(false);
    }
  };

  // Combine static and local transactions for display
  const allTransactions = [...staticTransactions, ...transactions];

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />

      <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen font-sans">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full mb-8">
          <h2 className="text-3xl font-extrabold  mb-6 text-center bg-gradient-to-r from-blue-600 to-green-200 text-white py-2 rounded-lg shadow-md">
            Add New Payment / Receive
          </h2>
          <PaymentReceiveForm onSubmit={handleFormSubmit} initialData={null} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8  overflow-auto w-96 md:w-full">
          <h2 className="text-3xl font-extrabold  mb-6 text-center bg-gradient-to-r from-blue-500 to-sky-700 p-2 rounded-md text-white">
            Payments & Receives List
          </h2>
          {allTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No Transaction recorded yet.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 whitespace-nowrap">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        tx.type === "pay" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.transaction_category.charAt(0).toUpperCase() +
                        tx.transaction_category.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.transaction_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.amount.toFixed(2)}
                      {tx.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.resources}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.description ? tx.description : "No Description"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingTransaction(tx);
                            setIsEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-2 rounded-full hover:bg-blue-100"
                          title="Edit Transaction"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(tx.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded-full hover:bg-red-100"
                          title="Delete Transaction"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Form Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Edit Payment / Receive
              </h2>
              <PaymentReceiveForm
                onSubmit={handleFormSubmit}
                initialData={editingTransaction}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this transaction?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


// paymentRecieveForm

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import currencies from "../../../../../data/currencies";
import customers from "../../../../../data/customers";
import { members, expenses } from "../../../../../data/payment&recive";
import resources from "../../../../../data/resources";
import type { PaymentReceiveFormData } from "../../../../../schemas/paymentReceiveSchema";
import { paymentReceiveSchema } from "../../../../../schemas/paymentReceiveSchema";
import { FileText } from "lucide-react";
import { initialEmployees } from "../../../../../data/employees";

interface Props {
  initialData?: PaymentReceiveFormData | null;
  onSubmit: (data: PaymentReceiveFormData) => void;
}

export default function PaymentReceiveForm({ initialData, onSubmit }: Props) {
  const [localCategory, setLocalCategory] = useState(
    initialData?.transaction_category || "employees"
  );

  const getOptions = () => {
    switch (localCategory) {
      case "employees":
        return initialEmployees;
      case "members":
        return members;
      case "customers":
        return customers;
      case "expenses":
        return expenses;
      default:
        return [];
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentReceiveFormData>({
    resolver: zodResolver(paymentReceiveSchema),
    defaultValues: initialData || {
      amount: 0,
      currency: "",
      transaction_category: "employees",
      transaction_name: "",
      resources: "",
      type: "pay",
      description: "",
    },
  });

  useEffect(() => {
    reset(
      initialData || {
        amount: 0,
        currency: "",
        transaction_category: "employees",
        transaction_name: "",
        resources: "",
        type: "pay",
        description: "",
      }
    );
    setLocalCategory(initialData?.transaction_category || "employees");
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div>
        <label className="font-medium">Amount</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
      </div>
      <div>
        <label className="font-medium">Currency</label>
        <select
          {...register("currency")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select Currency</option>
          {currencies.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.currency && (
          <p className="text-red-500 text-sm">{errors.currency.message}</p>
        )}
      </div>
      <div>
        <label className="font-medium">Transaction Category</label>
        <select
          {...register("transaction_category", {
            onChange: (e) => setLocalCategory(e.target.value),
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="employees">Employees</option>
          <option value="members">Members</option>
          <option value="customers">Customers</option>
          <option value="expenses">Expenses</option>
        </select>
      </div>
      <div>
        <label className="font-medium">Transaction Name</label>
        <select
          {...register("transaction_name")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select {localCategory}</option>
          {getOptions().map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        {errors.transaction_name && (
          <p className="text-red-500 text-sm">
            {errors.transaction_name.message}
          </p>
        )}
      </div>
      <div>
        <label className="font-medium">Resources</label>
        <select
          {...register("resources")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select resource</option>
          {resources.map((r) => (
            <option key={r.name} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="font-medium">Pay/Receive</label>
        <select
          {...register("type")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="pay">Pay</option>
          <option value="receive">Receive</option>
        </select>
      </div>
      {/* Description */}
      <div className="sm:col-span-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <FileText className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          placeholder="e.g., Monthly salary for employees"
        ></textarea>
      </div>
      <button
        type="submit"
        className="sm:col-span-2 bg-green-600 text-white rounded py-2 font-bold"
      >
        Submit
      </button>
    </form>
  );
}

// PaymentRecieveSchema
import { z } from "zod";

export const paymentReceiveSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  transaction_category: z.string().min(1, "Transaction category is required"),
  transaction_name: z.string().min(1, "Transaction name is required"),
  resources: z.string().min(1, "Resources is required"),
  type: z.enum(["pay", "receive"]),
  description: z.string(),
});

export type PaymentReceiveFormData = z.infer<typeof paymentReceiveSchema>;


// data/transactions.ts
export interface Transaction {
  id: number;
  type: "pay" | "receive";
  transaction_category: "employees" | "members" | "customers" | "expenses";
  transaction_name: string;
  amount: number;
  currency: string;
  date: string;
  resources: string;
  description: string;
}

export const transactions: Transaction[] = [
  {
    id: 1,
    type: "pay",
    transaction_category: "employees",
    transaction_name: "John Smith",
    amount: 1200,
    currency: "USD",
    date: "2023-01-15",
    resources: "Cash Drawer",
    description: "somthing",
  },
  ...



hey bro, is this logic going to be correct