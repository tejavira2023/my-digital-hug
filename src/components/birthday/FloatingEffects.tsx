import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  type: 'heart' | 'star';
}

const FloatingEffects = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const items: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 10 + Math.random() * 16,
      type: Math.random() > 0.5 ? 'heart' : 'star',
    }));
    setParticles(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute opacity-0"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animation: `float-up ${p.duration}s ${p.delay}s infinite ease-in-out, sway ${p.duration * 0.7}s ${p.delay}s infinite ease-in-out`,
          }}
        >
          {p.type === 'heart' ? '💗' : '✨'}
        </span>
      ))}
    </div>
  );
};

export default FloatingEffects;
