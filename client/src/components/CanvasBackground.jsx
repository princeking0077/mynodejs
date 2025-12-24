import React, { useRef, useEffect } from 'react';

const CanvasBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 30 : 70; // Fewer particles on phone
        const connectionDistance = isMobile ? 100 : 160;
        const mouseDistance = isMobile ? 150 : 250;

        let mouse = { x: null, y: null };

        // Resize handler
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        handleResize();

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4; // Velocity X
                this.vy = (Math.random() - 0.5) * 0.4; // Velocity Y
                this.size = Math.random() * 2 + 1;
                this.baseSize = this.size;
                this.colorType = Math.random() > 0.5 ? 'cyan' : 'purple';
                this.pulseSpeed = 0.02 + Math.random() * 0.03;
                this.angle = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Pulsing Effect
                this.angle += this.pulseSpeed;
                this.size = this.baseSize + Math.sin(this.angle) * 0.5;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse Interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseDistance - distance) / mouseDistance;
                        const directionX = forceDirectionX * force * this.size * 2; // Stronger push
                        const directionY = forceDirectionY * force * this.size * 2;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.abs(this.size), 0, Math.PI * 2);

                // Dynamic Color with Alpha Pulse
                const alpha = 0.3 + (Math.sin(this.angle) + 1) / 4;
                if (this.colorType === 'cyan') {
                    ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
                } else {
                    ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
                }
                ctx.fill();
            }
        }

        // Initialize Particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connecting lines
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        let opacity = 1 - (distance / connectionDistance);
                        ctx.strokeStyle = `rgba(148, 163, 184, ${opacity * 0.15})`; // Slate-400
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }

            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)' }} />;
};

export default CanvasBackground;
