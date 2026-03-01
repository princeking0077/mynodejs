import React from 'react';

const TipTapEditor = ({ value, onChange }) => {
    return (
        <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{
                width: '100%',
                minHeight: '300px',
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none'
            }}
            placeholder="Enter HTML content here..."
        />
    );
};

export default TipTapEditor;
