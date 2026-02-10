import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PhotoGallery = ({ photos }: { photos: string[] }) => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % photos.length);
        setFade(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, [photos.length]);

  if (photos.length === 0) return null;

  const go = (dir: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent((p) => (p + dir + photos.length) % photos.length);
      setFade(true);
    }, 200);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass">
        <img
          src={photos[current]}
          alt={`Memory ${current + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Nav */}
        <button
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center backdrop-blur-sm"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-primary w-4' : 'bg-foreground/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
