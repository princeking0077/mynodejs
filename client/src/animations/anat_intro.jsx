import React from 'react';
import { motion } from 'framer-motion';

const AnatIntro = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'white'
        }}>
            <h3>Interactive Human Body Map</h3>
            <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>Hover over the regions to identify them.</p>

            <div style={{ position: 'relative', width: '300px', height: '400px' }}>
                {/* Head */}
                <motion.div
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(34, 211, 238, 0.4)' }}
                    style={{
                        position: 'absolute', top: '0', left: '100px',
                        width: '100px', height: '100px',
                        borderRadius: '50%', border: '2px solid #22d3ee',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', background: 'rgba(34,211,238,0.1)'
                    }}
                >
                    Head
                </motion.div>

                {/* Torso */}
                <motion.div
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(34, 211, 238, 0.4)' }}
                    style={{
                        position: 'absolute', top: '110px', left: '75px',
                        width: '150px', height: '200px',
                        borderRadius: '20px', border: '2px solid #22d3ee',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', background: 'rgba(34,211,238,0.1)'
                    }}
                >
                    Thorax
                </motion.div>

                {/* Arms - Simple lines/boxes for demo */}
                <motion.div
                    whileHover={{ scale: 1.1, x: -10 }}
                    style={{
                        position: 'absolute', top: '110px', left: '15px',
                        width: '50px', height: '150px',
                        border: '2px solid #22d3ee', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(34,211,238,0.1)'
                    }}
                >
                    R. Arm
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.1, x: 10 }}
                    style={{
                        position: 'absolute', top: '110px', right: '15px',
                        width: '50px', height: '150px',
                        border: '2px solid #22d3ee', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(34,211,238,0.1)'
                    }}
                >
                    L. Arm
                </motion.div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                <strong>Current Info:</strong> This is a React component (`anat_intro.jsx`).
            </div>
        </div>
    );
};

export default AnatIntro;
