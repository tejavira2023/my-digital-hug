import { useState, useRef } from 'react';
import { saveFile, saveFiles, markUploaded } from '@/lib/storage';
import { Music, Image, Upload, Heart, Camera, Disc } from 'lucide-react';

interface UploadScreenProps {
  onComplete: () => void;
}

const UploadScreen = ({ onComplete }: UploadScreenProps) => {
  const [bgMusic, setBgMusic] = useState<File | null>(null);
  const [finalSong, setFinalSong] = useState<File | null>(null);
  const [singlePhoto, setSinglePhoto] = useState<File | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const bgRef = useRef<HTMLInputElement>(null);
  const finalRef = useRef<HTMLInputElement>(null);
  const singleRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!bgMusic || !finalSong || !singlePhoto || galleryPhotos.length < 8) {
      setError('Please upload all required files before continuing.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      await saveFile('bgMusic', bgMusic);
      await saveFile('finalSong', finalSong);
      await saveFile('singlePhoto', singlePhoto);
      await saveFiles('galleryPhotos', galleryPhotos);
      await markUploaded();
      onComplete();
    } catch {
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const FileItem = ({
    icon: Icon,
    label,
    sublabel,
    file,
    onClick,
    count,
  }: {
    icon: typeof Music;
    label: string;
    sublabel: string;
    file: File | null;
    onClick: () => void;
    count?: number;
  }) => (
    <button
      onClick={onClick}
      className="w-full glass rounded-xl p-4 flex items-center gap-4 text-left transition-all hover:border-primary/40 active:scale-[0.98]"
    >
      <div className="w-12 h-12 rounded-lg gradient-rose flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body font-semibold text-foreground text-sm">{label}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{sublabel}</p>
      </div>
      <div className="shrink-0">
        {file || (count && count > 0) ? (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-xs">✓</span>
          </div>
        ) : (
          <Upload className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Heart className="w-10 h-10 text-primary mx-auto mb-3 animate-pulse" />
          <h1 className="font-display text-2xl font-bold text-foreground text-glow">
            Before We Begin...
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-2">
            Upload the files to make this special ✨
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-body font-semibold text-accent uppercase tracking-wider px-1">
            🎵 Audio
          </p>
          <FileItem
            icon={Music}
            label="Background Music"
            sublabel={bgMusic ? bgMusic.name : 'Plays softly across pages'}
            file={bgMusic}
            onClick={() => bgRef.current?.click()}
          />
          <FileItem
            icon={Disc}
            label="Final Custom Song"
            sublabel={finalSong ? finalSong.name : 'Plays only on the last page'}
            file={finalSong}
            onClick={() => finalRef.current?.click()}
          />

          <p className="text-xs font-body font-semibold text-accent uppercase tracking-wider px-1 pt-3">
            🖼️ Photos
          </p>
          <FileItem
            icon={Camera}
            label="Single Photo"
            sublabel={singlePhoto ? singlePhoto.name : 'Used after the riddle reveal'}
            file={singlePhoto}
            onClick={() => singleRef.current?.click()}
          />
          <FileItem
            icon={Image}
            label="Gallery Photos (8–9)"
            sublabel={
              galleryPhotos.length > 0
                ? `${galleryPhotos.length} photos selected`
                : 'Used in the thank you gallery'
            }
            file={null}
            count={galleryPhotos.length}
            onClick={() => galleryRef.current?.click()}
          />
        </div>

        {error && (
          <p className="text-destructive text-xs text-center mt-4 font-body">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full mt-6 py-3.5 rounded-xl gradient-rose font-body font-semibold text-primary-foreground text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        >
          {uploading ? 'Saving...' : 'Continue 💫'}
        </button>
      </div>

      {/* Hidden file inputs */}
      <input ref={bgRef} type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && setBgMusic(e.target.files[0])} />
      <input ref={finalRef} type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && setFinalSong(e.target.files[0])} />
      <input ref={singleRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setSinglePhoto(e.target.files[0])} />
      <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && setGalleryPhotos(Array.from(e.target.files).slice(0, 9))} />
    </div>
  );
};

export default UploadScreen;
