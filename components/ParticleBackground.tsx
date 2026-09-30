'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['#d4af37', '#f4d03f', '#2d4a7a', '#1e3a5f'];
    const items: Particle[] = [];

    for (let i = 0; i < 40; i++) {
      items.push({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    setParticles(items);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes particle-rise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity);
          }
          90% {
            opacity: var(--opacity);
          }
          100% {
            transform: translateY(-110vh) translateX(30px);
            opacity: 0;
          }
        }

        .particle-item {
          position: fixed;
          bottom: -10px;
          border-radius: 50%;
          pointer-events: none;
          animation: particle-rise linear infinite;
          z-index: 0;
        }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle-item"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              ['--opacity' as any]: p.opacity,
            }}
          />
        ))}
      </div>
    </>
  );
}
