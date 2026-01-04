import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Search } from 'lucide-react';

const AdminLayout = ({ children, onSelectContext, title = 'Dashboard', user }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="admin-scope min-h-screen flex font-sans custom-scrollbar bg-slate-50 text-slate-900">
            {/* Sidebar */}
            <AdminSidebar
                onLogout={handleLogout}
                onSelectContext={onSelectContext}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 relative">

                {/* Top Navbar (desktop/tablet only; mobile uses AdminSidebar header) */}
                <header className="hidden md:flex h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-30 px-6 md:px-8 items-center justify-between">
                    {/* Breadcrumbs / Page Title */}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="hover:text-slate-900 cursor-pointer transition-colors font-semibold">Admin</span>
                        <ChevronRight size={14} className="text-slate-400" />
                        <span className="text-slate-900 font-semibold truncate max-w-[200px] md:max-w-md">{title}</span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        {/* Search Placeholder */}
                        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 min-w-[240px] focus-within:border-emerald-400 transition-colors">
                            <Search size={14} className="text-slate-400" />
                            <input type="text" placeholder="Search content..." className="bg-transparent border-none outline-none text-xs text-slate-900 placeholder-slate-400 w-full font-medium" />
                        </div>

                        {/* Notifications */}
                        <button className="relative text-slate-400 hover:text-slate-700 transition-colors p-2 hover:bg-slate-100 rounded-xl">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-slate-900 leading-none mb-1">{user?.name || 'Administrator'}</p>
                                <p className="text-[11px] text-slate-500 font-medium">{user?.email || 'admin@learnpharmacy.in'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg border border-slate-200" style={{ backgroundImage: 'var(--grad-primary)' }}>
                                {user?.email ? user.email[0].toUpperCase() : 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 pt-24 md:p-8 bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
