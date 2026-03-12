
import React, { useState } from 'react';
import { 
  Save, 
  Building2, 
  Receipt, 
  Database, 
  AlertTriangle, 
  Download, 
  Trash2, 
  RefreshCcw,
  CheckCircle2,
  Info
} from 'lucide-react';


// import { api } from '../api';


const Settings = ({ settings, setSettings, onReset }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setSettings(localSettings);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const exportData = async () => {
    const [p, c, i, s] = await Promise.all([
      api.getProducts(),
      api.getCustomers(),
      api.getInvoices(),
      api.getSettings()
    ]);
    const data = {
      products: p,
      customers: c,
      invoices: i,
      settings: s
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veera_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-slate-500 text-sm">Configure your business identity and application behavior</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Save size={18} /> Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Profile */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-50 pb-3 mb-2">
            <Building2 size={20} className="text-blue-600" />
            Business Profile
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Company Name</label>
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-sm" 
                value={localSettings.companyName}
                onChange={e => setLocalSettings({...localSettings, companyName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">GST Number</label>
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-sm" 
                value={localSettings.gstIn}
                onChange={e => setLocalSettings({...localSettings, gstIn: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Address</label>
              <textarea 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-sm h-20" 
                value={localSettings.address}
                onChange={e => setLocalSettings({...localSettings, address: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Billing Preferences */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-50 pb-3 mb-2">
            <Receipt size={20} className="text-emerald-600" />
            Invoice & Billing
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Invoice Prefix</label>
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-sm" 
                value={localSettings.invoicePrefix}
                placeholder="e.g. VE/"
                onChange={e => setLocalSettings({...localSettings, invoicePrefix: e.target.value})}
              />
              <p className="text-[9px] text-slate-400 mt-1 italic">Preview: {localSettings.invoicePrefix}2024-001</p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Default GST Rate (%)</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-sm" 
                value={localSettings.defaultGst}
                onChange={e => setLocalSettings({...localSettings, defaultGst: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Low Stock Threshold</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-sm" 
                value={localSettings.lowStockAlert}
                onChange={e => setLocalSettings({...localSettings, lowStockAlert: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data & Backup */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4">
          <Database size={20} className="text-indigo-600" />
          Data Governance
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={exportData}
            className="flex-1 flex items-center justify-between p-4 rounded-xl border-2 border-slate-50 hover:border-indigo-100 hover:bg-indigo-50 transition-all text-left"
          >
            <div>
              <p className="font-bold text-slate-800 text-sm">Download Backup</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Full JSON data export</p>
            </div>
            <Download size={20} className="text-indigo-500" />
          </button>
          
          <button 
            className="flex-1 flex items-center justify-between p-4 rounded-xl border-2 border-slate-50 hover:border-blue-100 hover:bg-blue-50 transition-all text-left"
          >
            <div>
              <p className="font-bold text-slate-800 text-sm">Restore Data</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Upload from .json file</p>
            </div>
            <RefreshCcw size={20} className="text-blue-500" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 space-y-4">
        <div className="flex items-center gap-2 font-bold text-red-700">
          <AlertTriangle size={20} />
          Danger Zone
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-red-900">Factory Reset Application</p>
            <p className="text-xs text-red-600">This will permanently delete all customers, stock logs, products, and invoices. This action cannot be undone.</p>
          </div>
          <button 
            onClick={() => {
              if (confirm('Are you absolutely sure? This will delete EVERYTHING.')) {
                onReset();
              }
            }}
            className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200"
          >
            <Trash2 size={18} /> Reset All Data
          </button>
        </div>
      </div>

      <div className="text-center py-6 text-slate-400">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest mb-1">
          <Info size={14} />
          Application Details
        </div>
        <p className="text-[10px]">Version 2.8.5-pro • Build 2024.05 • Veera Enterprise Management</p>
      </div>

      {showSaved && (
        <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 size={24} />
          <span className="font-bold">Settings Saved Successfully!</span>
        </div>
      )}
    </div>
  );
};

export default Settings;
