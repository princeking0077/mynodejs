import React from 'react';
import { motion } from 'framer-motion';
import { Dna, Pill, FlaskConical, Activity, Plus } from 'lucide-react';

const icons = [
    { Icon: Dna, color: '#22d3ee', size: 48, delay: 0, duration: 20, x: '10%', y: '20%' },
    { Icon: Pill, color: '#f472b6', size: 42, delay: 2, duration: 25, x: '80%', y: '15%' },
    { Icon: FlaskConical, color: '#a855f7', size: 56, delay: 5, duration: 22, x: '70%', y: '80%' },
    { Icon: Activity, color: '#34d399', size: 38, delay: 1, duration: 18, x: '15%', y: '70%' },
    { Icon: Plus, color: '#fbbf24', size: 24, delay: 3, duration: 15, x: '50%', y: '50%' },
    // Second layer
    { Icon: Dna, color: 'rgba(34, 211, 238, 0.3)', size: 96, delay: 10, duration: 35, x: '-5%', y: '40%' },
    { Icon: Pill, color: 'rgba(244, 114, 182, 0.3)', size: 80, delay: 8, duration: 30, x: '95%', y: '60%' },
];

const PharmaBackground = () => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            {/* Dark Overlay Gradient for depth */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.8) 100%)' }}></div>

            {icons.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ x: item.x, y: item.y, opacity: 0, rotate: 0 }}
                    animate={{
                        y: [item.y, `calc(${item.y} + 50px)`, item.y],
                        rotate: 360,
                        opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: item.delay
                    }}
                    style={{ position: 'absolute', left: 0, top: 0 }} // Positioning handled by initial/animate relative to parent
                >
                    <item.Icon size={item.size} color={item.color} strokeWidth={1.5} />
                </motion.div>
            ))}

            {/* Grid Overlay for Tech feel */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '100px 100px',
                maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
            }}></div>
        </div>
    );
};

export default PharmaBackground;
