export const Skeleton = ({ width = '100%', height = 20, borderRadius = 8, style = {} }) => {
    return (
        <div
            style={{
                width,
                height,
                borderRadius,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-loading 1.5s ease-in-out infinite',
                ...style
            }}
        >
            <style jsx>{`
                @keyframes skeleton-loading {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }
            `}</style>
        </div>
    );
};

export const SkeletonCard = () => (
    <div style={{
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Skeleton width={48} height={48} borderRadius={12} />
        </div>
        <Skeleton width='60%' height={32} style={{ marginBottom: '0.5rem' }} />
        <Skeleton width='40%' height={16} />
    </div>
);

export const SkeletonList = ({ count = 5 }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 12,
                marginBottom: '0.5rem'
            }}>
                <Skeleton width='80%' height={18} style={{ marginBottom: '0.5rem' }} />
                <Skeleton width='40%' height={14} />
            </div>
        ))}
    </>
);

export default Skeleton;
