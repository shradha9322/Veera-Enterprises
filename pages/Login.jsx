
import React, { useState } from 'react';
import { Droplets, Lock, User, ShieldCheck } from 'lucide-react';
// import { UserRole } from '../types';



const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin("ADMIN");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Droplets className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none">Veera</h1>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Enterprises</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Sign in to manage your business operations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 font-bold focus:border-blue-500 focus:ring-0 outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                type="password" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 font-bold focus:border-blue-500 focus:ring-0 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" defaultChecked />
              <span className="text-xs font-semibold text-slate-600">Remember me</span>
            </label>
            <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Forgot password?</button>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] mt-4"
          >
            Log In Now
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">Veera Enterprises Management System v2.5</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-slate-300">
             <ShieldCheck size={20} />
             <span className="text-[10px] uppercase font-black tracking-widest">End-to-End Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
