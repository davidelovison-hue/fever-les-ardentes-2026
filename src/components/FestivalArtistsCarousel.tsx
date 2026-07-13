import { useEffect, useState } from 'react';
import type { FestivalArtist } from '../data/lesArdentesArtists';
import './FestivalArtistsCarousel.css';

type FestivalArtistsCarouselProps = {
  artists: FestivalArtist[];
  title?: string;
  hint?: string | null;
  hideDay?: boolean;
  className?: string;
};

function ArtistChipAvatar({ artist }: { artist: FestivalArtist }) {
  const [src, setSrc] = useState(artist.image);

  useEffect(() => {
    setSrc(artist.image);
  }, [artist.id, artist.image]);

  return (
    <img
      className="festivalArtistChip__img"
      src={src}
      alt=""
      width={92}
      height={92}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (src !== artist.fallbackImage) setSrc(artist.fallbackImage);
      }}
    />
  );
}

export function FestivalArtistsCarousel({
  artists,
  title = 'Lineup',
  hint = 'Swipe for more',
  hideDay = true,
  className = '',
}: FestivalArtistsCarouselProps) {
  if (artists.length === 0) return null;

  return (
    <section
      className={`festivalArtistsCarousel${className ? ` ${className}` : ''}`}
      aria-label="Festival lineup artists"
    >
      <div className="festivalArtistsCarousel__head">
        <h2 className="festivalArtistsCarousel__title">{title}</h2>
        {hint != null && hint !== '' && (
          <p className="festivalArtistsCarousel__hint">{hint}</p>
        )}
      </div>
      <div className="festivalArtistsCarousel__track" role="list" tabIndex={0}>
        {artists.map((artist) => (
          <div key={artist.id} className="festivalArtistChip" role="listitem">
            <span className="festivalArtistChip__avatar">
              <ArtistChipAvatar artist={artist} />
            </span>
            <span className="festivalArtistChip__name">{artist.name}</span>
            {!hideDay && artist.day ? (
              <span className="festivalArtistChip__day">{artist.day}</span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
