import React, { useState } from 'react';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <Layout>
            <SEO title="Contact Us - LearnPharmacy.in" description="Get in touch with the LearnPharmacy team regarding support, partnerships, or feedback." />

            <div className="container" style={{ paddingBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '4rem' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800' }}>Get in Touch</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        We value your feedback. Whether you have a question about our content, a suggestion for improvement, or just want to say hi, we're here to listen.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

                    {/* Contact Information Side */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Contact Information</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '1rem', borderRadius: '12px', color: '#22d3ee', height: 'fit-content' }}>
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Email Us</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>For general support & inquiries:</p>
                                        <a href="mailto:support@learnpharmacy.in" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>support@learnpharmacy.in</a>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1rem', borderRadius: '12px', color: '#a855f7', height: 'fit-content' }}>
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Call Us</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Available Mon-Fri, 9am - 6pm:</p>
                                        <a href="tel:+919876543210" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>+91 98765 43210</a>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1rem', borderRadius: '12px', color: '#ec4899', height: 'fit-content' }}>
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Location</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Hyderabad, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.05))' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <MessageSquare size={24} color="#3b82f6" />
                                <h3 style={{ margin: 0 }}>Student Feedback</h3>
                            </div>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                "This platform helped me visualize organic chemistry mechanisms like never before. The interactive pages are a game changer!"
                            </p>
                        </div>
                    </div>

                    {/* Contact Form Side */}
                    <div className="glass-panel" style={{ padding: '3rem' }}>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Send a Message</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>We typically respond within 24 hours.</p>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your Name</label>
                                    <input type="text" placeholder="John Doe" required
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.8rem', color: 'white', outline: 'none', fontSize: '1rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                                    <input type="email" placeholder="john@example.com" required
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.8rem', color: 'white', outline: 'none', fontSize: '1rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Subject</label>
                                    <select style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.8rem', color: 'white', outline: 'none', fontSize: '1rem' }}>
                                        <option style={{ background: '#1a1a1a' }}>General Inquiry</option>
                                        <option style={{ background: '#1a1a1a' }}>Technical Support</option>
                                        <option style={{ background: '#1a1a1a' }}>Content Correction</option>
                                        <option style={{ background: '#1a1a1a' }}>Partnership</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Message</label>
                                    <textarea placeholder="How can we help you?" rows={5} required
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.8rem', color: 'white', fontFamily: 'inherit', outline: 'none', fontSize: '1rem', resize: 'vertical' }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '1rem', padding: '1rem' }}>
                                    <Send size={20} /> Send Message
                                </button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', color: '#22c55e', marginBottom: '2rem' }}>
                                    <Send size={48} />
                                </div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Message Sent!</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                                    Thank you for reach out to us. We have received your message and will get back to you shortly at your provided email address.
                                </p>
                                <button onClick={() => setSubmitted(false)} className="btn btn-glass">
                                    Send Another Message
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
