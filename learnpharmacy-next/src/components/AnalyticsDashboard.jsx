import { motion } from 'framer-motion';
import { BookOpen, Users, Eye, TrendingUp, Clock, Target } from 'lucide-react';

export default function AnalyticsDashboard({ stats }) {
    const cards = [
        {
            title: 'Total Content',
            value: stats?.totalContent || 0,
            icon: BookOpen,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981, #3b82f6)'
        },
        {
            title: 'B.Pharm Topics',
            value: stats?.bpharmContent || 0,
            icon: Target,
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
        },
        {
            title: 'GPAT Topics',
            value: stats?.gpatContent || 0,
            icon: Target,
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)'
        },
        {
            title: 'Total Subjects',
            value: stats?.totalSubjects || 0,
            icon: BookOpen,
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)'
        },
        {
            title: 'Active Tests',
            value: stats?.activeTests || 0,
            icon: Clock,
            color: '#ec4899',
            gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)'
        },
        {
            title: 'This Week',
            value: `+${stats?.thisWeek || 0}`,
            icon: TrendingUp,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981, #059669)'
        }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {cards.map((card, idx) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    style={{
                        padding: '1.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 16,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Background gradient */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 100,
                        height: 100,
                        background: card.gradient,
                        opacity: 0.1,
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        pointerEvents: 'none'
                    }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: `${card.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <card.icon size={24} color={card.color} />
                        </div>
                    </div>

                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
                        {card.value}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 500 }}>
                        {card.title}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
