import React, { useState, useEffect } from "react";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Billing from "./pages/Billing.jsx";
import Customers from "./pages/Customers.jsx";
import Inventory from "./pages/Inventory.jsx";
import Service from "./pages/Service.jsx";
import Dealers from "./pages/Dealers.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import Login from "./pages/Login.jsx";
import Quotation from "./pages/Quotation.jsx";
import "./index.css";

// import { api } from './api';

const DEFAULT_SETTINGS = {
  companyName: "Veera Enterprises",
  gstIn: "27AAECM1234F1Z5",
  address: "Shop No. 5, Main Market, Kolhapur, Maharashtra 416001",
  phone: "9822001122",
  invoicePrefix: "VE/",
  defaultGst: 18,
  lowStockAlert: 5,
};



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState("ADMIN");
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [products, setProducts] = useState(() => {
  const savedProducts = localStorage.getItem("products");
  return savedProducts ? JSON.parse(savedProducts) : [];
});
  const [customers, setCustomers] = useState(() => {
  const saved = localStorage.getItem("customers");
  return saved ? JSON.parse(saved) : [];
});
  const [invoices, setInvoices] = useState([]);
  const [stockLogs, setStockLogs] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);

  const [quotations, setQuotations] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
  localStorage.setItem("customers", JSON.stringify(customers));
}, [customers]);


useEffect(() => {
  localStorage.setItem("products", JSON.stringify(products));
}, [products]);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

const handleReset = () => {
  setProducts([]);
  setCustomers([]);
  setInvoices([]);
  setStockLogs([]);
  setServiceRecords([]);
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
      case "dashboard":
        return (
          <Dashboard
            products={products}
            invoices={invoices}
            customers={customers}
              quotations={quotations}
            setCurrentPage={setCurrentPage}
          />
        );

      case "billing":
        return (
          <Billing
            products={products}
            customers={customers}
            onBillFinalized={async (newInvoice) => {
              setInvoices((prev) => [newInvoice, ...prev]);

              const newLogs = newInvoice.items.map((item, idx) => ({
                id: `l-sale-${Date.now()}-${idx}`,
                productId: item.productId,
                variantId: item.variantId,
                productName: item.name,
                variantName: item.variantName,
                type: "REMOVE",
                quantity: item.quantity,
                reason: "SALE",
                timestamp: new Date().toLocaleString(),
                user: "System (Sale)",
              }));

           setStockLogs((prev) => [...newLogs, ...prev]);
            }}
          />
        );

      case "customers":
        return (
         <Customers
  customers={customers}
  setCustomers={setCustomers}
/>
        );

      case "inventory":
        return (
         <Inventory
  products={products}
  setProducts={setProducts}
  logs={stockLogs}
  setLogs={setStockLogs}
/>
        );

      case "quotations":
        return (
          <Quotation
            selectedClient={selectedClient}
            setCurrentPage={setCurrentPage}
          />
        );

      case "service":
        return (
          <Service
  records={serviceRecords}
  setRecords={setServiceRecords}
  customers={customers}
/>
        );

      case "dealers":
        return (
          <Dealers
  customers={customers}
  invoices={invoices}
  setCustomers={setCustomers}
/>
        );

      case "reports":
        return (
          <Reports
            invoices={invoices}
            products={products}
            customers={customers}
          />
        );

      case "settings":
        return (
          <Settings
            settings={settings}
          setSettings={(s) => setSettings(s)}
           
            onReset={handleReset}
          />
        );

      default:
        return (
          <Dashboard
            products={products}
            invoices={invoices}
            customers={customers}
            setCurrentPage={setCurrentPage}
          />
        );
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
