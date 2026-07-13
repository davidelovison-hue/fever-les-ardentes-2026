export type PlanCategory = {
  id: string;
  title: string;
};

export const PLAN_CATEGORIES: PlanCategory[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'tickets', title: 'Festival Tickets' },
  { id: 'camping', title: 'Camping' },
  { id: 'transport', title: 'Travel & Parking' },
  { id: 'merch', title: 'Merch' },
];

const LES_ARDENTES_CDN = 'https://lesardentes.be/wp-content/uploads';

const BASE = import.meta.env.BASE_URL;

export const HERO_GRID_IMAGES = [
  `${BASE}hero-grid-1.jpg`,
  `${BASE}hero-grid-2.jpg`,
  `${BASE}hero-grid-3.jpg`,
  `${BASE}hero-grid-4.jpg`,
] as const;

export const GALLERY_IMAGES = [
  {
    src: `${LES_ARDENTES_CDN}/2026/04/7c3a6185-scaled-e1776335645873.jpg`,
    alt: 'Les Ardentes Festival — crowd and main stage',
  },
  {
    src: HERO_GRID_IMAGES[0],
    alt: 'Festival crowd facing the main stage',
  },
  {
    src: HERO_GRID_IMAGES[1],
    alt: 'Outdoor music festival stage and audience',
  },
  {
    src: HERO_GRID_IMAGES[2],
    alt: 'Festival crowd with hands up at night',
  },
  {
    src: HERO_GRID_IMAGES[3],
    alt: 'Concert stage with lights and crowd',
  },
];

export const FESTIVAL_HERO_VIDEO =
  'https://pacha-production.s3.eu-west-1.amazonaws.com/media/pacha_website__v01+(1080p)+(3).mp4';

export const FESTIVAL_MEDIA_HERO = {
  video: FESTIVAL_HERO_VIDEO,
  videoPoster: GALLERY_IMAGES[0]?.src ?? '',
  grid: GALLERY_IMAGES.slice(1, 5).map((image) => image.src) as [string, string, string, string],
};

export const GALLERY_IMAGE_URLS = GALLERY_IMAGES.map((image) => image.src);

export const POSTER_IMAGE = `${import.meta.env.BASE_URL}les-ardentes-overview.jpg`;

export const AVATAR_URL =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=80';

export const VENUE_IMAGE = `${import.meta.env.BASE_URL}les-ardentes-venue.jpg`;

export const OVERVIEW_INFO = [
  {
    icon: '📅',
    label: 'Date',
    text: '2–5 July 2026 (Thursday–Sunday)',
  },
  {
    icon: '📍',
    label: 'Location',
    text: 'Parc Rocourt — Liège, Belgium',
  },
  {
    icon: '♿',
    label: 'Accessibility',
    text: 'PMR/PSH tickets available via reservation. Contact pmr@lesardentes.be for assistance.',
  },
  {
    icon: '🎫',
    label: 'Article 27',
    text: 'Cultural scheme tickets available via article27.be/festivals where applicable.',
  },
];
