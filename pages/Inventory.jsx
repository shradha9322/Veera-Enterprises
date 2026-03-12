
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Box, 
  AlertCircle, 
  Search,
  MoreVertical,
  Scan,
  Download,
  X,
  FileUp,
  AlertOctagon,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Tag,
  IndianRupee

} from 'lucide-react';


const AdjustmentReason = {
  RESTOCK: "RESTOCK",
  DAMAGE: "DAMAGE",
  RETURN: "RETURN",
  SALE: "SALE"
};

const StockCategory = {
  PURIFIER: "PURIFIER",
  FILTER: "FILTER",
  ACCESSORY: "ACCESSORY"
};
// import { api } from '../api';


const Inventory = ({ products, setProducts, logs, setLogs }) => {
  const [activeTab, setActiveTab] = useState('STOCK');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const [adjustmentType, setAdjustmentType] = useState('ADD');
  const [adjAmount, setAdjAmount] = useState(0);
  const [adjReason, setAdjReason] = useState('RESTOCK');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: '',
    category: StockCategory.PURIFIER,
    priceRetail: 0,
    priceWholesale: 0,
    stock: 0,
    lowStockThreshold: 5,
    gstRate: 18,
    variants:[]
  });

  const addVariantToForm = () => {
    setNewProd({
      ...newProd,
      variants: [...newProd.variants, { name: '', priceRetailAdjustment: 0, priceWholesaleAdjustment: 0, stock: 0 }]
    });
  };

  const removeVariantFromForm = (index) => {
    setNewProd({
      ...newProd,
      variants: newProd.variants.filter((_, i) => i !== index)
    });
  };

  const updateVariantInForm = (index, field, value) => {
    const updatedVariants = [...newProd.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setNewProd({ ...newProd, variants: updatedVariants });
  };

  // Bulk import state
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkStatus, setBulkStatus] = useState({});
  const fileInputRef = useRef(null);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const product = {
      ...newProd,
      id: `p${Date.now()}`,
      variants: newProd.variants.length > 0 ? newProd.variants.map((v, i) => ({ ...v, id: `v${Date.now()}-${i}` })) : undefined
    };
    await api.addProduct(product);
    await setProducts(null);
    setIsAddModalOpen(false);
    setNewProd({
      name: '',
      category: StockCategory.PURIFIER,
      priceRetail: 0,
      priceWholesale: 0,
      stock: 0,
      lowStockThreshold: 5,
      gstRate: 18,
      variants: []
    });
  };

  const handleAdjustStock = async () => {
    if (!selectedProduct || adjAmount <= 0) return;

    let updatedProduct = { ...selectedProduct };
    if (selectedVariantId && updatedProduct.variants) {
      updatedProduct.variants = updatedProduct.variants.map(v => {
        if (v.id === selectedVariantId) {
          const newStock = adjustmentType === 'ADD' 
            ? v.stock + adjAmount 
            : Math.max(0, v.stock - adjAmount);
          return { ...v, stock: newStock };
        }
        return v;
      });
      // Update total stock based on variants
      updatedProduct.stock = updatedProduct.variants.reduce((sum, v) => sum + v.stock, 0);
    } else {
      const newStock = adjustmentType === 'ADD' 
        ? updatedProduct.stock + adjAmount 
        : Math.max(0, updatedProduct.stock - adjAmount);
      updatedProduct.stock = newStock;
    }

    const variant = selectedProduct.variants?.find(v => v.id === selectedVariantId);

    const newLog = {
      id: `l${Date.now()}`,
      productId: selectedProduct.id,
      variantId: selectedVariantId || undefined,
      productName: selectedProduct.name,
      variantName: variant?.name,
      type: adjustmentType,
      quantity: adjAmount,
      reason: adjReason,
      timestamp: new Date().toLocaleString(),
      user: 'Admin'
    };

    await api.updateProduct(selectedProduct.id, updatedProduct);
    await api.addStockLog(newLog);
    
    await setProducts(null);
    await setLogs(null);
    
    setIsAdjustModalOpen(false);
    setSelectedProduct(null);
    setSelectedVariantId('');
    setAdjAmount(0);
  };

  const handleScanSimulation = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      setSelectedProduct(randomProduct);
      setAdjustmentType('ADD');
      setIsScanning(false);
      setIsAdjustModalOpen(true);
    }, 1500);
  };

  const downloadTemplate = () => {
    const headers = 'productId,quantity,reason\n';
    const sampleRows = '1,10,RESTOCK\n2,-5,DAMAGE\n3,100,RESTOCK';
    const blob = new Blob([headers + sampleRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'veera_inventory_bulk_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const processBulkImport = async () => {
    if (!bulkFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result ;
      const lines = text.split('\n');
      const updatedProducts = [...products];
      let successCount = 0;
      let errorCount = 0;
      const newLogs = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const [id, qty, reason] = line.split(',');
        const productIndex = updatedProducts.findIndex(p => p.id === id.trim());
        const amount = parseInt(qty?.trim());
        if (productIndex !== -1 && !isNaN(amount)) {
          const p = updatedProducts[productIndex];
          updatedProducts[productIndex] = { ...p, stock: Math.max(0, p.stock + amount) };
          newLogs.push({
            id: `l${Date.now()}-${successCount}`,
            productId: p.id,
            productName: p.name,
            type: amount >= 0 ? 'ADD' : 'REMOVE',
            quantity: Math.abs(amount),
            reason: (reason?.trim() ) || AdjustmentReason.RESTOCK,
            timestamp: new Date().toLocaleString(),
            user: 'Admin (Bulk)'
          });
          successCount++;
        } else { errorCount++; }
      }
      setProducts(updatedProducts);
      setLogs(prev => [...newLogs, ...prev]);
      setBulkStatus({ success: `Updated ${successCount} items.` });
      setTimeout(() => { setIsBulkModalOpen(false); setBulkFile(null); setBulkStatus({}); }, 2000);
    };
    reader.readAsText(bulkFile);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards (Simplified) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <Box className="absolute -right-2 -bottom-2 opacity-10" size={80} />
          <p className="text-blue-100 text-xs font-bold uppercase mb-1">Total SKU</p>
          <p className="text-3xl font-black">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Low Stock</p>
          <p className="text-3xl font-black text-amber-500">{products.filter(p => p.stock <= p.lowStockThreshold).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-lg">Inventory Tracking</h3>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setActiveTab('STOCK')} className={`px-4 py-1.5 text-xs font-bold rounded ${activeTab === 'STOCK' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Current Stock</button>
              <button onClick={() => setActiveTab('LOGS')} className={`px-4 py-1.5 text-xs font-bold rounded ${activeTab === 'LOGS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Audit Logs</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <input type="text" placeholder="Search products..." className="pl-4 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm md:w-64 focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button onClick={() => setIsBulkModalOpen(true)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-200 border border-slate-200"><Download size={18} /> Bulk</button>
            <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md active:scale-95"><Plus size={18} /> Add Product</button>
          </div>
        </div>
        
        {activeTab === 'STOCK' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Prices</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map(product => (
                  <React.Fragment key={product.id}>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{product.category}</p>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-700">{product.stock}</td>
                      <td className="px-6 py-4 text-xs">
                        <p className="font-bold text-blue-600">R: ₹{product.priceRetail}</p>
                        <p className="text-slate-400">W: ₹{product.priceWholesale}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${product.stock <= product.lowStockThreshold ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {product.stock <= product.lowStockThreshold ? 'Low' : 'OK'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => { setSelectedProduct(product); setSelectedVariantId(''); setAdjustmentType('ADD'); setIsAdjustModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><ArrowUpRight size={18} /></button>
                        <button onClick={() => { setSelectedProduct(product); setSelectedVariantId(''); setAdjustmentType('REMOVE'); setIsAdjustModalOpen(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded ml-1"><ArrowDownLeft size={18} /></button>
                      </td>
                    </tr>
                    {product.variants?.map(variant => (
                      <tr key={variant.id} className="bg-slate-50/50 text-xs">
                        <td className="px-6 py-2 pl-12">
                          <p className="text-slate-500 flex items-center gap-2">
                            <Tag size={12} className="text-slate-400" />
                            {variant.name}
                          </p>
                        </td>
                        <td className="px-6 py-2 font-bold text-slate-500">{variant.stock}</td>
                        <td className="px-6 py-2 text-[10px]">
                          <p className="text-blue-400">R: ₹{product.priceRetail + variant.priceRetailAdjustment}</p>
                          <p className="text-slate-400">W: ₹{product.priceWholesale + variant.priceWholesaleAdjustment}</p>
                        </td>
                        <td className="px-6 py-2"></td>
                        <td className="px-6 py-2">
                          <button onClick={() => { setSelectedProduct(product); setSelectedVariantId(variant.id); setAdjustmentType('ADD'); setIsAdjustModalOpen(true); }} className="p-1 text-blue-400 hover:bg-blue-50 rounded"><ArrowUpRight size={14} /></button>
                          <button onClick={() => { setSelectedProduct(product); setSelectedVariantId(variant.id); setAdjustmentType('REMOVE'); setIsAdjustModalOpen(true); }} className="p-1 text-red-400 hover:bg-red-50 rounded ml-1"><ArrowDownLeft size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="px-6 py-4">Date</th><th className="px-6 py-4">Product</th><th className="px-6 py-4">Qty</th><th className="px-6 py-4">Reason</th></tr>
              </thead>
              <tbody className="divide-y">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 text-sm">
                    <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                    <td className="px-6 py-4 font-bold">{log.productName}</td>
                    <td className="px-6 py-4 font-black">{log.type === 'ADD' ? '+' : '-'}{log.quantity}</td>
                    <td className="px-6 py-4 text-xs font-bold uppercase text-slate-400">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-600 rounded-xl text-white"><LayoutGrid size={24} /></div>
                 <h4 className="font-bold text-lg">Add New Product to Inventory</h4>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Product Name</label>
                  <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
                  <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold" value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value })}>
                    {Object.values(StockCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Retail Price</label>
                  <div className="relative"><IndianRupee className="absolute left-3 top-3 text-slate-300" size={16} /><input type="number" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-9 pr-4 py-3 font-bold" value={newProd.priceRetail || ''} onChange={e => setNewProd({...newProd, priceRetail: Number(e.target.value)})} /></div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Wholesale Price</label>
                  <div className="relative"><IndianRupee className="absolute left-3 top-3 text-slate-300" size={16} /><input type="number" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-9 pr-4 py-3 font-bold" value={newProd.priceWholesale || ''} onChange={e => setNewProd({...newProd, priceWholesale: Number(e.target.value)})} /></div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">GST Rate (%)</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold" value={newProd.gstRate} onChange={e => setNewProd({...newProd, gstRate: Number(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Initial Stock</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold" value={newProd.stock || ''} onChange={e => setNewProd({...newProd, stock: Number(e.target.value)})} disabled={newProd.variants.length > 0} />
                  {newProd.variants.length > 0 && <p className="text-[10px] text-slate-400 mt-1">Stock is managed via variants</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Low Stock Threshold</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold" value={newProd.lowStockThreshold} onChange={e => setNewProd({...newProd, lowStockThreshold: Number(e.target.value)})} />
                </div>
              </div>

              {/* Variants Section */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-black uppercase tracking-widest text-slate-600">Product Variants</h5>
                  <button type="button" onClick={addVariantToForm} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700">
                    <Plus size={14} /> Add Variant
                  </button>
                </div>
                
                {newProd.variants.map((v, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4 relative">
                    <button type="button" onClick={() => removeVariantFromForm(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500">
                      <X size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Variant Name (e.g. Red)</label>
                        <input required className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" value={v.name} onChange={e => updateVariantInForm(idx, 'name', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Initial Stock</label>
                        <input type="number" required className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" value={v.stock || ''} onChange={e => updateVariantInForm(idx, 'stock', Number(e.target.value))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Retail Price Adj.</label>
                        <input type="number" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" value={v.priceRetailAdjustment} onChange={e => updateVariantInForm(idx, 'priceRetailAdjustment', Number(e.target.value))} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Wholesale Price Adj.</label>
                        <input type="number" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" value={v.priceWholesaleAdjustment} onChange={e => updateVariantInForm(idx, 'priceWholesaleAdjustment', Number(e.target.value))} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl">Complete Setup</button>
            </form>
          </div>
        </div>
      )}

      {/* Adjustment Modal (Existing logic kept) */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setIsAdjustModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
             <div className="p-6 bg-slate-50 border-b flex justify-between"><div><h4 className="font-bold">Adjust Stock</h4><p className="text-xs text-slate-500">{selectedProduct.name}</p></div><button onClick={() => setIsAdjustModalOpen(false)}><X size={20} /></button></div>
              <div className="p-6 space-y-4">
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Select Variant</label>
                    <select 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold"
                      value={selectedVariantId}
                      onChange={e => setSelectedVariantId(e.target.value)}
                    >
                      <option value="">Select a variant...</option>
                      {selectedProduct.variants.map(v => (
                        <option key={v.id} value={v.id}>{v.name} (Stock: {v.stock})</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex gap-2"><button onClick={() => setAdjustmentType('ADD')} className={`flex-1 py-3 rounded-xl font-bold ${adjustmentType === 'ADD' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>Stock IN</button>
                <button onClick={() => setAdjustmentType('REMOVE')} className={`flex-1 py-3 rounded-xl font-bold ${adjustmentType === 'REMOVE' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>Stock OUT</button></div>
                <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold" placeholder="Quantity" value={adjAmount || ''} onChange={e => setAdjAmount(Number(e.target.value))} />
                <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold" value={adjReason} onChange={e => setAdjReason(e.target.value )}>{Object.values(AdjustmentReason).map(r => <option key={r} value={r}>{r}</option>)}</select>
                <button onClick={handleAdjustStock} disabled={selectedProduct.variants && selectedProduct.variants.length > 0 && !selectedVariantId} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black disabled:opacity-50">Confirm Update</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
