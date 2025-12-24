import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ChemicalShowcase = () => {
    const drawAndFill = {
        hidden: { pathLength: 0, fillOpacity: 0 },
        visible: {
            pathLength: 1,
            fillOpacity: 1,
            transition: {
                pathLength: { duration: 3, ease: "easeInOut" },
                fillOpacity: { duration: 1, delay: 2 }
            }
        }
    };

    const float = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div style={{ position: 'relative', padding: '8rem 0', overflow: 'hidden' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>The Science of Life</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>visualizing the invisible building blocks of pharmacy.</p>
                </div>

                {/* Visual Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '4rem', alignItems: 'center' }}>

                    {/* SVG Animations */}
                    <div className="glass-panel" style={{ padding: '2rem', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <svg width="100%" height="auto" viewBox="0 0 200 200" style={{ maxWidth: '300px' }}>
                            {/* Benzene Ring Style Structure */}
                            <motion.path
                                d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z"
                                stroke="#22d3ee"
                                strokeWidth="4"
                                fill="#22d3ee"
                                fillOpacity="0.1"
                                variants={drawAndFill}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            />
                            <motion.circle cx="100" cy="100" r="40" stroke="#a855f7" strokeWidth="2" fill="none"
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1.5, duration: 1 }}
                            />
                            {/* Bonds */}
                            <motion.line x1="100" y1="20" x2="100" y2="0" stroke="#fbbf24" strokeWidth="3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 2 }} />
                            <motion.text x="90" y="-10" fill="#fbbf24" fontSize="14" fontWeight="bold">CH3</motion.text>
                        </svg>

                        <div style={{ position: 'absolute', bottom: '2rem', textAlign: 'center', width: '100%' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Molecular Structures</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Learn structure-activity relationships (SAR) visually.</p>
                        </div>
                    </div>

                    {/* Formulas Info */}
                    <div style={{ position: 'relative', height: '100%' }}>
                        <motion.div variants={float} animate="animate" style={{ marginBottom: '3rem' }}>
                            <div className="glass-panel" style={{ padding: '2rem', display: 'inline-block', border: '1px solid #22d3ee' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22d3ee' }}>C₈H₁₀N₄O₂</span>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Caffeine • Stimulant</div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            style={{ marginLeft: '4rem' }}
                        >
                            <div className="glass-panel" style={{ padding: '2rem', display: 'inline-block', border: '1px solid #a855f7' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7' }}>C₉H₈O₄</span>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Aspirin • Analgesic</div>
                            </div>
                        </motion.div>
                    </div>

                </div>

            </div>
        </div>


    );
};

export default ChemicalShowcase;
