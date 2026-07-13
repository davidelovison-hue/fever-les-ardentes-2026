import { GALLERY_IMAGES } from './lesArdentesFestival';

const CDN = 'https://lesardentes.be/wp-content/uploads';

export type FestivalArtist = {
  id: string;
  name: string;
  image: string;
  fallbackImage: string;
  day?: string;
};

const FALLBACK = GALLERY_IMAGES[0]?.src ?? `${CDN}/2026/04/7c3a6185-scaled-e1776335645873.jpg`;

/** Headliners from lesardentes.be/lineup (2026 edition). */
export const LES_ARDENTES_ARTISTS: FestivalArtist[] = [
  {
    id: 'playboi-carti',
    name: 'Playboi Carti',
    image: `${CDN}/2026/01/Design-sans-titre-47-e1775571309719.png`,
    fallbackImage: FALLBACK,
    day: 'Thu 2 Jul',
  },
  {
    id: 'future',
    name: 'Future',
    image: `${CDN}/2025/11/FUTURE-Les-Ardentes-Alternate-Photo-3-scaled-e1775572038123.jpeg`,
    fallbackImage: FALLBACK,
    day: 'Fri 3 Jul',
  },
  {
    id: 'damso',
    name: 'DAMSO',
    image: `${CDN}/2026/06/7232521-e1780498676933.jpg`,
    fallbackImage: FALLBACK,
    day: 'Sat 4 Jul',
  },
  {
    id: 'niska',
    name: 'NISKA',
    image: `${CDN}/2026/04/Photo_Niska-e1776088436661.jpg`,
    fallbackImage: FALLBACK,
    day: 'Sun 5 Jul',
  },
  {
    id: 'aya-nakamura',
    name: 'Aya Nakamura',
    image: `${CDN}/2025/11/Aya-Nakamura-2026-festival-template-carre-1-e1775569734477.webp`,
    fallbackImage: FALLBACK,
    day: 'Thu 2 Jul',
  },
  {
    id: 'black-eyed-peas',
    name: 'Black Eyed Peas',
    image: `${CDN}/2025/11/WhatsApp-Image-2025-11-07-at-12.12.10-e1775570093507.jpeg`,
    fallbackImage: FALLBACK,
    day: 'Fri 3 Jul',
  },
  {
    id: 'charlotte-de-witte',
    name: 'Charlotte de Witte',
    image: `${CDN}/2026/03/251025_shot03_0149_Marie-Wynants-e1772463519860.png`,
    fallbackImage: FALLBACK,
    day: 'Sat 4 Jul',
  },
  {
    id: 'lost-frequencies',
    name: 'Lost Frequencies',
    image: `${CDN}/2026/01/LF-ARTWORK-FINAL-7-e1775569714540.jpg`,
    fallbackImage: FALLBACK,
    day: 'Sun 5 Jul',
  },
  {
    id: 'plk',
    name: 'PLK',
    image: `${CDN}/2025/11/Design-sans-titre-30-e1775571628759.png`,
    fallbackImage: FALLBACK,
    day: 'Thu 2 Jul',
  },
  {
    id: 'josman',
    name: 'Josman',
    image: `${CDN}/2025/12/LEAU-Part.II_2-1-scaled-e1775573235671.webp`,
    fallbackImage: FALLBACK,
    day: 'Fri 3 Jul',
  },
  {
    id: 'bigflo-oli',
    name: 'BIGFLO & OLI',
    image: `${CDN}/2026/02/BIGFLO-OLI-BOBY-BOBY-0559-021-1.webp`,
    fallbackImage: FALLBACK,
    day: 'Sat 4 Jul',
  },
  {
    id: 'kaaris',
    name: 'Kaaris',
    image: `${CDN}/2026/04/7c3a6185-scaled-e1776335645873.jpg`,
    fallbackImage: FALLBACK,
    day: 'Sun 5 Jul',
  },
  {
    id: 'riles',
    name: 'Riles',
    image: `${CDN}/2026/02/press1-e1775571742966.jpg`,
    fallbackImage: FALLBACK,
    day: 'Thu 2 Jul',
  },
  {
    id: 'anyme',
    name: 'Anyme et ses potes',
    image: `${CDN}/2026/06/anyme-e1781096600562.jpeg`,
    fallbackImage: FALLBACK,
    day: 'Fri 3 Jul',
  },
  {
    id: 'i-hate-models',
    name: 'I Hate Models',
    image: `${CDN}/2026/02/I-Hate-Models-Press-Pic-1-scaled-e1775573099755.jpg`,
    fallbackImage: FALLBACK,
    day: 'Sat 4 Jul',
  },
  {
    id: 'l2b',
    name: 'L2B',
    image: `${CDN}/2026/07/L2B-e1783083908340.webp`,
    fallbackImage: FALLBACK,
    day: 'Sun 5 Jul',
  },
];
