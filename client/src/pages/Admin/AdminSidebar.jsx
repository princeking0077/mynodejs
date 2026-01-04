import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Settings,
    ChevronDown,
    ChevronRight,
    LogOut,
    Menu,
    X,
    FolderKanban
} from 'lucide-react';
import { curriculum } from '../../data/curriculum';

const AdminSidebar = ({ onLogout, onSelectContext }) => {
    const location = useLocation();
    const [expandedYear, setExpandedYear] = useState('');
    const [expandedSem, setExpandedSem] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);

    // Filter for B.Pharm Years
    const bpharmYears = curriculum.filter(c => c.id.startsWith('year-'));
    // Filter for GPAT
    const gpatModule = curriculum.find(c => c.id === 'gpat-module');

    const toggleYear = (yearId) => {
        setExpandedYear(expandedYear === yearId ? '' : yearId);
        setExpandedSem('');
    };

    const toggleSem = (semId, e) => {
        e.stopPropagation();
        setExpandedSem(expandedSem === semId ? '' : semId);
    };

    const handleSubjectSelect = (subject, yearId, semId, contextType) => {
        // Pass the selection up to the parent layout/manager
        if (onSelectContext) {
            onSelectContext({
                type: contextType, // 'bpharm' or 'gpat'
                yearId,
                semId,
                subjectId: subject.id,
                subjectTitle: subject.title
            });
            setMobileOpen(false);
        }
    };

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-[#0F172A] border-r border-gray-800">
            {/* Logo Area */}
            <div className="p-6 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                        <LayoutDashboard size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Admin<span className="text-gray-400 font-normal">Panel</span></span>
                </div>
                <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileOpen(false)}>
                    <X size={24} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar space-y-8">

                {/* Dashboard Link */}
                <div className="px-4">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-r-full transition-all border-l-4 ${location.pathname === '/admin' && !location.search ? 'border-cyan-500 bg-[#1E293B] text-white shadow-lg shadow-black/20' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => { if (onSelectContext) onSelectContext(null); setMobileOpen(false); }}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium text-sm">Overview</span>
                    </Link>
                </div>

                {/* Section: Content Management */}
                <div className="px-4">
                    <div className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                        Content Management
                    </div>
                    <div className="space-y-1">
                        {bpharmYears.map(year => (
                            <div key={year.id}>
                                <button
                                    onClick={() => toggleYear(year.id)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-r-full text-sm transition-all border-l-4 ${expandedYear === year.id ? 'border-blue-500 bg-[#1E293B] text-white' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <GraduationCap size={18} className={expandedYear === year.id ? 'text-blue-400' : ''} />
                                        <span>{year.title}</span>
                                    </div>
                                    {expandedYear === year.id ? <ChevronDown size={14} className="text-blue-400" /> : <ChevronRight size={14} />}
                                </button>

                                <AnimatePresence>
                                    {expandedYear === year.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden ml-4 pl-4 border-l border-gray-800 mt-1 space-y-1"
                                        >
                                            {year.semesters.map(sem => (
                                                <div key={sem.id}>
                                                    <button
                                                        onClick={(e) => toggleSem(sem.id, e)}
                                                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-500 hover:text-blue-400 transition-colors"
                                                    >
                                                        <span>{sem.title}</span>
                                                        {expandedSem === sem.id ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                    </button>
                                                    {expandedSem === sem.id && (
                                                        <div className="pl-3 py-1 space-y-1">
                                                            {sem.subjects.map(subject => (
                                                                <button
                                                                    key={subject.id}
                                                                    onClick={() => handleSubjectSelect(subject, year.id, sem.id, 'bpharm')}
                                                                    className="w-full text-left px-3 py-1.5 text-[11px] text-gray-500 hover:text-white hover:bg-white/5 rounded transition-colors truncate relative flex items-center gap-2"
                                                                    title={subject.title}
                                                                >
                                                                    <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                                                                    {subject.title}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Competitive Exams */}
                <div className="px-4">
                    <div className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                        Competitive Exams
                    </div>
                    <div className="space-y-1">
                        {gpatModule && (
                            <div key={gpatModule.id}>
                                <button
                                    onClick={() => toggleYear(gpatModule.id)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-r-full text-sm transition-all border-l-4 ${expandedYear === gpatModule.id ? 'border-orange-500 bg-[#1E293B] text-white' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <BookOpen size={18} className={expandedYear === gpatModule.id ? 'text-orange-400' : ''} />
                                        <span>GPAT / NIPER</span>
                                    </div>
                                    {expandedYear === gpatModule.id ? <ChevronDown size={14} className="text-orange-400" /> : <ChevronRight size={14} />}
                                </button>

                                <AnimatePresence>
                                    {expandedYear === gpatModule.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden ml-4 pl-4 border-l border-gray-800 mt-1"
                                        >
                                            {gpatModule.semesters.map(module => (
                                                <div key={module.id} className="mb-1">
                                                    <div className="px-3 py-1.5 text-xs font-bold text-gray-500 uppercase">{module.title}</div>
                                                    {module.subjects.map(subject => (
                                                        <button
                                                            key={subject.id}
                                                            onClick={() => handleSubjectSelect(subject, 'gpat-module', module.id, 'gpat')}
                                                            className="w-full text-left px-3 py-1.5 text-[11px] text-gray-500 hover:text-orange-400 rounded transition-colors truncate flex items-center gap-2"
                                                        >
                                                            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                                                            {subject.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-800 bg-[#0B1120]">
                <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors mb-1 rounded-lg hover:bg-white/5">
                    <Settings size={18} />
                    <span className="text-sm font-medium">Global Settings</span>
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
                >
                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar (Sticky) */}
            <aside className="hidden md:flex w-72 flex-col sticky top-0 h-screen z-50 bg-[#0f172a]/95 backdrop-blur-xl border-r border-white/10 shrink-0 overflow-hidden transition-all duration-300">
                <SidebarContent />
            </aside>

            {/* Mobile Header & Toggle */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-[#0f172a]/90 backdrop-blur-md p-4 z-40 flex justify-between items-center border-b border-white/10">
                <span className="font-bold text-lg text-white tracking-wide">
                    Admin<span className="text-cyan-400">Panel</span>
                </span>
                <button onClick={() => setMobileOpen(true)} className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 md:hidden bg-[#0f172a] shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminSidebar;
