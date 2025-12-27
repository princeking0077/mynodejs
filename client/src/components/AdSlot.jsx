import React, { useEffect, useRef } from 'react';

/**
 * AdSlot Component
 * Creates placeholder slots for Google AdSense ads (NO HARDCODED ADS)
 * After AdSense approval, manually insert ad code in designated slots
 */
const AdSlot = ({
    slotId,
    slotName,
    className = '',
    format = 'auto',
    responsive = true,
    lazyLoad = false
}) => {
    const adRef = useRef(null);

    useEffect(() => {
        // Lazy load implementation
        if (lazyLoad && adRef.current) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Trigger ad load when visible
                            // Note: Actual ad script will be added manually after AdSense approval
                            entry.target.classList.add('ad-loaded');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { rootMargin: '200px' } // Load 200px before entering viewport
            );

            observer.observe(adRef.current);

            return () => {
                if (adRef.current) {
                    observer.unobserve(adRef.current);
                }
            };
        }
    }, [lazyLoad]);

    return (
        <div
            ref={adRef}
            id={slotId}
            className={`ad-slot ${className} ${lazyLoad ? 'ad-lazy' : ''}`}
            data-ad-format={format}
            data-ad-responsive={responsive}
            data-ad-slot-name={slotName}
            style={{
                minHeight: '90px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                borderRadius: '8px',
                padding: '1rem'
            }}
        >
            {/* Placeholder - Remove after adding real ads */}
            <div style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                textAlign: 'center',
                opacity: 0.3
            }}>
                {slotName}
                <br />
                <small>Ad slot ready for AdSense code</small>
            </div>
        </div>
    );
};

export default AdSlot;

/**
 * USAGE INSTRUCTIONS FOR AFTER ADSENSE APPROVAL:
 * 
 * 1. Get approved by Google AdSense (requires 30+ pages with 1200+ words each)
 * 
 * 2. Get your AdSense Publisher ID and Ad Unit IDs from AdSense dashboard
 * 
 * 3. Add AdSense script to client/index.html (inside <head>):
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
 *            crossorigin="anonymous"></script>
 * 
 * 4. Replace the placeholder <div> inside this component with:
 *    <ins className="adsbygoogle"
 *         style={{ display: 'block' }}
 *         data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
 *         data-ad-slot="YOUR_AD_SLOT_ID"
 *         data-ad-format={format}
 *         data-full-width-responsive={responsive}></ins>
 * 
 * 5. Add useEffect to push ads:
 *    useEffect(() => {
 *        try {
 *            (window.adsbygoogle = window.adsbygoogle || []).push({});
 *        } catch (err) {
 *            console.error('AdSense error:', err);
 *        }
 *    }, []);
 */
