# Fever Venue Template

Ready-to-use template for creating venue/event prototypes with Fever styling.

## Quick Start

```bash
# 1. Copy this folder for new venue
cp -r fever-template fever-[venue-name]

# 2. Update vite.config.ts base path
base: '/fever-[venue-name]/'

# 3. Install & run
cd fever-[venue-name]
npm install
npm run dev
```

## How to Customize

Edit `src/App.tsx` - look for the **VENUE DATA** section at the top:

```tsx
const VENUE_CONFIG = {
  name: 'Your Venue',
  title: 'Your Event Title',
  date: 'Date and Time',
  heroImage: 'https://...',
};

const ZONES: ZoneData[] = [
  {
    id: 'zone-1',
    name: 'VIP Zone',
    shortName: 'VIP',
    price: 500,
    capacity: 6,
    description: '...',
    features: ['Feature 1', 'Feature 2'],
    color: '#d4af37',
    image: 'https://...',
  },
  // Add more zones...
];
```

## Available Components

Import from `./components`:

- `TabButton` - Pill-shaped tab buttons
- `RadioOption` - Ticket selection rows
- `QuantitySelector` - +/- quantity stepper
- `StickyButton` - Mobile fixed CTA
- `ZoneCard` - Venue zone cards
- `DotNavigation` - Carousel dots
- `PoweredByFever` - Footer branding

## Theme

All colors/fonts in `./lib/theme.ts`:

```tsx
import { colors, fonts, formatPrice } from './components';

colors.primary     // #8a1343
colors.textDark    // #031419
formatPrice(500)   // "500,00 €"
```

## Deploy

```bash
npm run build
npm run deploy
```

URL: `https://[username].github.io/fever-[venue-name]/`
