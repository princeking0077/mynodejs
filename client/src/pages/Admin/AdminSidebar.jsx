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
    X
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
        <div className="h-full flex flex-col bg-white border-r border-slate-200">
            {/* Logo Area */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundImage: 'var(--grad-primary)' }}>
                        <LayoutDashboard size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-semibold text-slate-900 tracking-tight">Content Manager</span>
                </div>
                <button className="md:hidden text-slate-500 hover:text-slate-900" onClick={() => setMobileOpen(false)}>
                    <X size={24} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar space-y-8">

                {/* Dashboard Link */}
                <div className="px-4">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${location.pathname === '/admin' && !location.search ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                        onClick={() => { if (onSelectContext) onSelectContext(null); setMobileOpen(false); }}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium text-sm">Overview</span>
                    </Link>
                </div>

                {/* Section: Content Management */}
                <div className="px-4">
                    <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <GraduationCap size={12} /> Content Management
                    </div>
                    <div className="space-y-1">
                        {bpharmYears.map(year => (
                            <div key={year.id}>
                                <button
                                    onClick={() => toggleYear(year.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border ${expandedYear === year.id ? 'bg-slate-50 border-slate-200 text-slate-900' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${expandedYear === year.id ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                        <span className="font-medium">{year.title}</span>
                                    </div>
                                    {expandedYear === year.id ? <ChevronDown size={14} className="text-emerald-600" /> : <ChevronRight size={14} className="text-slate-400" />}
                                </button>

                                <AnimatePresence>
                                    {expandedYear === year.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden ml-4 pl-4 border-l border-slate-200 mt-1 space-y-1"
                                        >
                                            {year.semesters.map(sem => (
                                                <div key={sem.id}>
                                                    <button
                                                        onClick={(e) => toggleSem(sem.id, e)}
                                                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors uppercase tracking-wider mt-2"
                                                    >
                                                        <span>{sem.title}</span>
                                                        {expandedSem === sem.id ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-300" />}
                                                    </button>
                                                    {expandedSem === sem.id && (
                                                        <div className="pl-3 py-1 space-y-0.5">
                                                            {sem.subjects.map(subject => (
                                                                <button
                                                                    key={subject.id}
                                                                    onClick={() => handleSubjectSelect(subject, year.id, sem.id, 'bpharm')}
                                                                    className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors truncate relative flex items-center gap-2 group"
                                                                    title={subject.title}
                                                                >
                                                                    <div className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-emerald-500 transition-colors"></div>
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
                    <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <BookOpen size={12} /> Competitive Exams
                    </div>
                    <div className="space-y-1">
                        {gpatModule && (
                            <div key={gpatModule.id}>
                                <button
                                    onClick={() => toggleYear(gpatModule.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border ${expandedYear === gpatModule.id ? 'bg-slate-50 border-slate-200 text-slate-900' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${expandedYear === gpatModule.id ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                                        <span>GPAT / NIPER</span>
                                    </div>
                                    {expandedYear === gpatModule.id ? <ChevronDown size={14} className="text-orange-500" /> : <ChevronRight size={14} className="text-slate-400" />}
                                </button>

                                <AnimatePresence>
                                    {expandedYear === gpatModule.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden ml-4 pl-4 border-l border-slate-200 mt-1"
                                        >
                                            {gpatModule.semesters.map(module => (
                                                <div key={module.id} className="mb-1">
                                                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase mt-2">{module.title}</div>
                                                    {module.subjects.map(subject => (
                                                        <button
                                                            key={subject.id}
                                                            onClick={() => handleSubjectSelect(subject, 'gpat-module', module.id, 'gpat')}
                                                            className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors truncate flex items-center gap-2 group"
                                                        >
                                                            <div className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-orange-400 transition-colors"></div>
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
            <div className="p-4 border-t border-slate-200 bg-white">
                <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 transition-colors mb-1 rounded-lg hover:bg-slate-50">
                    <Settings size={18} />
                    <span className="text-sm font-medium">Global Settings</span>
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
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
            <aside className="hidden md:flex w-72 flex-col sticky top-0 h-screen z-50 bg-transparent shrink-0 overflow-hidden">
                <SidebarContent />
            </aside>

            {/* Mobile Header & Toggle */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md p-4 z-40 flex justify-between items-center border-b border-slate-200">
                <span className="font-semibold text-base text-slate-900 tracking-tight">
                    Content Manager
                </span>
                <button onClick={() => setMobileOpen(true)} className="text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors">
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
                            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 md:hidden shadow-2xl"
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
