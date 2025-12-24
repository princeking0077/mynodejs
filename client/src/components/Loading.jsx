import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'black',
            color: 'var(--primary)'
        }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid rgba(255,255,255,0.1)',
                    borderTop: '4px solid #22d3ee',
                    borderRadius: '50%'
                }}
            />
        </div>
    );
};

export default Loading;
