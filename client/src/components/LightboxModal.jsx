import { useEffect, useRef } from "react";

const LightboxModal = ({
  isOpen,
  currentImage,
  currentIndex,
  total,
  onClose,
  onNext,
  onPrev,
  onGoTo,
}) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  const imgSrc = currentImage.image || currentImage.url || currentImage.src;
  const imgAlt = currentImage.caption || currentImage.alt || "Gallery image";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Close lightbox"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {total > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white z-10"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white z-10"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="flex flex-col items-center max-w-5xl max-h-[90vh] px-4">
        <img
          src={imgSrc}
          alt={imgAlt}
          className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
        />

        <div className="flex items-center gap-4 mt-4">
          {total > 1 && (
            <div className="flex items-center gap-2">
              {Array.from({ length: total }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onGoTo(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-white w-6"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {currentImage.caption && (
          <p className="text-sm text-white/70 mt-3 text-center max-w-lg">
            {currentImage.caption}
          </p>
        )}

        <p className="text-xs text-white/40 mt-2">
          {currentIndex + 1} / {total}
        </p>
      </div>
    </div>
  );
};

export default LightboxModal;
