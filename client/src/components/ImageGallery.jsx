import { useLightbox } from "../hooks/useLightbox";
import LightboxModal from "./LightboxModal";

const ImageGallery = ({ images, columns = 3, className = "" }) => {
  const {
    isOpen,
    currentIndex,
    total,
    open,
    close,
    goNext,
    goPrev,
    goTo,
  } = useLightbox(images);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div
        className={`grid gap-2 grid-cols-2 sm:grid-cols-${Math.min(columns, 4)} ${className}`}
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${
            columns <= 2 ? "200px" : "150px"
          }, 1fr))`,
        }}
      >
        {images.map((item, index) => {
          const imgSrc = item.image || item.url || item.src;
          const imgAlt = item.caption || item.alt || `Gallery image ${index + 1}`;
          return (
            <button
              key={index}
              onClick={() => open(index)}
              className={`group relative overflow-hidden rounded-xl aspect-square bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:ring-offset-2 ${
                index === 0 && images.length > 4
                  ? "row-span-2 col-span-2"
                  : ""
              }`}
              aria-label={`View ${imgAlt}`}
            >
              <img
                src={imgSrc}
                alt={imgAlt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                  />
                </svg>
              </div>
              {index === 0 && images.length > 4 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg font-medium">
                  {images.length} photos
                </div>
              )}
            </button>
          );
        })}
      </div>

      <LightboxModal
        isOpen={isOpen}
        currentImage={images[currentIndex]}
        currentIndex={currentIndex}
        total={total}
        onClose={close}
        onNext={goNext}
        onPrev={goPrev}
        onGoTo={goTo}
      />
    </>
  );
};

export default ImageGallery;
