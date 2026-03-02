
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  DEALER = 'DEALER'
}

export enum CustomerType {
  RETAIL = 'RETAIL',
  WHOLESALE = 'WHOLESALE',
  AMC = 'AMC'
}

export enum PaymentMode {
  CASH = 'CASH',
  UPI = 'UPI',
  CARD = 'CARD',
  NEFT = 'NEFT'
}

export enum StockCategory {
  PURIFIER = 'PURIFIER',
  SPARE = 'SPARE',
  FILTER = 'FILTER',
  ACCESSORY = 'ACCESSORY'
}

export enum AdjustmentReason {
  RESTOCK = 'RESTOCK',
  DAMAGE = 'DAMAGE',
  RETURN = 'RETURN',
  SALE = 'SALE',
  CORRECTION = 'CORRECTION'
}

export interface BusinessSettings {
  companyName: string;
  gstIn: string;
  address: string;
  phone: string;
  invoicePrefix: string;
  defaultGst: number;
  lowStockAlert: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Red", "Large", "Blue"
  priceRetailAdjustment: number; // Adjustment to base price
  priceWholesaleAdjustment: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: StockCategory;
  priceRetail: number;
  priceWholesale: number;
  stock: number;
  lowStockThreshold: number;
  gstRate: number;
  variants?: ProductVariant[];
}

export interface StockLog {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  type: 'ADD' | 'REMOVE';
  quantity: number;
  reason: AdjustmentReason;
  timestamp: string;
  user: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  type: CustomerType;
  address: string;
  region: 'KOLHAPUR' | 'MAHARASHTRA' | 'KARNATAKA' | 'GOA';
  gstIn?: string;
  totalPurchase: number;
  outstanding: number;
  lastServiceDate?: string;
  amcExpiry?: string;
}

export interface InvoiceItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  gstAmount: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: InvoiceItem[];
  subtotal: number;
  gstTotal: number;
  discount: number;
  grandTotal: number;
  paymentMode: PaymentMode;
  type: 'RETAIL' | 'WHOLESALE';
}

export interface ServiceRecord {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  type: 'INSTALLATION' | 'SERVICE' | 'REPAIR';
  description: string;
  technician: string;
  cost: number;
  status: 'COMPLETED' | 'PENDING' | 'SCHEDULED';
  nextServiceDueDate: string;
}
