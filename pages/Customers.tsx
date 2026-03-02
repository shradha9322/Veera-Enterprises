
import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Phone, 
  MapPin, 
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  X,
  Plus
} from 'lucide-react';
import { Customer, CustomerType } from '../types';
import { api } from '../api.ts';

interface CustomersProps {
  customers: Customer[];
  setCustomers: (val: any) => Promise<void>;
}

const Customers: React.FC<CustomersProps> = ({ customers, setCustomers }) => {
  const [filter, setFilter] = useState<CustomerType | 'ALL'>('ALL');
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'KOLHAPUR' | 'MAHARASHTRA' | 'KARNATAKA' | 'GOA'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Customer Form State
  const [newCust, setNewCust] = useState({
    name: '',
    phone: '',
    type: CustomerType.RETAIL,
    address: '',
    region: 'KOLHAPUR' as any,
    gstIn: ''
  });

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      ...newCust,
      id: `c${Date.now()}`,
      totalPurchase: 0,
      outstanding: 0,
    };
    await api.addCustomer(customer);
    await setCustomers(null);
    setIsModalOpen(false);
    setNewCust({ name: '', phone: '', type: CustomerType.RETAIL, address: '', region: 'KOLHAPUR', gstIn: '' });
  };

  const filteredCustomers = customers.filter(c => {
    const matchesFilter = filter === 'ALL' || c.type === filter;
    const matchesRegion = regionFilter === 'ALL' || c.region === regionFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.phone.includes(searchTerm) ||
                         c.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesRegion && matchesSearch;
  });

  const regions: ('KOLHAPUR' | 'MAHARASHTRA' | 'KARNATAKA' | 'GOA')[] = ['KOLHAPUR', 'MAHARASHTRA', 'KARNATAKA', 'GOA'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Customer Directory</h2>
          <p className="text-slate-500 text-sm">Manage your retail, wholesale, and AMC clients.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
        >
          <UserPlus size={20} />
          Add New Customer
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, phone or address..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Customer Type</p>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['ALL', ...Object.values(CustomerType)].map(type => {
                const count = type === 'ALL' 
                  ? customers.length 
                  : customers.filter(c => c.type === type).length;
                
                return (
                  <button
                    key={type}
                    onClick={() => setFilter(type as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      filter === type 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {type}
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      filter === type ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Region</p>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['ALL', ...regions].map(region => {
                const count = region === 'ALL'
                  ? customers.length
                  : customers.filter(c => c.region === region).length;

                return (
                  <button
                    key={region}
                    onClick={() => setRegionFilter(region as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      regionFilter === region
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {region === 'ALL' ? 'ALL' : region.charAt(0) + region.slice(1).toLowerCase()}
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      regionFilter === region ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <div 
            key={customer.id} 
            className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all overflow-hidden group cursor-pointer"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    customer.type === CustomerType.WHOLESALE ? 'bg-indigo-50 text-indigo-600' :
                    customer.type === CustomerType.AMC ? 'bg-emerald-50 text-emerald-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {customer.type === CustomerType.WHOLESALE ? <Building2 size={24} /> : 
                     customer.type === CustomerType.AMC ? <ShieldCheck size={24} /> :
                     <UserPlus size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none mb-1">{customer.name}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{customer.type}</span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={14} className="text-slate-400" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={14} className="text-slate-400" />
                  <span className="truncate">{customer.region} - {customer.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Total Sales</p>
                  <p className="font-bold text-slate-900">₹{customer.totalPurchase.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Outstanding</p>
                  <p className={`font-bold ${customer.outstanding > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    ₹{customer.outstanding.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 px-5 py-3 flex items-center justify-between group-hover:bg-blue-600 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-white/80">
                <Calendar size={12} />
                {customer.type === CustomerType.AMC ? (
                  <span>AMC Expires: {customer.amcExpiry}</span>
                ) : (
                  <span>Last Visit: {customer.lastServiceDate || 'N/A'}</span>
                )}
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h4 className="font-bold text-lg">Register New Customer</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                  <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Number</label>
                  <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold" value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Type</label>
                  <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold" value={newCust.type} onChange={e => setNewCust({...newCust, type: e.target.value as CustomerType})}>
                    {Object.values(CustomerType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Region</label>
                  <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold" value={newCust.region} onChange={e => setNewCust({...newCust, region: e.target.value as any})}>
                    <option value="KOLHAPUR">Kolhapur (Retail)</option>
                    <option value="MAHARASHTRA">Maharashtra (Wholesale)</option>
                    <option value="KARNATAKA">Karnataka</option>
                    <option value="GOA">Goa</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Address</label>
                <textarea className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold" value={newCust.address} onChange={e => setNewCust({...newCust, address: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all">Save Customer Profile</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
