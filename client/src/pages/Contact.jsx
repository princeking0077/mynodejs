import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Here you would integrate EmailJS or Firebase function
    };

    return (
        <Layout>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '4rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>Get in Touch</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                        Have questions or feedback? We'd love to hear from you.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

                    {/* Contact Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ background: 'rgba(34,211,238,0.1)', padding: '1rem', borderRadius: '50%', color: '#22d3ee' }}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 style={{ marginBottom: '0.2rem' }}>Email Us</h3>
                                <p style={{ color: 'var(--text-muted)' }}>support@apexapps.in</p>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ background: 'rgba(168,85,247,0.1)', padding: '1rem', borderRadius: '50%', color: '#a855f7' }}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 style={{ marginBottom: '0.2rem' }}>Call Us</h3>
                                <p style={{ color: 'var(--text-muted)' }}>+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ background: 'rgba(236,72,153,0.1)', padding: '1rem', borderRadius: '50%', color: '#ec4899' }}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 style={{ marginBottom: '0.2rem' }}>Location</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Hyderabad, India</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="glass-panel" style={{ padding: '3rem' }}>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Your Name</label>
                                    <input type="text" placeholder="John Doe" required
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                                    <input type="email" placeholder="john@example.com" required
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Message</label>
                                    <textarea placeholder="How can we help you?" rows={5} required
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white', fontFamily: 'inherit' }}
                                    />
                                </div>
                                <button type="submit" style={{
                                    padding: '1rem', background: 'var(--primary)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '0.5rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1rem'
                                }}>
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
                                <button onClick={() => setSubmitted(false)} style={{ marginTop: '2rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.5rem 1.5rem', borderRadius: '2rem', cursor: 'pointer' }}>
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
