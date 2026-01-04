import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Bell, ChevronRight, Search } from 'lucide-react';

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
        <div className="min-h-screen bg-[#0f172a] text-white flex font-sans">
            {/* Sidebar */}
            <AdminSidebar
                onLogout={handleLogout}
                onSelectContext={onSelectContext}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 relative bg-[#0B1120]">

                {/* Top Navbar */}
                <header className="h-16 bg-[#0F172A]/90 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-30 px-6 md:px-8 flex items-center justify-between shadow-sm">
                    {/* Breadcrumbs / Page Title */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="hover:text-white cursor-pointer transition-colors font-medium">Admin</span>
                        <ChevronRight size={14} className="text-gray-600" />
                        <span className="text-white font-medium truncate max-w-[200px] md:max-w-md tracking-wide">{title}</span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        {/* Search Placeholder */}
                        <div className="hidden md:flex items-center gap-2 bg-[#1E293B] border border-gray-700 rounded-lg px-3 py-1.5 min-w-[240px] focus-within:border-blue-500 transition-colors">
                            <Search size={14} className="text-gray-500" />
                            <input type="text" placeholder="Quick search..." className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full" />
                        </div>

                        {/* Notifications */}
                        <button className="relative text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F172A]"></span>
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-800">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white">{user?.name || 'Administrator'}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user?.email || 'admin@learnpharmacy.in'}</p>
                            </div>
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                                {user?.email ? user.email[0].toUpperCase() : 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Mobile Spacer (Already handled by padding/layout but keeping specific spacer if needed or removing) */}
                {/* <div className="h-16 md:h-0"></div> Remove old spacer, header is sticky now */}

                {/* Main Scrollable Area */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
