
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Service from './pages/Service';
import Dealers from './pages/Dealers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { Product, StockLog, Customer, Invoice, ServiceRecord, UserRole, BusinessSettings } from './types';
import { api } from './api.ts';

const DEFAULT_SETTINGS: BusinessSettings = {
  companyName: 'Veera Enterprises',
  gstIn: '27AAECM1234F1Z5',
  address: 'Shop No. 5, Main Market, Kolhapur, Maharashtra 416001',
  phone: '9822001122',
  invoicePrefix: 'VE/',
  defaultGst: 18,
  lowStockAlert: 5
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, p, c, i, sl, sr] = await Promise.all([
          api.getSettings(),
          api.getProducts(),
          api.getCustomers(),
          api.getInvoices(),
          api.getStockLogs(),
          api.getServiceRecords()
        ]);
        setSettings(s);
        setProducts(p);
        setCustomers(c);
        setInvoices(i);
        setStockLogs(sl);
        setServiceRecords(sr);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleReset = async () => {
    await api.resetData();
    window.location.reload();
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-slate-600">Loading Veera CRM...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': 
        return <Dashboard products={products} invoices={invoices} customers={customers} setCurrentPage={setCurrentPage} />;
      case 'billing': 
        return <Billing 
          products={products} 
          customers={customers}
          onBillFinalized={async (newInvoice) => {
            const savedInvoice = await api.addInvoice(newInvoice);
            setInvoices(prev => [savedInvoice, ...prev]);
            
            // Generate Audit Logs for the Sale
            const newLogs: StockLog[] = newInvoice.items.map((item, idx) => ({
              id: `l-sale-${Date.now()}-${idx}`,
              productId: item.productId,
              variantId: item.variantId,
              productName: item.name,
              variantName: item.variantName,
              type: 'REMOVE',
              quantity: item.quantity,
              reason: 'SALE' as any,
              timestamp: new Date().toLocaleString(),
              user: 'System (Sale)'
            }));
            
            for (const log of newLogs) {
              await api.addStockLog(log);
            }

            // Refresh data to ensure sync
            const [p, c, sl] = await Promise.all([
              api.getProducts(),
              api.getCustomers(),
              api.getStockLogs()
            ]);
            setProducts(p);
            setCustomers(c);
            setStockLogs(sl);
          }} 
        />;
      case 'customers': 
        return <Customers customers={customers} setCustomers={async (val) => {
          // This is a bit tricky because setCustomers is usually a state setter
          // In a real app, we'd handle the add/update inside the component and call API
          // For now, we'll let the component handle its internal state and we'll refresh
          const updated = await api.getCustomers();
          setCustomers(updated);
        }} />;
      case 'inventory': 
        return <Inventory 
          products={products} 
          setProducts={async (val) => {
            const updated = await api.getProducts();
            setProducts(updated);
          }} 
          logs={stockLogs} 
          setLogs={async (val) => {
            const updated = await api.getStockLogs();
            setStockLogs(updated);
          }} 
        />;
      case 'service': 
        return <Service records={serviceRecords} setRecords={async (val) => {
          const updated = await api.getServiceRecords();
          setServiceRecords(updated);
        }} customers={customers} />;
      case 'dealers': 
        return <Dealers customers={customers} invoices={invoices} setCustomers={async (val) => {
          const updated = await api.getCustomers();
          setCustomers(updated);
        }} />;
      case 'reports': 
        return <Reports invoices={invoices} products={products} customers={customers} />;
      case 'settings':
        return <Settings settings={settings} setSettings={async (s) => {
          const updated = await api.updateSettings(s);
          setSettings(updated);
        }} onReset={handleReset} />;
      default: return <Dashboard products={products} invoices={invoices} customers={customers} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} userRole={userRole}>
      {renderPage()}
    </Layout>
  );
};

export default App;
