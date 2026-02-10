import { useState, useEffect, useRef, useCallback } from 'react';
import { hasUploaded, getFileURL, getFileURLs } from '@/lib/storage';
import UploadScreen from '@/components/birthday/UploadScreen';
import TypewriterText from '@/components/birthday/TypewriterText';
import FloatingEffects from '@/components/birthday/FloatingEffects';
import ConfettiEffect from '@/components/birthday/ConfettiEffect';
import CakeCutting from '@/components/birthday/CakeCutting';
import PhotoGallery from '@/components/birthday/PhotoGallery';

const Index = () => {
  const [ready, setReady] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  // Media URLs
  const [bgMusicUrl, setBgMusicUrl] = useState<string | null>(null);
  const [finalSongUrl, setFinalSongUrl] = useState<string | null>(null);
  const [singlePhotoUrl, setSinglePhotoUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  // Audio refs
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const finalAudioRef = useRef<HTMLAudioElement | null>(null);

  // Page states
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [riddleInput, setRiddleInput] = useState('');
  const [riddleSubmitted, setRiddleSubmitted] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [lyrics, setLyrics] = useState(
    `Every moment with you feels like a dream,\nA gentle warmth, a quiet gleam.\nThrough every storm and sunny day,\nI hope by your side I'll always stay.\n\nHappy Birthday to you,\nMy world, my light.\nYou make everything beautiful,\nYou make everything right. 💫`
  );

  // Check if already uploaded
  useEffect(() => {
    hasUploaded().then((uploaded) => setReady(uploaded));
  }, []);

  // Load files once ready
  useEffect(() => {
    if (!ready) return;
    const load = async () => {
      const [bg, final, single, gallery] = await Promise.all([
        getFileURL('bgMusic'),
        getFileURL('finalSong'),
        getFileURL('singlePhoto'),
        getFileURLs('galleryPhotos'),
      ]);
      setBgMusicUrl(bg);
      setFinalSongUrl(final);
      setSinglePhotoUrl(single);
      setGalleryUrls(gallery);
    };
    load();
  }, [ready]);

  // Background music control
  useEffect(() => {
    if (!bgMusicUrl) return;
    const audio = new Audio(bgMusicUrl);
    audio.loop = true;
    audio.volume = 0.2;
    bgAudioRef.current = audio;

    // Try to play (may need user interaction)
    const tryPlay = () => {
      audio.play().catch(() => {});
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('touchstart', tryPlay);
    };
    document.addEventListener('click', tryPlay);
    document.addEventListener('touchstart', tryPlay);
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.src = '';
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('touchstart', tryPlay);
    };
  }, [bgMusicUrl]);

  // Page 6: pause bg, play final song
  useEffect(() => {
    if (page === 6) {
      // Fade out bg music
      if (bgAudioRef.current) {
        const audio = bgAudioRef.current;
        const fadeOut = setInterval(() => {
          if (audio.volume > 0.02) {
            audio.volume = Math.max(0, audio.volume - 0.02);
          } else {
            audio.pause();
            clearInterval(fadeOut);
          }
        }, 100);
      }
      // Play final song
      if (finalSongUrl) {
        const audio = new Audio(finalSongUrl);
        audio.volume = 0.5;
        audio.loop = true;
        finalAudioRef.current = audio;
        audio.play().catch(() => {});
      }
    } else {
      // Stop final song if navigating away
      if (finalAudioRef.current) {
        finalAudioRef.current.pause();
        finalAudioRef.current = null;
      }
    }
  }, [page, finalSongUrl]);

  const goToPage = useCallback((p: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setPage(p);
      setTransitioning(false);
    }, 400);
  }, []);

  const handleCakeCut = useCallback(() => {
    setCakeCut(true);
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 5000);
  }, []);

  // Loading state
  if (ready === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Upload screen
  if (!ready) {
    return <UploadScreen onComplete={() => setReady(true)} />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingEffects />
      <ConfettiEffect active={confettiActive} />

      <div
        className={`relative z-10 min-h-screen flex flex-col items-center justify-center p-6 transition-opacity duration-400 ${
          transitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* PAGE 1 - Apology */}
        {page === 1 && (
          <div className="w-full max-w-md text-center animate-fade-in-up">
            <h1 className="font-display text-3xl font-bold text-glow mb-8">💌</h1>
            <div className="glass rounded-2xl p-6">
              <TypewriterText
                text="Sorry I didn't come to you when I should be there. I know this is already late. I didn't know where I should go, and I literally didn't have time to make cards. So this is my small effort."
                speed={35}
                onComplete={() => setTypewriterDone(true)}
                className="text-sm"
              />
            </div>
            {typewriterDone && (
              <button
                onClick={() => {
                  setTypewriterDone(false);
                  goToPage(2);
                }}
                className="mt-8 px-8 py-3 rounded-xl gradient-rose font-body font-semibold text-primary-foreground text-sm transition-all hover:opacity-90 active:scale-95 animate-fade-in-up"
              >
                Next →
              </button>
            )}
          </div>
        )}

        {/* PAGE 2 - Another Sorry */}
        {page === 2 && (
          <div className="w-full max-w-md text-center animate-fade-in-up">
            <h1 className="font-display text-3xl font-bold text-glow mb-8">🥺</h1>
            <div className="glass rounded-2xl p-6">
              <TypewriterText
                text="Yes, I know this is common. But I had to give you something for now. So I came up with this. Sorry again."
                speed={40}
                onComplete={() => setTypewriterDone(true)}
                className="text-sm"
              />
            </div>
            {typewriterDone && (
              <button
                onClick={() => {
                  setTypewriterDone(false);
                  goToPage(3);
                }}
                className="mt-8 px-8 py-3 rounded-xl gradient-rose font-body font-semibold text-primary-foreground text-sm transition-all hover:opacity-90 active:scale-95 animate-fade-in-up"
              >
                Continue →
              </button>
            )}
          </div>
        )}

        {/* PAGE 3 - Riddle */}
        {page === 3 && (
          <div className="w-full max-w-md text-center animate-fade-in-up">
            <h1 className="font-display text-3xl font-bold text-glow mb-6">🤔</h1>
            <div className="glass rounded-2xl p-6">
              <p className="font-body text-foreground text-sm leading-relaxed mb-6">
                Cutie, do you know who is very much dumber?
                <br />
                <span className="text-muted-foreground">(Shhh… it's a riddle 🤫)</span>
                <br />
                Guess it correctly to move ahead!
              </p>

              {!riddleSubmitted ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={riddleInput}
                    onChange={(e) => setRiddleInput(e.target.value)}
                    placeholder="Your guess..."
                    className="flex-1 bg-secondary rounded-xl px-4 py-2.5 text-foreground text-sm font-body outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => riddleInput.trim() && setRiddleSubmitted(true)}
                    className="px-5 py-2.5 rounded-xl gradient-rose font-body font-semibold text-primary-foreground text-sm"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div className="animate-fade-in-up">
                  <p className="font-body text-foreground text-sm mb-4">
                    Nope… not what you wrote 😏
                    <br />
                    <span className="text-primary font-bold text-lg text-glow">It's YOU 💙</span>
                  </p>
                  {singlePhotoUrl && (
                    <div className="rounded-xl overflow-hidden my-4 shadow-xl">
                      <img
                        src={singlePhotoUrl}
                        alt="You!"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => goToPage(4)}
                    className="mt-4 px-8 py-3 rounded-xl gradient-rose font-body font-semibold text-primary-foreground text-sm transition-all hover:opacity-90 active:scale-95"
                  >
                    Let's go →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAGE 4 - Cake Cutting */}
        {page === 4 && (
          <div className="w-full max-w-md text-center animate-fade-in-up">
            <h1 className="font-display text-3xl font-bold text-glow mb-2">🎂</h1>
            <p className="font-body text-foreground text-lg mb-8">Now cut the cake 🎂</p>
            <CakeCutting onCut={handleCakeCut} />
            {cakeCut && (
              <div className="animate-fade-in-up mt-6">
                <p className="font-display text-2xl text-glow mb-4">🎉 Happy Birthday! 🎉</p>
                <button
                  onClick={() => goToPage(5)}
                  className="px-8 py-3 rounded-xl gradient-rose font-body font-semibold text-primary-foreground text-sm transition-all hover:opacity-90 active:scale-95"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}

        {/* PAGE 5 - Thank You */}
        {page === 5 && (
          <div className="w-full max-w-md text-center animate-fade-in-up">
            <h1 className="font-display text-3xl font-bold text-glow mb-6">Thank you. 💗</h1>
            <PhotoGallery photos={galleryUrls} />
            <button
              onClick={() => goToPage(6)}
              className="mt-8 px-8 py-3 rounded-xl gradient-rose font-body font-semibold text-primary-foreground text-sm transition-all hover:opacity-90 active:scale-95"
            >
              One Last Thing →
            </button>
          </div>
        )}

        {/* PAGE 6 - Final */}
        {page === 6 && (
          <div className="w-full max-w-md text-center animate-fade-in-up">
            <h1 className="font-display text-2xl font-bold text-glow mb-6">🌙</h1>
            <div className="glass rounded-2xl p-6 mb-6">
              <p className="font-body text-foreground text-sm leading-relaxed mb-6">
                Thank you for existing.
                <br />I wish you to be there till the end.
                <br />No matter how toxic it gets,
                <br />no matter how distant we become,
                <br />let's remain together.
              </p>
              <div className="w-16 h-px bg-primary/30 mx-auto my-4" />
              <p className="font-body text-muted-foreground text-xs leading-relaxed">
                Sorry again. Avika told me to make a video, but I wasn't able to. So instead, I wrote the lyrics for you.
              </p>
            </div>

            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-body text-accent mb-3 uppercase tracking-wider">🎶 Lyrics for you</p>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="w-full h-48 bg-secondary/50 rounded-xl px-4 py-3 text-foreground text-sm font-body outline-none focus:ring-2 focus:ring-primary/50 resize-none leading-relaxed"
              />
            </div>

            <p className="text-muted-foreground text-xs font-body mt-6">
              With all my love 💗
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
