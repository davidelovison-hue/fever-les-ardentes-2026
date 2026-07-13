import { useEffect, useMemo, useState } from 'react';

type GalleryItem =
  | { kind: 'video'; src: string; poster?: string }
  | { kind: 'image'; src: string };

type FestivalGalleryModalProps = {
  images: string[];
  alt: string;
  videoSrc?: string;
  videoPoster?: string;
  initialIndex?: number;
  onClose: () => void;
};

function buildGalleryItems(images: string[], videoSrc?: string, videoPoster?: string): GalleryItem[] {
  const out: GalleryItem[] = [];
  if (videoSrc) {
    out.push({ kind: 'video', src: videoSrc, poster: videoPoster });
  }
  const seen = new Set<string>();
  if (videoPoster) seen.add(videoPoster);
  for (const src of images) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    out.push({ kind: 'image', src });
  }
  return out;
}

export function galleryIndexForSrc(items: GalleryItem[], src: string): number {
  const idx = items.findIndex((item) => {
    if (item.kind === 'image') return item.src === src;
    if (item.kind === 'video') return item.poster === src || item.src === src;
    return false;
  });
  return idx >= 0 ? idx : 0;
}

export function FestivalGalleryModal({
  images,
  alt,
  videoSrc,
  videoPoster,
  initialIndex = 0,
  onClose,
}: FestivalGalleryModalProps) {
  const items = useMemo(
    () => buildGalleryItems(images, videoSrc, videoPoster),
    [images, videoSrc, videoPoster],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const i = Math.min(Math.max(0, initialIndex), items.length - 1);
    setActiveIndex(i);
  }, [initialIndex, items.length]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (items.length === 0) return null;

  const active = items[Math.min(activeIndex, items.length - 1)]!;
  const showNav = items.length > 1;

  const goPrev = () => {
    setActiveIndex((i) => (i - 1 + items.length) % items.length);
  };

  const goNext = () => {
    setActiveIndex((i) => (i + 1) % items.length);
  };

  return (
    <div
      className="eventMediaHero__modal"
      role="dialog"
      aria-modal="true"
      aria-label="Event gallery"
      onClick={onClose}
    >
      <div className="eventMediaHero__modalPanel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="eventMediaHero__modalClose" aria-label="Close gallery" onClick={onClose}>
          ×
        </button>
        <section className="eventGallery eventGallery--modal" aria-label="Event gallery">
          <div className="eventGallery__viewer">
            {showNav ? (
              <>
                <button
                  type="button"
                  className="eventGallery__nav eventGallery__nav--prev"
                  aria-label="Previous"
                  onClick={goPrev}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="eventGallery__nav eventGallery__nav--next"
                  aria-label="Next"
                  onClick={goNext}
                >
                  ›
                </button>
              </>
            ) : null}
            <div className="eventGallery__stage">
              {active.kind === 'video' ? (
                <video
                  key={active.src}
                  className="eventGallery__main eventGallery__main--video"
                  src={active.src}
                  poster={active.poster}
                  muted
                  playsInline
                  loop
                  autoPlay
                  aria-label={`${alt} video`}
                />
              ) : (
                <img
                  key={active.src}
                  className="eventGallery__main"
                  src={active.src}
                  alt={alt}
                  loading="eager"
                  decoding="async"
                />
              )}
              <span className="eventGallery__badge" aria-live="polite">
                {activeIndex + 1}/{items.length}
              </span>
            </div>
          </div>
          {showNav ? (
            <div className="eventGallery__thumbs" role="list" aria-label="Gallery thumbnails">
              {items.map((item, index) => (
                <button
                  key={item.kind === 'video' ? `video-${item.src}` : item.src}
                  type="button"
                  role="listitem"
                  className={`eventGallery__thumb ${index === activeIndex ? 'eventGallery__thumb--active' : ''}`}
                  aria-label={item.kind === 'video' ? 'View video' : `View image ${index + 1}`}
                  aria-current={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                >
                  <img
                    src={item.kind === 'video' ? (item.poster ?? item.src) : item.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  {item.kind === 'video' ? (
                    <span className="eventGallery__thumbPlay" aria-hidden>
                      <span className="eventGallery__thumbPlayIcon" />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export { buildGalleryItems };
