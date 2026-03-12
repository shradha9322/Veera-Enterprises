import React from "react";

import {
  PlusCircle,
  Users,
  Wrench,
  Package,
  FileText,
  IndianRupee,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Dashboard = ({
  products = [],
  invoices = [],
  customers = [],
  quotations = [],
  setCurrentPage
}) => {

const lowStockItems = products.filter(
  (p) => Number(p?.stock || 0) <= Number(p?.lowStockThreshold || 0)
);

const totalRevenue = invoices.reduce(
  (acc, curr) => acc + Number(curr?.grandTotal || 0),
  0
);

const salesData = [
  { name: "Jan", sales: 42000 },
  { name: "Feb", sales: 38000 },
  { name: "Mar", sales: totalRevenue > 0 ? totalRevenue : 52000 }
];

const geoData = [
  { name: "Kolhapur", value: customers?.filter(c => c?.region === "KOLHAPUR").length || 0, color: "#3b82f6" },
  { name: "Maharashtra", value: customers?.filter(c => c?.region === "MAHARASHTRA").length || 0, color: "#10b981" },
  { name: "Karnataka", value: customers?.filter(c => c?.region === "KARNATAKA").length || 0, color: "#f59e0b" },
  { name: "Goa", value: customers?.filter(c => c?.region === "GOA").length || 0, color: "#ef4444" }
];

const quickActions = [
  { label: "New Invoice", icon: PlusCircle, color: "bg-blue-600", page: "billing" },
  { label: "Add Customer", icon: Users, color: "bg-indigo-600", page: "customers" },
  { label: "Service Entry", icon: Wrench, color: "bg-emerald-600", page: "service" },
  { label: "Inventory In", icon: Package, color: "bg-slate-700", page: "inventory" },
  { label: "New Quotations", icon: FileText, color: "bg-orange-600", page: "quotations", nowrap: true }
];

return (
<div className="space-y-6">

{/* Quick Actions */}
<div className="ml-[10px] w-[96%] grid grid-cols-2 md:grid-cols-5 gap-3">
{quickActions.map((action, idx) => (
<button
key={idx}
onClick={() => setCurrentPage?.(action.page)}
className={`${action.color} text-white p-4 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 shadow-md active:scale-95 hover:scale-110 transition-all`}
>
<action.icon size={20} />

<span className={`font-semibold text-sm sm:text-base ${action.nowrap ? "whitespace-nowrap" : ""}`}>
{action.label}
</span>

</button>
))}
</div>

{/* KPI Stats */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

<StatCard
title="Total Revenue"
value={`₹${totalRevenue.toLocaleString()}`}
sub="Current Month Data"
icon={IndianRupee}
color="text-blue-600"
/>

<StatCard
title="Total Customers"
value={String(customers?.length || 0)}
sub="+5 new this week"
icon={Users}
color="text-indigo-600"
/>

<StatCard
title="Active AMC"
value={String(customers?.filter(c => c?.type === "AMC").length || 0)}
sub="Renewals pending: 2"
icon={TrendingUp}
color="text-emerald-600"
/>

<StatCard
title="Low Stock Items"
value={String(lowStockItems?.length || 0).padStart(2, "0")}
sub="Check Inventory"
icon={AlertTriangle}
color="text-amber-500"
/>

<StatCard
title="Total Quotations"
value={String(quotations?.length || 0)}
sub="All quotations created"
icon={FileText}
color="text-orange-600"
/>

</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

<div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

<div className="flex items-center justify-between mb-6">
<h3 className="font-bold text-lg">Sales Performance</h3>
</div>

<div className="h-[300px]">
<ResponsiveContainer width="100%" height="100%">
<AreaChart data={salesData}>

<defs>
<linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
<stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
</linearGradient>
</defs>

<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#64748b", fontSize: 12}} />
<YAxis axisLine={false} tickLine={false} tick={{fill: "#64748b", fontSize: 12}} />

<Tooltip contentStyle={{borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"}} />

<Area
type="monotone"
dataKey="sales"
stroke="#3b82f6"
strokeWidth={3}
fillOpacity={1}
fill="url(#colorSales)"
/>

</AreaChart>
</ResponsiveContainer>
</div>

</div>

<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

<h3 className="font-bold text-lg mb-6">Customer Regions</h3>

<div className="h-[250px] mb-4">
<ResponsiveContainer width="100%" height="100%">
<PieChart>

<Pie data={geoData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
{geoData.map((entry, index) => (
<Cell key={`cell-${index}`} fill={entry.color} />
))}
</Pie>

<Tooltip />

</PieChart>
</ResponsiveContainer>
</div>

<div className="space-y-2">
{geoData.map((item, idx) => (
<div key={idx} className="flex items-center justify-between text-sm">

<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
<span className="text-slate-600">{item.name}</span>
</div>

<span className="font-bold">{item.value} Clients</span>

</div>
))}
</div>

</div>

</div>

</div>
);
};

const StatCard = ({ title, value, sub, icon: Icon, color }) => (
<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-gray-700 hover:shadow-[0_4px_15px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-110">

<div className="flex items-center justify-between mb-4">

<div className={`p-2 rounded-xl bg-slate-50 ${color}`}>
<Icon size={24} />
</div>

<span className="text-xs font-black text-slate-400 uppercase tracking-wider">
{title}
</span>

</div>

<p className="text-2xl font-black mb-1 text-slate-900">{value}</p>
<p className="text-[10px] font-bold text-slate-400 uppercase">{sub}</p>

</div>
);

export default Dashboard;