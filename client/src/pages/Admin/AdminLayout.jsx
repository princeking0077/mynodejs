import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children, onSelectContext }) => {
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
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <AdminSidebar
                onLogout={handleLogout}
                onSelectContext={onSelectContext}
            />

            {/* Main Content */}
            <div className="flex-1 md:ml-72 flex flex-col min-h-screen transition-all duration-300">
                {/* Mobile Spacer */}
                <div className="h-16 md:h-0"></div>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
