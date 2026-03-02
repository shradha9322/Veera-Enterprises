
import { Product, StockCategory, Customer, CustomerType, Invoice, PaymentMode } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'AquaPure RO+UV 12L', 
    category: StockCategory.PURIFIER, 
    priceRetail: 12500, 
    priceWholesale: 9500, 
    stock: 15, 
    lowStockThreshold: 5, 
    gstRate: 18,
    variants: [
      { id: 'v1', name: 'Standard White', priceRetailAdjustment: 0, priceWholesaleAdjustment: 0, stock: 10 },
      { id: 'v2', name: 'Premium Black', priceRetailAdjustment: 500, priceWholesaleAdjustment: 300, stock: 5 }
    ]
  },
  { id: '2', name: 'Sediment Filter 10"', category: StockCategory.FILTER, priceRetail: 350, priceWholesale: 180, stock: 120, lowStockThreshold: 50, gstRate: 12 },
  { id: '3', name: 'Carbon Filter 10"', category: StockCategory.FILTER, priceRetail: 450, priceWholesale: 220, stock: 85, lowStockThreshold: 40, gstRate: 12 },
  { id: '4', name: 'RO Membrane 75 GPD', category: StockCategory.SPARE, priceRetail: 1800, priceWholesale: 1100, stock: 45, lowStockThreshold: 20, gstRate: 18 },
  { id: '5', name: 'Booster Pump 75 GPD', category: StockCategory.SPARE, priceRetail: 2200, priceWholesale: 1600, stock: 8, lowStockThreshold: 10, gstRate: 18 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  // Fixed: Added missing 'region' property
  { id: 'c1', name: 'Amit Patil', phone: '9822001122', type: CustomerType.RETAIL, address: 'Rajarampuri, Kolhapur', region: 'KOLHAPUR', totalPurchase: 12500, outstanding: 0, lastServiceDate: '2023-11-15' },
  // Fixed: Added missing 'region' property
  { id: 'c2', name: 'Maharashtra Water Solutions', phone: '7020304050', type: CustomerType.WHOLESALE, address: 'Pune Highway, Sangli', region: 'MAHARASHTRA', gstIn: '27AAECM1234F1Z5', totalPurchase: 145000, outstanding: 25000 },
  // Fixed: Added missing 'region' property
  { id: 'c3', name: 'Sagar Enterprises', phone: '8800991122', type: CustomerType.WHOLESALE, address: 'Belgaum, Karnataka', region: 'KARNATAKA', totalPurchase: 85000, outstanding: 12000 },
  // Fixed: Added missing 'region' property
  { id: 'c4', name: 'Dr. Deshpande Clinic', phone: '9146637761', type: CustomerType.AMC, address: 'Pachgaon, Kolhapur', region: 'KOLHAPUR', amcExpiry: '2025-05-20', totalPurchase: 5500, outstanding: 0 },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv1',
    invoiceNo: 'VE/23-24/1001',
    date: '2024-03-01',
    customerId: 'c1',
    customerName: 'Amit Patil',
    // Fixed: Added missing 'customerPhone' property
    customerPhone: '9822001122',
    items: [{ productId: '1', name: 'AquaPure RO+UV 12L', quantity: 1, unitPrice: 12500, gstAmount: 2250, total: 14750 }],
    subtotal: 12500,
    gstTotal: 2250,
    discount: 500,
    grandTotal: 14250,
    paymentMode: PaymentMode.UPI,
    type: 'RETAIL'
  },
];
