import { useState, useRef, useCallback } from 'react';

interface CakeCuttingProps {
  onCut: () => void;
}

const CakeCutting = ({ onCut }: CakeCuttingProps) => {
  const [cut, setCut] = useState(false);
  const [sliceY, setSliceY] = useState<number | null>(null);
  const startY = useRef<number | null>(null);
  const cakeRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback((y: number) => {
    if (cut) return;
    const rect = cakeRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Only start if near the top of the cake
    if (y < rect.top + rect.height * 0.3) {
      startY.current = y;
      setSliceY(0);
    }
  }, [cut]);

  const handleMove = useCallback((y: number) => {
    if (startY.current === null || cut) return;
    const diff = y - startY.current;
    if (diff > 0) setSliceY(diff);
  }, [cut]);

  const handleEnd = useCallback(() => {
    if (startY.current === null || cut) return;
    const rect = cakeRef.current?.getBoundingClientRect();
    if (!rect) return;
    // If swiped past 60% of the cake height
    if (sliceY && sliceY > rect.height * 0.5) {
      setCut(true);
      onCut();
    }
    startY.current = null;
    if (!cut) setSliceY(null);
  }, [sliceY, cut, onCut]);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={cakeRef}
        className="relative select-none touch-none cursor-pointer"
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      >
        {/* Cake */}
        <div className="relative w-56 h-44">
          {/* Left half */}
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{
              clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
              transform: cut ? 'translateX(-20px) rotate(-5deg)' : 'none',
            }}
          >
            <CakeSVG />
          </div>
          {/* Right half */}
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{
              clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
              transform: cut ? 'translateX(20px) rotate(5deg)' : 'none',
            }}
          >
            <CakeSVG />
          </div>
          {/* Knife line */}
          {sliceY !== null && !cut && (
            <div
              className="absolute left-1/2 top-0 w-0.5 bg-accent -translate-x-1/2 transition-none"
              style={{ height: `${Math.min(sliceY, 176)}px` }}
            />
          )}
        </div>
      </div>
      {!cut && (
        <p className="text-muted-foreground font-body text-xs mt-4 animate-pulse">
          ↕ Swipe down on the cake to cut it
        </p>
      )}
    </div>
  );
};

const CakeSVG = () => (
  <div className="w-56 h-44 flex flex-col items-center justify-end">
    {/* Candles */}
    <div className="flex gap-6 mb-1">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-lg animate-pulse">🔥</span>
          <div className="w-1.5 h-5 rounded-full gradient-gold" />
        </div>
      ))}
    </div>
    {/* Top layer */}
    <div className="w-40 h-8 rounded-t-2xl gradient-rose relative">
      <div className="absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-white/10" />
    </div>
    {/* Middle */}
    <div className="w-44 h-6 bg-secondary" />
    {/* Bottom layer */}
    <div className="w-48 h-10 rounded-b-2xl gradient-rose relative">
      <div className="absolute inset-x-0 bottom-0 h-2 rounded-b-2xl bg-black/10" />
    </div>
    {/* Plate */}
    <div className="w-52 h-3 rounded-b-xl bg-muted mt-0.5" />
  </div>
);

export default CakeCutting;
