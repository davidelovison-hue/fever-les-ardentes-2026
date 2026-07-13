import { GALLERY_IMAGES, POSTER_IMAGE } from '../data/lesArdentesFestival';

export const FESTIVAL_EVENT_ID = 'les-ardentes-2026';

/** Official Les Ardentes wordmark (white on dark header). */
export const FESTIVAL_LOGO_SRC = `${import.meta.env.BASE_URL}les-ardentes-logo.svg`;

export const FESTIVAL_EVENT = {
  id: FESTIVAL_EVENT_ID,
  title: 'Les Ardentes 2026',
  image: GALLERY_IMAGES[0]?.src ?? POSTER_IMAGE,
  venue: 'Parc Rocourt — Liège, Belgium',
  dateLine: '2–5 July 2026 (Thursday–Sunday)',
};

export function getFestivalEvent(eventId: string) {
  if (eventId === FESTIVAL_EVENT_ID) return FESTIVAL_EVENT;
  return null;
}
