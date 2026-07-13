import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import {
  FESTIVAL_MEDIA_HERO,
  GALLERY_IMAGE_URLS,
  GALLERY_IMAGES,
} from '../data/lesArdentesFestival';
import {
  buildGalleryItems,
  FestivalGalleryModal,
  galleryIndexForSrc,
} from './FestivalGalleryModal';
import './FestivalGallery.css';

function GalleryIcon() {
  return (
    <span className="eventMediaHero__galleryIcon" aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

function GalleryButton({
  className,
  onClick,
}: {
  className: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button type="button" className={className} onClick={onClick}>
      <GalleryIcon />
      Gallery
    </button>
  );
}

export function FestivalGallery() {
  const config = FESTIVAL_MEDIA_HERO;
  const alt = GALLERY_IMAGES[0]?.alt ?? 'Les Ardentes 2026';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const galleryItems = useMemo(
    () => buildGalleryItems(GALLERY_IMAGE_URLS, config.video, config.videoPoster),
    [config.video, config.videoPoster],
  );

  const canOpenGallery = galleryItems.length > 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [playing]);

  const togglePlayback = (e: MouseEvent) => {
    e.stopPropagation();
    setPlaying((value) => !value);
  };

  const openGalleryAt = (index: number) => {
    if (!canOpenGallery) return;
    const i = Math.min(Math.max(0, index), galleryItems.length - 1);
    setGalleryStartIndex(i);
    setGalleryOpen(true);
  };

  return (
    <>
      <section className="festivalGalleryBand" aria-label="Festival media">
        <div className="eventMediaHero">
          <div className="eventMediaHero__main">
            <video
              ref={videoRef}
              className="eventMediaHero__video"
              src={config.video}
              poster={config.videoPoster}
              muted
              playsInline
              loop
              autoPlay
              aria-label={`${alt} video`}
            />
            {canOpenGallery ? (
              <button
                type="button"
                className="eventMediaHero__mediaOpen"
                aria-label="Open gallery at video"
                onClick={() => openGalleryAt(0)}
              />
            ) : null}
            <button
              type="button"
              className="eventMediaHero__playBtn"
              aria-label={playing ? 'Pause video' : 'Play video'}
              onClick={togglePlayback}
            >
              {playing ? (
                <span className="eventMediaHero__playIcon" aria-hidden>
                  <span />
                  <span />
                </span>
              ) : (
                <span className="eventMediaHero__playIcon eventMediaHero__playIcon--play" aria-hidden />
              )}
            </button>
            {canOpenGallery ? (
              <GalleryButton
                className="eventMediaHero__galleryBtn eventMediaHero__galleryBtn--onVideo"
                onClick={(e) => {
                  e.stopPropagation();
                  openGalleryAt(0);
                }}
              />
            ) : null}
            <div className="eventMediaHero__progress" aria-hidden>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          {config.grid.map((src, index) => (
            <div key={`${src}-${index}`} className="eventMediaHero__cellWrap">
              <button
                type="button"
                className="eventMediaHero__cell"
                disabled={!canOpenGallery}
                aria-label={`Open gallery, image ${index + 1}`}
                onClick={() => openGalleryAt(galleryIndexForSrc(galleryItems, src))}
              >
                <img
                  className="eventMediaHero__img"
                  src={src}
                  alt=""
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </button>
              {index === 3 && canOpenGallery ? (
                <GalleryButton
                  className="eventMediaHero__galleryBtn eventMediaHero__galleryBtn--onTile"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGalleryAt(galleryIndexForSrc(galleryItems, src));
                  }}
                />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {galleryOpen && canOpenGallery ? (
        <FestivalGalleryModal
          images={GALLERY_IMAGE_URLS}
          alt={alt}
          videoSrc={config.video}
          videoPoster={config.videoPoster}
          initialIndex={galleryStartIndex}
          onClose={() => setGalleryOpen(false)}
        />
      ) : null}
    </>
  );
}
