import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
}

const ParticleSwarm = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const colors = [
    'rgba(34, 211, 238, ', // cyan-400
    'rgba(56, 189, 248, ', // sky-400
    'rgba(45, 212, 191, ', // teal-400
    'rgba(20, 184, 166, ', // teal-500
    'rgba(6, 182, 212, ',  // cyan-500
  ];

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 8000), 200);

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.4 + 0.1;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: baseAlpha,
        baseAlpha,
      });
    }

    particlesRef.current = particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const mouse = mouseRef.current;

    // Clear with fade effect
    ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
    ctx.fillRect(0, 0, width, height);

    const particles = particlesRef.current;
    const connectionDistance = 120;
    const mouseInfluenceRadius = 200;

    particles.forEach((particle, i) => {
      // Mouse influence
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseInfluenceRadius && distance > 0) {
        const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius;
        const angle = Math.atan2(dy, dx);
        
        // Particles are gently attracted to cursor
        particle.vx += Math.cos(angle) * force * 0.02;
        particle.vy += Math.sin(angle) * force * 0.02;
        
        // Increase alpha when near mouse
        particle.alpha = Math.min(particle.baseAlpha + force * 0.5, 0.9);
      } else {
        particle.alpha += (particle.baseAlpha - particle.alpha) * 0.05;
      }

      // Apply velocity with damping
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      // Random drift
      particle.vx += (Math.random() - 0.5) * 0.02;
      particle.vy += (Math.random() - 0.5) * 0.02;

      // Limit velocity
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > 1.5) {
        particle.vx = (particle.vx / speed) * 1.5;
        particle.vy = (particle.vy / speed) * 1.5;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color + particle.alpha + ')';
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const cdx = other.x - particle.x;
        const cdy = other.y - particle.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < connectionDistance) {
          const opacity = (1 - cdist / connectionDistance) * 0.15 * particle.alpha;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    // Draw subtle glow around mouse
    if (mouse.x > 0 && mouse.y > 0) {
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 150
      );
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.03)');
      gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

export default ParticleSwarm;
