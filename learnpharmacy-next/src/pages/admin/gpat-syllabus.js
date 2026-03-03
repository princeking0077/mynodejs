import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { ChevronDown, ChevronRight, BookOpen, FileText, Plus, Pencil } from 'lucide-react';
import Toast, { useToast } from '../../components/Toast';
import { SkeletonList } from '../../components/Skeleton';
import { gpatSyllabus } from '../../data/gpatSyllabusData';

const API = process.env.NEXT_PUBLIC_API_URL || '';
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#a855f7', '#14b8a6', '#eab308', '#6366f1', '#22d3ee', '#e11d48'];

export default function GpatSyllabusManager() {
    const [moduleData, setModuleData] = useState({});
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});
    const { toasts, toast, removeToast } = useToast();

    useEffect(() => {
        fetchGpatData();
    }, []);

    const fetchGpatData = async () => {
        setLoading(true);
        try {
            // Fetch GPAT subjects and content from API
            const [subjectsRes, contentRes] = await Promise.all([
                fetch(`${API}/api/subjects/subjects`, { credentials: 'include' }),
                fetch(`${API}/api/content`, { credentials: 'include' })
            ]);

            if (subjectsRes.ok && contentRes.ok) {
                const subjects = await subjectsRes.json();
                const content = await contentRes.json();

                // Filter GPAT subjects only
                const gpatSubjects = subjects.filter(s => s.category === 'gpat');

                // Organize data by module
                const organized = {};

                // Use gpatSyllabus as the structure template
                gpatSyllabus.forEach((module, idx) => {
                    const moduleKey = module.id;

                    // Find matching subject in database (if any)
                    const matchingSubject = gpatSubjects.find(s =>
                        s.slug === module.id || s.title.toLowerCase().includes(module.title.toLowerCase().replace('GPAT ', ''))
                    );

                    // Get all topics for this module
                    const moduleTopics = {};

                    Object.entries(module.topics).forEach(([section, topicList]) => {
                        moduleTopics[section] = topicList.map(topicTitle => {
                            // Find matching content in database
                            const matchingContent = content.find(c =>
                                c.type === 'topic' &&
                                c.title.toLowerCase() === topicTitle.toLowerCase()
                            );

                            return {
                                title: topicTitle,
                                id: matchingContent?.id || null,
                                hasContent: !!matchingContent,
                                subject_id: matchingContent?.subject_id || matchingSubject?.id || null
                            };
                        });
                    });

                    organized[moduleKey] = {
                        ...module,
                        color: COLORS[idx % COLORS.length],
                        subject: matchingSubject,
                        sections: moduleTopics,
                        totalTopics: Object.values(moduleTopics).reduce((sum, topics) => sum + topics.length, 0),
                        topicsWithContent: Object.values(moduleTopics).reduce((sum, topics) =>
                            sum + topics.filter(t => t.hasContent).length, 0
                        )
                    };
                });

                setModuleData(organized);
            }
        } catch (error) {
            console.error('Error fetching GPAT data:', error);
            toast.error('Failed to load GPAT syllabus');
        } finally {
            setLoading(false);
        }
    };

    const toggle = (path) => {
        setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
    };

    const isExpanded = (path) => expanded[path];

    const renderTopic = (topic, moduleId, section, color) => {
        return (
            <div
                key={topic.title}
                onClick={() => {
                    if (topic.id) {
                        window.location.href = `/admin/gpat-content?edit=${topic.id}`;
                    } else {
                        window.location.href = `/admin/gpat-content?module=${moduleId}&section=${section}&topic=${encodeURIComponent(topic.title)}`;
                    }
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    background: topic.hasContent ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${topic.hasContent ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: 6,
                    marginBottom: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = topic.hasContent ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = color + '40';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = topic.hasContent ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = topic.hasContent ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)';
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <span style={{
                        color: topic.hasContent ? '#10b981' : 'rgba(255,255,255,0.7)',
                        fontSize: topic.hasContent ? '0.9rem' : '0.85rem',
                        fontWeight: topic.hasContent ? 600 : 400
                    }}>
                        {topic.title}
                    </span>
                    {topic.hasContent && (
                        <span style={{
                            padding: '0.1rem 0.4rem',
                            fontSize: '0.65rem',
                            background: 'rgba(16,185,129,0.2)',
                            border: '1px solid rgba(16,185,129,0.3)',
                            color: '#10b981',
                            borderRadius: 4,
                            fontWeight: 700
                        }}>
                            ✓
                        </span>
                    )}
                </div>
                <Pencil size={12} style={{ color: topic.hasContent ? '#10b981' : 'rgba(255,255,255,0.3)' }} />
            </div>
        );
    };

    const renderSection = (moduleId, section, topics, color) => {
        const path = `section-${moduleId}-${section}`;
        const isOpen = isExpanded(path);
        const topicsWithContent = topics.filter(t => t.hasContent).length;

        // If section is "Topics", render directly without collapse
        if (section === 'Topics') {
            return (
                <div key={section} style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                    {topics.map(topic => renderTopic(topic, moduleId, section, color))}
                </div>
            );
        }

        return (
            <div key={section} style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                <div
                    onClick={() => toggle(path)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: `${color}10`,
                        border: `1px solid ${color}30`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: color,
                        fontSize: '0.85rem',
                        fontWeight: 600
                    }}
                >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <FileText size={14} />
                    <span>{section}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.7rem', opacity: 0.7 }}>
                        {topicsWithContent}/{topics.length}
                    </span>
                </div>
                {isOpen && (
                    <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                        {topics.map(topic => renderTopic(topic, moduleId, section, color))}
                    </div>
                )}
            </div>
        );
    };

    const renderModule = (moduleId, moduleInfo) => {
        const path = `module-${moduleId}`;
        const isOpen = isExpanded(path);
        const { title, color, sections, totalTopics, topicsWithContent } = moduleInfo;
        const completionPercentage = totalTopics > 0 ? Math.round((topicsWithContent / totalTopics) * 100) : 0;

        return (
            <div key={moduleId} style={{ marginBottom: '1rem' }}>
                <div
                    onClick={() => toggle(path)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 1.5rem',
                        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                        border: `2px solid ${color}40`,
                        borderRadius: 16,
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'white'
                    }}
                >
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    <BookOpen size={18} style={{ color }} />
                    <span style={{ flex: 1 }}>{title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
                        <span style={{
                            color: completionPercentage === 100 ? '#10b981' : completionPercentage > 0 ? '#f59e0b' : 'rgba(255,255,255,0.4)',
                            fontWeight: 600
                        }}>
                            {topicsWithContent}/{totalTopics} topics
                        </span>
                        <div style={{
                            width: 60,
                            height: 6,
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${completionPercentage}%`,
                                height: '100%',
                                background: completionPercentage === 100 ? '#10b981' : color,
                                transition: 'width 0.3s'
                            }} />
                        </div>
                    </div>
                </div>
                {isOpen && (
                    <div style={{ marginTop: '0.75rem' }}>
                        {Object.entries(sections).map(([section, topics]) =>
                            renderSection(moduleId, section, topics, color)
                        )}
                    </div>
                )}
            </div>
        );
    };

    const totalModules = Object.keys(moduleData).length;
    const totalTopicsCount = Object.values(moduleData).reduce((sum, m) => sum + m.totalTopics, 0);
    const totalWithContent = Object.values(moduleData).reduce((sum, m) => sum + m.topicsWithContent, 0);
    const overallCompletion = totalTopicsCount > 0 ? Math.round((totalWithContent / totalTopicsCount) * 100) : 0;

    return (
        <AdminLayout title="GPAT Syllabus Structure">
            <Toast toasts={toasts} removeToast={removeToast} />
            <div style={{ maxWidth: 1100 }}>
                {/* Header */}
                <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16 }}>
                    <h2 style={{ color: '#ef4444', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        🎓 GPAT Complete Syllabus
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        View and manage all 15 GPAT modules with their topics and sections
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444' }}>{totalModules}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Total Modules</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>{totalTopicsCount}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Total Topics</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{totalWithContent}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>With Content</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: overallCompletion === 100 ? '#10b981' : '#3b82f6' }}>
                                {overallCompletion}%
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Completion</div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => {
                                const newExpanded = {};
                                Object.keys(moduleData).forEach(moduleId => {
                                    newExpanded[`module-${moduleId}`] = true;
                                    Object.keys(moduleData[moduleId].sections).forEach(section => {
                                        if (section !== 'Topics') {
                                            newExpanded[`section-${moduleId}-${section}`] = true;
                                        }
                                    });
                                });
                                setExpanded(newExpanded);
                            }}
                            style={{ padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                            Expand All
                        </button>
                        <button
                            onClick={() => setExpanded({})}
                            style={{ padding: '0.5rem 1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, color: '#3b82f6', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                            Collapse All
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/gpat-content'}
                            style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, marginLeft: 'auto' }}
                        >
                            <Plus size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                            Add Content
                        </button>
                    </div>
                </div>

                {/* Module List */}
                {loading ? (
                    <SkeletonList count={4} />
                ) : Object.keys(moduleData).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'white' }}>No GPAT Data Found</div>
                        <div>GPAT syllabus structure will appear here</div>
                    </div>
                ) : (
                    <div>
                        {Object.entries(moduleData).map(([moduleId, moduleInfo]) =>
                            renderModule(moduleId, moduleInfo)
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
