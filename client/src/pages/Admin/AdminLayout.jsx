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
        <div className="admin-scope min-h-screen text-white flex font-sans custom-scrollbar bg-[var(--bg-dark)]">
            {/* Sidebar */}
            <AdminSidebar
                onLogout={handleLogout}
                onSelectContext={onSelectContext}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 relative">

                {/* Top Navbar (desktop/tablet only; mobile uses AdminSidebar header) */}
                <header className="hidden md:flex h-16 bg-[rgba(5,5,10,0.8)] backdrop-blur-xl border-b border-white/5 sticky top-0 z-30 px-6 md:px-8 items-center justify-between">
                    {/* Breadcrumbs / Page Title */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="hover:text-white cursor-pointer transition-colors font-semibold">Admin</span>
                        <ChevronRight size={14} className="text-gray-600" />
                        <span className="text-white font-bold truncate max-w-[200px] md:max-w-md tracking-wide">{title}</span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        {/* Search Placeholder */}
                        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 min-w-[240px] focus-within:border-emerald-500/50 transition-colors">
                            <Search size={14} className="text-gray-500" />
                            <input type="text" placeholder="Quick search..." className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full font-medium" />
                        </div>

                        {/* Notifications */}
                        <button className="relative text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#05050a]"></span>
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white leading-none mb-1">{user?.name || 'Administrator'}</p>
                                <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">{user?.email || 'admin@learnpharmacy.in'}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 border-2 border-white/10">
                                {user?.email ? user.email[0].toUpperCase() : 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 pt-24 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
