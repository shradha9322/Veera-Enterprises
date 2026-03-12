
import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Filter, 
  UserPlus,
  Plus,
  X
  
} from 'lucide-react';
const CustomerType = {
  WHOLESALE: "WHOLESALE",
  RETAIL: "RETAIL"
};
// import { api } from '../api';



const Dealers = ({ customers, setCustomers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingDealer, setEditingDealer] = useState(null);



  const [newDealer, setNewDealer] = useState({
    name: '',
    phone: '',
    address: '',
    region: 'MAHARASHTRA' ,
    gstIn: ''
  });

  const dealers = customers.filter(c => c.type === CustomerType.WHOLESALE);
  const totalOutstanding = dealers.reduce((acc, curr) => acc + curr.outstanding, 0);

  const handleAddDealer = async (e) => {
  e.preventDefault();

  if (editingDealer) {

    const updatedDealer = {
      ...editingDealer,
      ...newDealer
    };

   await api.updateCustomer(editingDealer.id, updatedDealer);

  } else {

    const customer = {
      ...newDealer,
      id: `d${Date.now()}`,
      type: CustomerType.WHOLESALE,
      totalPurchase: 0,
      outstanding: 0,
    };

    await api.addCustomer(customer);
  }

  await setCustomers(null);

  setIsModalOpen(false);
  setEditingDealer(null);

  setNewDealer({
    name: '',
    phone: '',
    address: '',
    region: 'MAHARASHTRA',
    gstIn: ''
  });
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dealer Management</h2>
          <p className="text-slate-500 text-sm">Managing partners across Maharashtra, Karnataka, and Goa</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() =>{
            setEditingDealer(null)
             setIsModalOpen(true)}} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95"><UserPlus size={20} /> Add New Dealer</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Dealers</p><p className="text-3xl font-black">{dealers.length}</p></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Overall Balance</p><p className="text-3xl font-black text-red-500">₹{(totalOutstanding / 1000).toFixed(1)}k</p></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Regional Sales</p><p className="text-3xl font-black text-blue-600">₹{(dealers.reduce((acc, d) => acc + d.totalPurchase, 0) / 1000).toFixed(1)}k</p></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between"><h3 className="font-bold">Active Partners</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-slate-100">
          {dealers.map(dealer => (
            <div key={dealer.id} className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer">
              <div className="flex justify-between items-start mb-4"><div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Building2 size={24} /></div><span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${dealer.outstanding > 10000 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{dealer.outstanding > 10000 ? 'Attention' : 'Healthy'}</span></div>
              <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{dealer.name}</h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-4"><MapPin size={12} /><span>{dealer.region} | {dealer.address}</span></div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4"><div><p className="text-[10px] font-black text-slate-400 uppercase">Sales</p><p className="font-bold text-sm">₹{dealer.totalPurchase.toLocaleString()}</p></div><div><p className="text-[10px] font-black text-slate-400 uppercase">Balance</p><p className="font-bold text-sm text-red-600">₹{dealer.outstanding.toLocaleString()}</p></div></div>

              <div className="flex justify-end mt-4 ">
  <button
    onClick={() => {
      setEditingDealer(dealer);
      setNewDealer({
        name: dealer.name,
        phone: dealer.phone,
        address: dealer.address,
        region: dealer.region,
        gstIn: dealer.gstIn || ""
      });
      setIsModalOpen(true);
    }}
    className="\ font-bold bg-purple-900 text-white px-3 py-1.5 rounded-lg hover:scale-110 transition"
  >
    Update Details
  </button>
</div>
            </div>
          ))}
          {dealers.length === 0 && <div className="col-span-3 p-12 text-center text-slate-400 italic">No wholesale dealers found.</div>}
        </div>
      </div>

      {/* Add Dealer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
               <h4 className="font-bold text-lg">
  {editingDealer ? "Update Dealer Details" : "Onboard Wholesale Partner"}
</h4>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddDealer} className="p-8 space-y-4">
               <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Business Name</label>
                  <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold" 
                  value={newDealer.name}
                   onChange={e => setNewDealer({...newDealer, name: e.target.value})} /></div>

                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Contact Phone</label><input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold" 
                  value={newDealer.phone} onChange={e => setNewDealer({...newDealer, phone: e.target.value})} /></div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Region</label><select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold" value={newDealer.region}
                   onChange={e => setNewDealer({...newDealer, region: e.target.value })}>
                    <option value="MAHARASHTRA">Maharashtra</option><option value="KARNATAKA">Karnataka</option><option value="GOA">Goa</option>
                  </select></div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">GST Number</label><input className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold" placeholder="27XXXX..." value={newDealer.gstIn} onChange={e => setNewDealer({...newDealer, gstIn: e.target.value})} /></div>
               </div>
               <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Office Address</label><textarea className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold" value={newDealer.address} onChange={e => setNewDealer({...newDealer, address: e.target.value})} /></div>
               <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all">Confirm Dealer Onboarding</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dealers;
