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
        <div className="h-full flex flex-col" style={{ background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Logo Area */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                        <LayoutDashboard size={18} className="text-white" />
                    </div>
                    <span>Admin<span className="text-cyan-400">Panel</span></span>
                </div>
                <button className="md:hidden text-white" onClick={() => setMobileOpen(false)}>
                    <X size={24} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">

                {/* Dashboard Link */}
                <div className="mb-6">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${location.pathname === '/admin' && !location.search ? 'bg-gradient-to-r from-blue-600/20 to-blue-900/10 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        onClick={() => { if (onSelectContext) onSelectContext(null); setMobileOpen(false); }}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Overview</span>
                    </Link>
                </div>

                {/* Section: B.Pharm */}
                <div className="mb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Content Management
                </div>

                {/* B.Pharm Accordion */}
                <div className="mb-4">
                    {bpharmYears.map(year => (
                        <div key={year.id} className="mb-2">
                            <button
                                onClick={() => toggleYear(year.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all border border-transparent ${expandedYear === year.id ? 'bg-gradient-to-r from-blue-600/10 to-transparent border-l-blue-500 border-l-2 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
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
                                        className="overflow-hidden ml-4 pl-4 border-l border-white/10 mt-1 space-y-1"
                                    >
                                        {year.semesters.map(sem => (
                                            <div key={sem.id}>
                                                <button
                                                    onClick={(e) => toggleSem(sem.id, e)}
                                                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                                                >
                                                    <span>{sem.title}</span>
                                                    {expandedSem === sem.id ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                </button>

                                                {/* Subjects List */}
                                                {expandedSem === sem.id && (
                                                    <div className="pl-4 py-1 space-y-1">
                                                        {sem.subjects.map(subject => (
                                                            <button
                                                                key={subject.id}
                                                                onClick={() => handleSubjectSelect(subject, year.id, sem.id, 'bpharm')}
                                                                className="w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:text-white hover:bg-white/5 rounded transition-colors truncate"
                                                                title={subject.title}
                                                            >
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

                {/* GPAT Section */}
                <div className="mb-6">
                    <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Competitive Exams
                    </div>
                    {gpatModule && gpatModule.semesters.map(module => (
                        <div key={module.id} className="mb-1">
                            <button
                                onClick={() => toggleYear(module.id)} // Reusing toggleYear for simplicity
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all border border-transparent ${expandedYear === module.id ? 'bg-gradient-to-r from-orange-600/10 to-transparent border-l-orange-500 border-l-2 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <BookOpen size={18} className={expandedYear === module.id ? 'text-orange-400' : ''} />
                                    <span>{module.title}</span>
                                </div>
                                {expandedYear === module.id ? <ChevronDown size={14} className="text-orange-400" /> : <ChevronRight size={14} />}
                            </button>

                            <AnimatePresence>
                                {expandedYear === module.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden ml-4 pl-4 border-l border-white/10 mt-1"
                                    >
                                        {module.subjects.map(subject => (
                                            <button
                                                key={subject.id}
                                                onClick={() => handleSubjectSelect(subject, 'gpat-module', module.id, 'gpat')}
                                                className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-cyan-400 hover:bg-white/5 rounded transition-colors truncate"
                                            >
                                                {subject.title}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors mb-2 rounded-lg hover:bg-white/5">
                    <Settings size={18} />
                    <span className="text-sm">Global Settings</span>
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-72 fixed inset-y-0 left-0 z-50">
                <SidebarContent />
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-[#0f172a] p-4 z-40 flex justify-between items-center border-b border-white/10">
                <span className="font-bold text-white">Admin Panel</span>
                <button onClick={() => setMobileOpen(true)} className="text-white">
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
                            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 md:hidden"
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
