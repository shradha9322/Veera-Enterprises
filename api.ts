const API_BASE = "/api";

export const api = {
  getProducts: () => fetch(`${API_BASE}/products`).then(res => res.json()),
  addProduct: (product: any) => fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  }).then(res => res.json()),
  updateProduct: (id: string, product: any) => fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  }).then(res => res.json()),

  getCustomers: () => fetch(`${API_BASE}/customers`).then(res => res.json()),
  addCustomer: (customer: any) => fetch(`${API_BASE}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer)
  }).then(res => res.json()),
  updateCustomer: (id: string, customer: any) => fetch(`${API_BASE}/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer)
  }).then(res => res.json()),

  getInvoices: () => fetch(`${API_BASE}/invoices`).then(res => res.json()),
  addInvoice: (invoice: any) => fetch(`${API_BASE}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invoice)
  }).then(res => res.json()),

  getStockLogs: () => fetch(`${API_BASE}/stock-logs`).then(res => res.json()),
  addStockLog: (log: any) => fetch(`${API_BASE}/stock-logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log)
  }).then(res => res.json()),

  getServiceRecords: () => fetch(`${API_BASE}/service-records`).then(res => res.json()),
  addServiceRecord: (record: any) => fetch(`${API_BASE}/service-records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record)
  }).then(res => res.json()),

  getSettings: () => fetch(`${API_BASE}/settings`).then(res => res.json()),
  updateSettings: (settings: any) => fetch(`${API_BASE}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings)
  }).then(res => res.json()),

  resetData: () => fetch(`${API_BASE}/reset`, { method: "POST" }).then(res => res.json()),
};
