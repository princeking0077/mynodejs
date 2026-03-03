import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { ChevronDown, ChevronRight, Book, FileText, Plus, Pencil } from 'lucide-react';
import Toast, { useToast } from '../../components/Toast';
import { SkeletonList } from '../../components/Skeleton';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function BPharmSyllabusManager() {
    const [hierarchy, setHierarchy] = useState({});
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});
    const { toasts, toast, removeToast } = useToast();

    useEffect(() => {
        fetchHierarchy();
    }, []);

    const fetchHierarchy = async () => {
        setLoading(true);
        try {
            // Fetch subjects and content
            const [subjectsRes, contentRes] = await Promise.all([
                fetch(`${API}/api/subjects/subjects`, { credentials: 'include' }),
                fetch(`${API}/api/content`, { credentials: 'include' })
            ]);

            if (subjectsRes.ok && contentRes.ok) {
                const subjects = await subjectsRes.json();
                const content = await contentRes.json();

                // Filter B.Pharm subjects only
                const bpharmSubjects = subjects.filter(s => s.id.toLowerCase().startsWith('bp'));

                // Organize by year > semester > subject > unit
                const organized = {};

                bpharmSubjects.forEach(subject => {
                    const yearKey = subject.year_slug || 'other';
                    const semKey = `sem-${subject.semester || 0}`;

                    if (!organized[yearKey]) organized[yearKey] = {};
                    if (!organized[yearKey][semKey]) organized[yearKey][semKey] = {};

                    // Get topics for this subject
                    const subjectTopics = content.filter(c =>
                        c.subject_id === subject.id && c.type === 'topic'
                    );

                    // Organize topics by unit
                    const unitGroups = {};
                    subjectTopics.forEach(topic => {
                        const unitNum = topic.unit_number || 0;
                        if (!unitGroups[unitNum]) unitGroups[unitNum] = [];
                        unitGroups[unitNum].push(topic);
                    });

                    organized[yearKey][semKey][subject.id] = {
                        ...subject,
                        units: unitGroups
                    };
                });

                setHierarchy(organized);
            }
        } catch (error) {
            console.error('Error fetching hierarchy:', error);
            toast.error('Failed to load syllabus');
        } finally {
            setLoading(false);
        }
    };

    const toggle = (path) => {
        setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
    };

    const isExpanded = (path) => expanded[path];

    const renderUnit = (unitNum, topics, subjectId) => {
        const path = `unit-${subjectId}-${unitNum}`;
        const isOpen = isExpanded(path);
        const unitLabel = unitNum === 0 ? 'Uncategorized' : `Unit ${toRoman(unitNum)}`;

        return (
            <div key={unitNum} style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                <div
                    onClick={() => toggle(path)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(139,92,246,0.1)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: '#a78bfa',
                        fontSize: '0.85rem',
                        fontWeight: 600
                    }}
                >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <FileText size={14} />
                    <span>{unitLabel} ({topics.length} topics)</span>
                </div>
                {isOpen && (
                    <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }}>
                        {topics.map(topic => (
                            <div
                                key={topic.id}
                                onClick={() => window.location.href = `/admin/bpharm-content?edit=${topic.id}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.4rem 0.75rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 6,
                                    marginBottom: '0.25rem',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    transition: 'all 0.15s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                }}
                            >
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{topic.title}</span>
                                <Pencil size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderSubject = (subjectId, subjectData) => {
        const path = `subject-${subjectId}`;
        const isOpen = isExpanded(path);
        const totalTopics = Object.values(subjectData.units).reduce((sum, topics) => sum + topics.length, 0);

        return (
            <div key={subjectId} style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                <div
                    onClick={() => toggle(path)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1rem',
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        borderRadius: 10,
                        cursor: 'pointer',
                        color: '#60a5fa',
                        fontSize: '0.9rem',
                        fontWeight: 600
                    }}
                >
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Book size={16} />
                    <span>{subjectData.title}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'rgba(96,165,250,0.6)' }}>
                        {totalTopics} topics • {Object.keys(subjectData.units).length} units
                    </span>
                </div>
                {isOpen && (
                    <div style={{ marginTop: '0.5rem' }}>
                        {Object.entries(subjectData.units)
                            .sort(([a], [b]) => parseInt(a) - parseInt(b))
                            .map(([unitNum, topics]) => renderUnit(parseInt(unitNum), topics, subjectId))
                        }
                    </div>
                )}
            </div>
        );
    };

    const renderSemester = (yearKey, semKey, subjects) => {
        const path = `${yearKey}-${semKey}`;
        const isOpen = isExpanded(path);
        const semNum = parseInt(semKey.replace('sem-', ''));
        const semLabel = `Semester ${toRoman(semNum)}`;

        return (
            <div key={semKey} style={{ marginLeft: '1.5rem', marginTop: '0.75rem' }}>
                <div
                    onClick={() => toggle(path)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1.25rem',
                        background: 'rgba(16,185,129,0.1)',
                        border: '1px solid rgba(16,185,129,0.2)',
                        borderRadius: 12,
                        cursor: 'pointer',
                        color: '#10b981',
                        fontSize: '1rem',
                        fontWeight: 700
                    }}
                >
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    <span>{semLabel}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'rgba(16,185,129,0.6)' }}>
                        {Object.keys(subjects).length} subjects
                    </span>
                </div>
                {isOpen && (
                    <div style={{ marginTop: '0.5rem' }}>
                        {Object.entries(subjects).map(([subjectId, subjectData]) =>
                            renderSubject(subjectId, subjectData)
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderYear = (yearKey, semesters) => {
        const path = yearKey;
        const isOpen = isExpanded(path);
        const yearNum = yearKey.replace('year-', '');
        const yearLabel = `Year ${yearNum.toUpperCase()}`;

        return (
            <div key={yearKey} style={{ marginBottom: '1.25rem' }}>
                <div
                    onClick={() => toggle(path)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 1.5rem',
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15))',
                        border: '2px solid rgba(16,185,129,0.3)',
                        borderRadius: 16,
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: 'white'
                    }}
                >
                    {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <span>{yearLabel}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                        {Object.keys(semesters).length} semesters
                    </span>
                </div>
                {isOpen && (
                    <div style={{ marginTop: '0.75rem' }}>
                        {Object.entries(semesters)
                            .sort(([a], [b]) => parseInt(a.replace('sem-', '')) - parseInt(b.replace('sem-', '')))
                            .map(([semKey, subjects]) => renderSemester(yearKey, semKey, subjects))
                        }
                    </div>
                )}
            </div>
        );
    };

    return (
        <AdminLayout title="B.Pharm Syllabus Structure">
            <Toast toasts={toasts} removeToast={removeToast} />
            <div style={{ maxWidth: 1100 }}>
                {/* Header */}
                <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16 }}>
                    <h2 style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        📚 B.Pharm Complete Syllabus
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                        View and manage syllabus organized by Year → Semester → Subject → Unit → Topics
                    </p>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => {
                                const allKeys = [];
                                Object.keys(hierarchy).forEach(year => {
                                    allKeys.push(year);
                                    Object.keys(hierarchy[year]).forEach(sem => {
                                        allKeys.push(`${year}-${sem}`);
                                    });
                                });
                                const newExpanded = {};
                                allKeys.forEach(key => newExpanded[key] = true);
                                setExpanded(newExpanded);
                            }}
                            style={{ padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10b981', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                            Expand All
                        </button>
                        <button
                            onClick={() => setExpanded({})}
                            style={{ padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                            Collapse All
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/bpharm-content'}
                            style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, marginLeft: 'auto' }}
                        >
                            <Plus size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                            Add Content
                        </button>
                    </div>
                </div>

                {/* Hierarchy Display */}
                {loading ? (
                    <SkeletonList count={4} />
                ) : Object.keys(hierarchy).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'white' }}>No Syllabus Data Found</div>
                        <div>Please add subjects and content to populate the syllabus structure</div>
                    </div>
                ) : (
                    <div>
                        {Object.entries(hierarchy)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([yearKey, semesters]) => renderYear(yearKey, semesters))
                        }
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

// Helper function to convert number to Roman numerals
function toRoman(num) {
    const romanNumerals = [
        ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ];
    let result = '';
    for (const [roman, value] of romanNumerals) {
        while (num >= value) {
            result += roman;
            num -= value;
        }
    }
    return result;
}
