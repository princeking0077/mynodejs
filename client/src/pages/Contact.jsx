import React, { useState } from 'react';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <Layout>
            <SEO title="Contact Us" description="Get in touch with the LearnPharmacy team." />

            <div className="container" style={{ paddingBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '4rem' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800' }}>Get in Touch</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                        Have questions or feedback? We'd love to hear from you.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

                    {/* Contact Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[{ icon: Mail, title: 'Email Us', desc: 'support@learnpharmacy.in', color: '#22d3ee' },
                        { icon: Phone, title: 'Call Us', desc: '+91 98765 43210', color: '#a855f7' },
                        { icon: MapPin, title: 'Location', desc: 'Hyderabad, India', color: '#ec4899' }
                        ].map((item, i) => (
                            <div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ background: `${item.color}20`, padding: '0.8rem', borderRadius: '50%', color: item.color }}>
                                    <item.icon size={22} />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.2rem', fontSize: '1.1rem' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your Name</label>
                                    <input type="text" placeholder="John Doe" required
                                        style={{ width: '100%', padding: '0.9rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                                    <input type="email" placeholder="john@example.com" required
                                        style={{ width: '100%', padding: '0.9rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Message</label>
                                    <textarea placeholder="How can we help you?" rows={5} required
                                        style={{ width: '100%', padding: '0.9rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', fontFamily: 'inherit', outline: 'none' }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                                    <Send size={18} /> Send Message
                                </button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', color: '#22c55e', marginBottom: '1.5rem' }}>
                                    <Send size={32} />
                                </div>
                                <h2>Message Sent!</h2>
                                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Thank you for reaching out. We will get back to you shortly.</p>
                                <button onClick={() => setSubmitted(false)} className="btn btn-glass" style={{ marginTop: '2rem' }}>
                                    Send Another
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default Contact;
