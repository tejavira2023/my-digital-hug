const PhotoGallery = ({ photos }: { photos: string[] }) => {
  if (photos.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      {photos.map((src, i) => (
        <div key={i} className="rounded-2xl overflow-hidden shadow-lg glass">
          <img
            src={src}
            alt={`Memory ${i + 1}`}
            className="w-full h-auto object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
