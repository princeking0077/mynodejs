import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ChemicalShowcase = () => {

    // Abstract Particle Variants
    const particleVariant = (delay, duration) => ({
        animate: {
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
            transition: {
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }
        }
    });

    const orbVariant = {
        animate: {
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
            boxShadow: [
                "0 0 20px rgba(34, 211, 238, 0.2)",
                "0 0 60px rgba(168, 85, 247, 0.4)",
                "0 0 20px rgba(34, 211, 238, 0.2)"
            ],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div style={{ position: 'relative', padding: '10rem 0', overflow: 'hidden' }}>

            {/* Background elements */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-gradient"
                        style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}
                    >
                        The Science of Life
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}
                    >
                        Explore the microscopic interactions that define capability and cure.
                    </motion.p>
                </div>

                {/* Abstract Visuals Container */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>

                    {/* Left: Glowing Core Animation */}
                    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {/* Central Orb */}
                        <motion.div
                            variants={orbVariant}
                            animate="animate"
                            style={{
                                width: '150px', height: '150px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2))',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #22d3ee, #a855f7)', opacity: 0.8 }}></div>
                        </motion.div>

                        {/* Orbiting Particles */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                                style={{ position: 'absolute', width: `${200 + i * 40}px`, height: `${200 + i * 40}px`, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)' }}
                            >
                                <motion.div
                                    style={{
                                        width: '8px', height: '8px', background: i % 2 === 0 ? '#22d3ee' : '#a855f7', borderRadius: '50%',
                                        position: 'absolute', top: '50%', left: '-4px', boxShadow: `0 0 10px ${i % 2 === 0 ? '#22d3ee' : '#a855f7'}`
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Right: Floating Info Cards */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        <motion.div variants={particleVariant(0, 4)} animate="animate"
                            className="glass-panel"
                            style={{ padding: '2rem', borderLeft: '4px solid #a855f7', background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.05), transparent)' }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Molecular Dynamics</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Understand drug-receptor interactions at the atomic level.</p>
                        </motion.div>

                        <motion.div variants={particleVariant(2, 5)} animate="animate"
                            className="glass-panel"
                            style={{ padding: '2rem', borderLeft: '4px solid #22d3ee', marginLeft: '3rem', background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.05), transparent)' }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Pharmacokinetics</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Visualize absorption, distribution, metabolism, and excretion.</p>
                        </motion.div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default ChemicalShowcase;
