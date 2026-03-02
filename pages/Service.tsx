
import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Wrench, 
  Plus, 
  X,
  User,
  IndianRupee,
  Clock,
  ShieldAlert,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { ServiceRecord, Customer, CustomerType } from '../types';
import { api } from '../api.ts';

interface ServiceProps {
  records: ServiceRecord[];
  setRecords: (val: any) => Promise<void>;
  customers: Customer[];
}

const Service: React.FC<ServiceProps> = ({ records, setRecords, customers }) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [newRecord, setNewRecord] = useState<Omit<ServiceRecord, 'id' | 'customerId' | 'customerName'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'SERVICE',
    description: '',
    technician: '',
    cost: 0,
    status: 'COMPLETED',
    nextServiceDueDate: ''
  });

  const handleLogService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const record: ServiceRecord = {
      ...newRecord,
      id: `s${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name
    };

    await api.addServiceRecord(record);
    await setRecords(null);
    setIsAddModalOpen(false);
    setSelectedCustomer(null);
    setNewRecord({ date: new Date().toISOString().split('T')[0], type: 'SERVICE', description: '', technician: '', cost: 0, status: 'COMPLETED', nextServiceDueDate: '' });
  };

  const amcCustomers = customers.filter(c => c.type === CustomerType.AMC);
  const expiringAMC = amcCustomers.filter(c => {
    if (!c.amcExpiry) return false;
    const expiryDate = new Date(c.amcExpiry);
    const today = new Date();
    const diff = expiryDate.getTime() - today.getTime();
    return diff < (30 * 24 * 60 * 60 * 1000);
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch)
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service & AMC Hub</h2>
          <p className="text-slate-500 text-sm">Maintenance cycles and technician efficiency</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all active:scale-95"
        >
          <Plus size={20} />
          Log Service Visit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldAlert className="text-amber-500" size={20} /> AMC Renewal Alerts</h3>
            <div className="space-y-4">
              {expiringAMC.map(c => (
                <div key={c.id} className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex justify-between items-start mb-1"><p className="font-bold text-sm text-amber-900">{c.name}</p><span className="text-[10px] font-black text-amber-600 uppercase">Expiring</span></div>
                  <p className="text-xs text-amber-700">Expiry: {c.amcExpiry}</p>
                </div>
              ))}
              {expiringAMC.length === 0 && <p className="text-center text-slate-400 text-xs py-4">All AMCs healthy.</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between"><h3 className="font-bold">Recent History</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="px-6 py-4">Date</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Status</th><th className="px-6 py-4"></th></tr>
              </thead>
              <tbody className="divide-y">
                {records.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4"><p className="text-sm font-bold">{record.date}</p><p className="text-[10px] uppercase text-slate-400">{record.type}</p></td>
                    <td className="px-6 py-4 font-bold text-sm">{record.customerName}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${record.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{record.status}</span></td>
                    <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-blue-600"><ChevronRight size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-emerald-600 rounded-xl text-white"><ClipboardList size={24} /></div>
                 <h4 className="font-bold text-lg">Log Maintenance Visit</h4>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleLogService} className="p-8 space-y-5">
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Find Customer</label>
                <div className="relative">
                   <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                   <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-10 pr-4 py-3 font-bold" placeholder="Search by name or phone..." value={selectedCustomer ? selectedCustomer.name : customerSearch} onChange={e => {setCustomerSearch(e.target.value); setSelectedCustomer(null);}} />
                   {selectedCustomer && <button onClick={() => setSelectedCustomer(null)} className="absolute right-3 top-3.5 text-slate-400 hover:text-red-500"><X size={18} /></button>}
                </div>
                {customerSearch && !selectedCustomer && (
                  <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                    {filteredCustomers.map(c => (
                      <button key={c.id} type="button" onClick={() => { setSelectedCustomer(c); setCustomerSearch(''); }} className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between transition-colors border-b border-slate-50">
                        <div><p className="font-bold text-sm">{c.name}</p><p className="text-xs text-slate-500">{c.phone}</p></div>
                        <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded">{c.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Visit Type</label><select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold" value={newRecord.type} onChange={e => setNewRecord({...newRecord, type: e.target.value as any})}><option value="SERVICE">Regular Service</option><option value="INSTALLATION">Installation</option><option value="REPAIR">Repair/Complaints</option></select></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Technician</label><input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold" placeholder="Technician Name" value={newRecord.technician} onChange={e => setNewRecord({...newRecord, technician: e.target.value})} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Visit Cost</label><div className="relative"><IndianRupee className="absolute left-3 top-3.5 text-slate-400" size={16} /><input type="number" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-9 pr-4 py-3 font-bold" value={newRecord.cost || ''} onChange={e => setNewRecord({...newRecord, cost: Number(e.target.value)})} /></div></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Status</label><select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold" value={newRecord.status} onChange={e => setNewRecord({...newRecord, status: e.target.value as any})}><option value="COMPLETED">Completed</option><option value="SCHEDULED">Scheduled</option><option value="PENDING">Pending Part</option></select></div>
              </div>

              <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Work Description</label><textarea className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold h-24" placeholder="Mention filter changes, issues solved etc." value={newRecord.description} onChange={e => setNewRecord({...newRecord, description: e.target.value})} /></div>

              <button type="submit" disabled={!selectedCustomer} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 transition-all disabled:opacity-50">Log Service Record</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;
