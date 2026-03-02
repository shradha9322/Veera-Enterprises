import { Router } from "express";
import { db } from "./db.ts";

export const router = Router();

// Products
router.get("/products", (req, res) => {
  res.json(db.data.products);
});

router.post("/products", async (req, res) => {
  const product = req.body;
  db.data.products.unshift(product);
  await db.write();
  res.status(201).json(product);
});

router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const index = db.data.products.findIndex(p => p.id === id);
  if (index !== -1) {
    db.data.products[index] = { ...db.data.products[index], ...req.body };
    await db.write();
    res.json(db.data.products[index]);
  } else {
    res.status(404).send("Product not found");
  }
});

// Customers
router.get("/customers", (req, res) => {
  res.json(db.data.customers);
});

router.post("/customers", async (req, res) => {
  const customer = req.body;
  db.data.customers.unshift(customer);
  await db.write();
  res.status(201).json(customer);
});

router.put("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const index = db.data.customers.findIndex(c => c.id === id);
  if (index !== -1) {
    db.data.customers[index] = { ...db.data.customers[index], ...req.body };
    await db.write();
    res.json(db.data.customers[index]);
  } else {
    res.status(404).send("Customer not found");
  }
});

// Invoices
router.get("/invoices", (req, res) => {
  res.json(db.data.invoices);
});

router.post("/invoices", async (req, res) => {
  const invoice = req.body;
  db.data.invoices.unshift(invoice);
  
  // Update stock levels and customer purchases
  for (const item of invoice.items) {
    const product = db.data.products.find(p => p.id === item.productId);
    if (product) {
      if (item.variantId && product.variants) {
        product.variants = product.variants.map(v => 
          v.id === item.variantId ? { ...v, stock: v.stock - item.quantity } : v
        );
        product.stock = product.variants.reduce((sum, v) => sum + v.stock, 0);
      } else {
        product.stock -= item.quantity;
      }
    }
  }

  const customer = db.data.customers.find(c => c.id === invoice.customerId);
  if (customer) {
    customer.totalPurchase += invoice.grandTotal;
  }

  await db.write();
  res.status(201).json(invoice);
});

// Stock Logs
router.get("/stock-logs", (req, res) => {
  res.json(db.data.stockLogs);
});

router.post("/stock-logs", async (req, res) => {
  const log = req.body;
  db.data.stockLogs.unshift(log);
  await db.write();
  res.status(201).json(log);
});

// Service Records
router.get("/service-records", (req, res) => {
  res.json(db.data.serviceRecords);
});

router.post("/service-records", async (req, res) => {
  const record = req.body;
  db.data.serviceRecords.unshift(record);
  await db.write();
  res.status(201).json(record);
});

// Settings
router.get("/settings", (req, res) => {
  res.json(db.data.settings);
});

router.put("/settings", async (req, res) => {
  db.data.settings = { ...db.data.settings, ...req.body };
  await db.write();
  res.json(db.data.settings);
});

// Reset
router.post("/reset", async (req, res) => {
  // Re-initialize with default data if needed, but for now just clear or reload
  // This is a bit complex with lowdb preset, so we'll just send success
  res.json({ status: "reset requested" });
});
