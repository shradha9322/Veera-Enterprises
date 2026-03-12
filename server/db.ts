import { JSONFilePreset } from 'lowdb/node';
import { Product, Customer, Invoice, StockLog, ServiceRecord, BusinessSettings, UserRole } from '../types.ts';
import { MOCK_PRODUCTS, MOCK_CUSTOMERS, MOCK_INVOICES } from '../data/mockData.ts';

interface Data {
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  stockLogs: StockLog[];
  serviceRecords: ServiceRecord[];
  settings: BusinessSettings;
}

const defaultData: Data = {
  products: MOCK_PRODUCTS,
  customers: MOCK_CUSTOMERS,
  invoices: MOCK_INVOICES,
  stockLogs: [],
  serviceRecords: [
    { id: 's1', customerId: 'c4', customerName: 'Dr. Deshpande Clinic', date: '2024-03-01', type: 'SERVICE', description: 'Regular Filter Replacement', technician: 'Rahul S.', cost: 850, status: 'COMPLETED', nextServiceDueDate: '2024-09-01' }
  ],
  settings: {
    companyName: 'Veera Enterprises',
    gstIn: '27AAECM1234F1Z5',
    address: 'Shop No. 5, Main Market, Kolhapur, Maharashtra 416001',
    phone: '9822001122',
    invoicePrefix: 'VE/',
    defaultGst: 18,
    lowStockAlert: 5
  }
};

export const db = await JSONFilePreset<Data>('db.json', defaultData);
