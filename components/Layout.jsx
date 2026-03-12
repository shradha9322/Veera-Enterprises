
import React, { useState } from 'react';

import { 
  FileText,
  LayoutDashboard, 
  Users, 
  Package, 
  Receipt, 
  Wrench, 
  Truck, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Droplets,
  LogOut,
  Bell,
  IndianRupee
} from 'lucide-react';




const Layout= ({ children, currentPage, setCurrentPage, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'billing', label: 'Billing', icon: IndianRupee },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'quotations', label: 'Quotations', icon: FileText },


    { id: 'service', label: 'Service & AMC', icon: Wrench },
    { id: 'dealers', label: 'Wholesale/Dealers', icon: Truck },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-400 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} text-white transition-all duration-300 flex flex-col z-80 bg-gradient-to-b from-purple-900 to-pink-900`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Droplets className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">Veera</h1>
                <p className="text-xs text-slate-200">Enterprises</p>
              </div>
            </div>
          ) : (
            <Droplets className="mx-auto text-blue-500" size={32} />
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all ${
                currentPage === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : ' hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden ">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4 " >
            <button onClick={() => setIsSidebarOpen(true)} className={`${isSidebarOpen ? 'hidden' : 'block'} p-1.5 hover:bg-slate-100 rounded-lg `}>
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 hidden sm:block">
              {menuItems.find(i => i.id === currentPage)?.label || 'System'}
            </h2>
          </div>
          
          <div className="flex-1 max-w-xl hidden md:block mx-8">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="w-full pl-11 pr-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-full focus:ring-0 focus:border-blue-500 text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">

          

            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900"></p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Veera Ent.</p>
              </div>
              {/* <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold">
                
              </div> */}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 ">
          {children}
        </div>
      </main>
    </div>
  );
};

const SearchIcon = ({ className, size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default Layout;
