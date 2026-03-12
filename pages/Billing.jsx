
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Save, 
  Printer, 
  MessageSquare,
  ShoppingBag,
  Ticket,
  Droplets,
  User,
  X
} from 'lucide-react';

const PaymentMode = {
  CASH: "CASH",
  UPI: "UPI",
  CARD: "CARD"
};




const Billing = ({ products, customers, onBillFinalized }) => {
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState(PaymentMode.UPI);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [variantSelectorProduct, setVariantSelectorProduct] = useState(null);

 const addItem = (product, variantId) => {
    if (product.variants && product.variants.length > 0 && !variantId) {
      setVariantSelectorProduct(product);
      return;
    }

    const variant = variantId ? product.variants?.find(v => v.id === variantId) : null;
    const stock = variant ? variant.stock : product.stock;
    if (stock <= 0) return;

    const itemId = variantId ? `${product.id}-${variantId}` : product.id;
    const existing = items.find(i => (variantId ? i.variantId === variantId : i.productId === product.id && !i.variantId));
    
    if (existing) {
      if (existing.quantity >= stock) return;
      setItems(items.map(i => (variantId ? i.variantId === variantId : i.productId === product.id && !i.variantId) ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unitPrice } : i));
    } else {
      const unitPrice = variant 
        ? product.priceRetail + variant.priceRetailAdjustment 
        : product.priceRetail;
      
      setItems([...items, {
        productId: product.id,
        variantId: variantId,
        name: product.name,
        variantName: variant?.name,
        quantity: 1,
        unitPrice: unitPrice,
        gstAmount: (unitPrice * product.gstRate) / 100,
        total: unitPrice
      }]);
    }
    setVariantSelectorProduct(null);
  };

  const removeItem = (productId, variantId) => {
    setItems(items.filter(i => variantId ? i.variantId !== variantId : i.productId !== productId || i.variantId));
  };

  const updateQuantity = (productId, variantId, delta) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const variant = variantId ? product.variants?.find(v => v.id === variantId) : null;
    const stock = variant ? variant.stock : product.stock;

    setItems(prev => prev.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        const newQty = Math.max(1, Math.min(stock, item.quantity + delta));
        return { ...item, quantity: newQty, total: newQty * item.unitPrice };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((acc, curr) => acc + curr.total, 0);
  const gstTotal = items.reduce((acc, curr) => acc + (curr.gstAmount * curr.quantity), 0);
  const grandTotal = subtotal + gstTotal - discount;

  const handleFinalize = () => {
    if (items.length === 0 || !selectedCustomer) return;
    
    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: `VE/${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}/${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      items: [...items],
      subtotal,
      gstTotal,
      discount,
      grandTotal,
      paymentMode,
      type: selectedCustomer.type === 'WHOLESALE' ? 'WHOLESALE' : 'RETAIL'
    };

    onBillFinalized(newInvoice);
    setItems([]);
    setSelectedCustomer(null);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.phone.includes(customerSearch)
  ).slice(0, 5);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

 const shareOnWhatsApp = () => {
  if (!selectedCustomer) {
    alert("Please select a customer first");
    return;
  }

  const phone = `91${selectedCustomer.phone}`;

  const text = `Namaste ${selectedCustomer.name}, your invoice from Veera Enterprises for ₹${grandTotal} is ready. Thank you for your business!`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank");
};

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full relative">
      <div className="xl:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1 block">Search Customer</label>
              {!selectedCustomer ? (
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Name or phone..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-bold"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                </div>
              ) : (
                <div className="bg-blue-50 border-2 border-blue-100 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-black text-sm text-blue-900 leading-none mb-1">{selectedCustomer.name}</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{selectedCustomer.phone} • {selectedCustomer.type}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} className="p-2 text-blue-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <X size={18} />
                  </button>
                </div>
              )}
              {customerSearch && !selectedCustomer && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                  {filteredCustomers.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => { setSelectedCustomer(c); setCustomerSearch(''); }}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between transition-colors border-b border-slate-50"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.phone}</p>
                      </div>
                      <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded">{c.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1 block">Quick Add Product</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="SKU or Name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-bold"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredProducts.slice(0, 4).map(product => (
              <button 
                key={product.id}
                onClick={() => addItem(product)}
                disabled={product.stock <= 0}
                className="p-3 bg-slate-50 rounded-xl border-2 border-transparent hover:border-blue-200 transition-all text-left group disabled:opacity-50"
              >
                <p className="text-[10px] font-bold text-blue-600 mb-0.5">{product.category}</p>
                <p className="text-xs font-bold truncate">{product.name}</p>
                <div className="flex justify-between items-center mt-2">
                   <span className="text-xs font-black">₹{product.priceRetail}</span>
                   <span className="text-[10px] font-black text-slate-400">{product.stock} in stock</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-lg">Invoice Details</h3>
            {selectedCustomer && (
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                <User size={14} /> {selectedCustomer.name} | {selectedCustomer.phone}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[400px]">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <ShoppingBag size={48} className="mx-auto mb-4 text-slate-100" />
                      <p className="text-slate-400 font-medium">Cart is empty. Start adding items.</p>
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-slate-800">{item.name}</p>
                        {item.variantName && <p className="text-[10px] font-bold text-blue-500 uppercase">{item.variantName}</p>}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">₹{item.unitPrice}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 bg-slate-100 w-fit p-1 rounded-lg">
                          <button onClick={() => updateQuantity(item.productId, item.variantId, -1)} className="w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center hover:bg-slate-50 font-bold">-</button>
                          <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.variantId, 1)} className="w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center hover:bg-slate-50 font-bold">+</button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-sm text-blue-600">₹{item.total}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => removeItem(item.productId, item.variantId)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 h-full">
  {/* Order Summary (scrollable) */}
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-y-auto">
    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
      <Ticket className="text-blue-600" size={20} />
      Order Summary
    </h3>

   <div className="space-y-4 mb-8">

  {/* Subtotal */}
  <div className="flex justify-between text-slate-500 font-medium">
    <span>Subtotal</span>
    <span>₹{subtotal.toFixed(2)}</span>
  </div>

  {/* GST */}
  <div className="flex justify-between text-slate-500 font-medium">
    <span>GST Total</span>
    <span>₹{gstTotal.toFixed(2)}</span>
  </div>

  {/* Discount */}
  <div className="flex justify-between items-center text-slate-500 font-medium">
    <span>Discount</span>

    <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
      <span className="text-sm font-bold">₹</span>
      <input
        type="number"
        min="0"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
        className="w-20 bg-transparent outline-none text-right font-bold text-blue-600"
      />
    </div>
  </div>

  <div className="h-px bg-slate-200"></div>

  {/* Grand Total */}
  <div className="flex justify-between items-end">
    <span className="font-bold text-slate-900 text-lg">Grand Total</span>
    <span className="font-black text-3xl text-blue-600">
      ₹{grandTotal.toFixed(2)}
    </span>
  </div>

</div>

    {/* Pay Mode */}
    <div className="mb-8">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pay Mode</p>
      <div className="grid grid-cols-3 gap-2">
        {Object.values(PaymentMode).map((mode) => (
          <button
            key={mode}
            onClick={() => setPaymentMode(mode)}
            className={`py-2 text-[10px] font-black uppercase rounded-xl border-2 transition-all ${
              paymentMode === mode 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                : 'bg-white text-slate-500 border-slate-50 hover:border-slate-200'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>

    {/* Finalize & Save Bill Button */}
    <button 
      onClick={handleFinalize}
      disabled={items.length === 0 || !selectedCustomer}
     className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-110  transition-all active:scale-[0.98]  mb-4"
    >
      Finalize & Save Bill
    </button>

    {/* Print / WhatsApp buttons */}
    <div className="grid grid-cols-2 gap-3 mb-6">
      <button 
        onClick={() => window.print()} 
        className="bg-slate-100 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all border border-slate-200"
      >
        <Printer size={18} /> Print
      </button>
      <button 
        onClick={shareOnWhatsApp} 
        className="bg-emerald-50 text-emerald-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all border border-emerald-100"
      >
        <MessageSquare size={18} /> WhatsApp
      </button>
    </div>
  </div>

  {/* Veera Pro Tips at the bottom */}
  <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
    <Droplets className="absolute -right-4 -bottom-4 text-white opacity-10" size={120} />
    <h4 className="font-black text-lg mb-2">Veera Pro Tips</h4>
    <p className="text-sm text-blue-100 leading-relaxed mb-4">
      Collect <strong>GST Details</strong> for wholesale clients to enable automated GST return-ready invoices.
    </p>
    <button className="text-[10px] font-black uppercase tracking-widest text-blue-200 border-b border-blue-400 pb-1">
      Read Documentation
    </button>
  </div>
</div>

      {isSuccess && (
        <div className="fixed top-24 right-10 bg-emerald-600 text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-right-10 duration-500 z-[100]">
           <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
             <ShoppingBag size={24} />
           </div>
           <div>
              <p className="font-black text-lg">Invoice Finalized!</p>
              <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Stock levels updated instantly</p>
           </div>
        </div>
      )}

      {/* Variant Selector Modal */}
      {variantSelectorProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setVariantSelectorProduct(null)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="font-bold text-lg">Select Variant</h4>
                <p className="text-xs text-slate-500">{variantSelectorProduct.name}</p>
              </div>
              <button onClick={() => setVariantSelectorProduct(null)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-3">
              {variantSelectorProduct.variants?.map(v => (
                <button 
                  key={v.id}
                  onClick={() => addItem(variantSelectorProduct, v.id)}
                  disabled={v.stock <= 0}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-blue-500 transition-all text-left flex items-center justify-between group disabled:opacity-50"
                >
                  <div>
                    <p className="font-bold text-slate-900">{v.name}</p>
                    <p className="text-xs text-slate-500">Stock: {v.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-blue-600">₹{variantSelectorProduct.priceRetail + v.priceRetailAdjustment}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
