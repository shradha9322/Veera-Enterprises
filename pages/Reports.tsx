
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Download, Calendar, Filter } from 'lucide-react';
import { Invoice, Product, Customer } from '../types';

interface ReportsProps {
  invoices: Invoice[];
  products: Product[];
  customers: Customer[];
}

const Reports: React.FC<ReportsProps> = ({ invoices, products, customers }) => {
  const regionalSales = [
    { name: 'Kolhapur', value: invoices.filter(i => customers.find(c => c.id === i.customerId)?.region === 'KOLHAPUR').reduce((acc, curr) => acc + curr.grandTotal, 0) },
    { name: 'MH (State)', value: invoices.filter(i => customers.find(c => c.id === i.customerId)?.region === 'MAHARASHTRA').reduce((acc, curr) => acc + curr.grandTotal, 0) },
    { name: 'KA', value: invoices.filter(i => customers.find(c => c.id === i.customerId)?.region === 'KARNATAKA').reduce((acc, curr) => acc + curr.grandTotal, 0) },
    { name: 'GA', value: invoices.filter(i => customers.find(c => c.id === i.customerId)?.region === 'GOA').reduce((acc, curr) => acc + curr.grandTotal, 0) },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Advanced Business Insights</h2>
          <p className="text-slate-500 text-sm">Real-time revenue tracking and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 flex items-center gap-2 hover:bg-slate-50">
            <Filter size={18} /> Filters
          </button>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-6">Regional Sales Distribution</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={regionalSales}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                   {regionalSales.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-lg">Inventory Valuation</h3>
             <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded">Live Stock</span>
           </div>
           <div className="space-y-4">
              {products.slice(0, 4).map(p => (
                <div key={p.id} className="space-y-1">
                   <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-700">{p.name}</span>
                      <span className="text-slate-400">₹{(p.stock * p.priceWholesale).toLocaleString()}</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{width: `${Math.min(100, (p.stock / 20) * 100)}%`}}></div>
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-8 p-4 bg-slate-900 rounded-2xl text-white">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Assets Valuation</p>
              <p className="text-2xl font-black">₹{products.reduce((acc, curr) => acc + (curr.stock * curr.priceWholesale), 0).toLocaleString()}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
