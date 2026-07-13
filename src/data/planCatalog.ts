export type VariantAxis = {
  id: string;
  label: string;
  options: string[];
};

export type PlanEntity = {
  id: string;
  name: string;
  price: number;
  type: 'configurable_single' | 'configurable_multi' | 'composite';
  variantAxes?: VariantAxis[];
  date?: string;
  listingTag?: 'SELLING FAST' | 'SOLD OUT' | 'LIMITED';
  description?: string;
  includedItems?: string[];
  cardPreviewBullets?: string[];
  requires?: string[];
  displaySummary?: boolean;
  pricingMode?: 'dynamic';
};

export type PlanGroup = {
  id: string;
  title: string;
  entities: PlanEntity[];
};

export type PlanCategory = {
  id: string;
  title: string;
  contentMode?: 'overview';
  groups: PlanGroup[];
};

export const DAY_AXIS: VariantAxis = {
  id: 'day',
  label: 'Day',
  options: ['Thu 2', 'Fri 3', 'Sat 4', 'Sun 5'],
};

export const TWO_DAY_AXIS: VariantAxis = {
  id: 'weekend',
  label: 'Days',
  options: ['Thu–Fri', 'Fri–Sat', 'Sat–Sun'],
};

export const CAMPING_TYPE_AXIS: VariantAxis = {
  id: 'camping',
  label: 'Camping',
  options: ['Outdoor', 'Indoor'],
};

function combineOptionSets(...sets: string[][]): string[] {
  return sets.reduce<string[]>(
    (acc, set) => (acc.length === 0 ? set : acc.flatMap((left) => set.map((right) => `${left} · ${right}`))),
    [],
  );
}

export const EASY_TENT_SIZES = ['2p tent', '4p tent', '6p tent', '8p tent'];

export const CAMP_ZONE_AXIS: VariantAxis = {
  id: 'zone',
  label: 'Zone',
  options: ['Main field', 'Quiet field', 'Lakeside', 'Forest edge'],
};

export const EASY_CAMPING_OPTION_AXIS: VariantAxis = {
  id: 'option',
  label: 'Tent',
  options: combineOptionSets(EASY_TENT_SIZES, CAMPING_TYPE_AXIS.options),
};

export const EASY_CAMPING_PLUS_OPTION_AXIS: VariantAxis = {
  id: 'option',
  label: 'Tent',
  options: combineOptionSets(EASY_TENT_SIZES, ['Outdoor Plus', 'Indoor Plus']),
};

export const GLAMPING_UNITS = [
  'Classic pod (2p)',
  'Comfort lodge (2p)',
  'Premium suite (4p)',
  'VIP tent (4p)',
  'All-Star tent (6p)',
];

export const GLAMPING_OPTION_AXIS: VariantAxis = {
  id: 'option',
  label: 'Unit',
  options: combineOptionSets(GLAMPING_UNITS, ['Phoenix field', 'Main arena', 'Quiet zone']),
};

export const COMFORT_LODGE_OPTION_AXIS: VariantAxis = {
  id: 'option',
  label: 'Lodge',
  options: combineOptionSets(
    ['Twin lodge', 'Double lodge', 'Group lodge (4p)', 'Group lodge (6p)'],
    CAMP_ZONE_AXIS.options,
  ),
};

export const CAMPING_ADDON_OPTION_AXIS: VariantAxis = {
  id: 'option',
  label: 'Camping',
  options: CAMP_ZONE_AXIS.options,
};

export const PARKING_OPTION_AXIS: VariantAxis = {
  id: 'option',
  label: 'Parking',
  options: ['Main car park', 'North car park', 'Park & Ride', 'Full festival pass'],
};

export const VIP_PARKING_OPTION_AXIS: VariantAxis = {
  id: 'option',
  label: 'Parking',
  options: ['VIP car park', 'Premium close'],
};

export const PMR_PARKING_OPTION_AXIS: VariantAxis = {
  id: 'option',
  label: 'Parking',
  options: ['PMR car park', 'Companion parking'],
};

export const MERCH_TEE_SIZE_AXIS: VariantAxis = {
  id: 'size',
  label: 'Size',
  options: ['S', 'M', 'L', 'XL', 'XXL'],
};

export const MERCH_ZIP_HOODIE_SIZE_AXIS: VariantAxis = {
  id: 'size',
  label: 'Size',
  options: ['S', 'M', 'L', 'XL'],
};

export const MERCH_COMBO_HOODIE_SIZE_AXIS: VariantAxis = {
  id: 'size',
  label: 'Size',
  options: ['X/S', 'M/L', 'XL/XXL'],
};

export const PLAN_CATALOG: PlanCategory[] = [
  {
    id: 'overview',
    title: 'Overview',
    contentMode: 'overview',
    groups: [],
  },
  {
    id: 'tickets',
    title: 'Festival Tickets',
    groups: [
      {
        id: 'passes',
        title: 'Festival passes',
        entities: [
          {
            id: 'ticket-4day',
            name: '4 Days Pass',
            price: 219,
            type: 'configurable_single',
            listingTag: 'SELLING FAST',
            description: 'Festival access for 4 days (2–5 July 2026).',
          },
          {
            id: 'ticket-1day',
            name: '1 Day Ticket',
            price: 89,
            type: 'configurable_single',
            variantAxes: [DAY_AXIS],
            description: 'Single-day festival access — choose your day.',
          },
          {
            id: 'ticket-2day',
            name: '2 Day Pass',
            price: 149,
            type: 'configurable_single',
            variantAxes: [TWO_DAY_AXIS],
            description: 'Two consecutive festival days on one pass.',
          },
          {
            id: 'ticket-duo-damso',
            name: 'Duo Pass — Damso',
            price: 189,
            type: 'configurable_single',
            listingTag: 'LIMITED',
            description:
              'Access to Damso at Les Ardentes and Dour, plus all concerts on Sun 5 Jul at Les Ardentes and Sat 18 Jul at Dour.',
            cardPreviewBullets: [
              'Cross-festival bundle — Les Ardentes + Dour',
              'Upgrade path if you already hold a qualifying day ticket',
            ],
          },
        ],
      },
      {
        id: 'premium',
        title: 'VIP',
        entities: [
          {
            id: 'ticket-vip',
            name: 'VIP',
            price: 349,
            type: 'configurable_single',
            listingTag: 'LIMITED',
            description: 'VIP Club with Phoenix main stage view, plus VIP parking & shuttle when buying 2 identical VIP tickets.',
            includedItems: [
              'Festival access',
              'VIP Club area',
              'VIP parking & shuttle (2 identical VIP tickets)',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'camping',
    title: 'Camping',
    groups: [
      {
        id: 'camping-bundles',
        title: '4 Days Pass + Camping',
        entities: [
          {
            id: 'camp-4day-bundle',
            name: '4 Days Pass + Camping',
            price: 289,
            type: 'configurable_single',
            variantAxes: [CAMPING_TYPE_AXIS],
            listingTag: 'SELLING FAST',
            description: '4-day festival pass bundled with camping access.',
            cardPreviewBullets: [
              'Outdoor: camping from Wed 1 Jul 18:00',
              'Indoor: camping from Thu 2 Jul 08:00',
            ],
            includedItems: ['4-day festival pass', 'Camping access', 'Sanitary facilities'],
          },
          {
            id: 'camp-addon-byt',
            name: 'Camping Add-on',
            price: 79,
            type: 'configurable_single',
            variantAxes: [CAMPING_ADDON_OPTION_AXIS],
            description: 'Bring-your-own tent camping — requires a valid festival pass.',
            cardPreviewBullets: [
              'Festival pass not included',
              'Pick your camping zone',
            ],
          },
        ],
      },
      {
        id: 'easy-camping',
        title: 'Easy Camping',
        entities: [
          {
            id: 'camp-easy',
            name: 'Easy Camping',
            price: 129,
            type: 'configurable_single',
            variantAxes: [EASY_CAMPING_OPTION_AXIS],
            listingTag: 'SELLING FAST',
            description: 'Pre-pitched Festitent — arrive whenever you like, tent already set up.',
            cardPreviewBullets: [
              'Requires a valid 4 Days Pass + Camping',
              'No carrying or pitching required',
            ],
          },
          {
            id: 'camp-easy-plus',
            name: 'Easy Camping Plus',
            price: 169,
            type: 'configurable_single',
            variantAxes: [EASY_CAMPING_PLUS_OPTION_AXIS],
            description: 'Pre-pitched tent with bedding pack and mat included.',
            cardPreviewBullets: [
              'Requires a valid 4 Days Pass + Camping',
              'Bedding pack included',
            ],
          },
          {
            id: 'camp-comfort',
            name: 'Comfort Camping',
            price: 199,
            type: 'configurable_single',
            variantAxes: [COMFORT_LODGE_OPTION_AXIS],
            description: 'Lodge blocks with shared lounges and upgraded showers.',
            cardPreviewBullets: [
              'Requires a valid 4 Days Pass + Camping',
              'Wristband access to lodge areas',
            ],
          },
        ],
      },
      {
        id: 'glamping',
        title: 'All-Star Glamping',
        entities: [
          {
            id: 'camp-glamping',
            name: 'All-Star Glamping',
            price: 399,
            type: 'configurable_single',
            variantAxes: [GLAMPING_OPTION_AXIS],
            listingTag: 'LIMITED',
            description: 'Upgraded on-site comfort with furnished glamping units.',
            cardPreviewBullets: [
              'Requires 4 Days Pass + Outdoor or Indoor Camping',
              'Festitent reservation required',
            ],
          },
          {
            id: 'camp-glamping-vip',
            name: 'All-Star Glamping VIP',
            price: 549,
            type: 'configurable_single',
            variantAxes: [GLAMPING_OPTION_AXIS],
            listingTag: 'LIMITED',
            description: 'Top-tier glamping near the main arena with premium amenities.',
            cardPreviewBullets: [
              'Requires 4 Days Pass + Camping',
              'Private deck and priority check-in',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'transport',
    title: 'Travel & Parking',
    groups: [
      {
        id: 'parking',
        title: 'Parking',
        entities: [
          {
            id: 'park-standard',
            name: 'Car Parking',
            price: 35,
            type: 'configurable_single',
            variantAxes: [PARKING_OPTION_AXIS],
            description: 'Official festival parking — festival entry ticket not included.',
          },
          {
            id: 'park-vip',
            name: 'VIP Parking',
            price: 55,
            type: 'configurable_single',
            variantAxes: [VIP_PARKING_OPTION_AXIS],
            description: 'Closest parking to the arena — valid when purchasing two identical VIP tickets.',
          },
          {
            id: 'park-pmr',
            name: 'PMR Parking',
            price: 35,
            type: 'configurable_single',
            variantAxes: [PMR_PARKING_OPTION_AXIS],
            description: 'Accessible parking — reserve via pmr@lesardentes.be if needed.',
          },
        ],
      },
    ],
  },
  {
    id: 'merch',
    title: 'Merch',
    groups: [
      {
        id: 'merch-tees',
        title: 'Line Up 2026 — T-Shirts',
        entities: [
          {
            id: 'merch-tee-lineup-beige',
            name: 'T-Shirt Line Up 2026 Beige',
            price: 38.5,
            type: 'configurable_single',
            variantAxes: [MERCH_TEE_SIZE_AXIS],
            description: 'Line-up tee — beige colourway.',
          },
          {
            id: 'merch-tee-lineup-blanc',
            name: 'T-Shirt Line Up 2026 Blanc',
            price: 38.5,
            type: 'configurable_single',
            variantAxes: [MERCH_TEE_SIZE_AXIS],
            description: 'Line-up tee — white colourway.',
          },
          {
            id: 'merch-tee-lineup-bleu',
            name: 'T-Shirt Line Up 2026 Bleu',
            price: 38.5,
            type: 'configurable_single',
            variantAxes: [MERCH_TEE_SIZE_AXIS],
            listingTag: 'SELLING FAST',
            description: 'Line-up tee — blue colourway.',
          },
          {
            id: 'merch-tee-lineup-noir',
            name: 'T-Shirt Line Up 2026 Noir',
            price: 38.5,
            type: 'configurable_single',
            variantAxes: [MERCH_TEE_SIZE_AXIS],
            description: 'Line-up tee — black colourway.',
          },
          {
            id: 'merch-tee-lineup-vert',
            name: 'T-Shirt Line Up 2026 Vert',
            price: 38.5,
            type: 'configurable_single',
            variantAxes: [MERCH_TEE_SIZE_AXIS],
            listingTag: 'SOLD OUT',
            description: 'Line-up tee — green colourway.',
          },
        ],
      },
      {
        id: 'merch-hoodies',
        title: 'Hoodies',
        entities: [
          {
            id: 'merch-hoodie-zip-grey',
            name: 'Hoodie Zippé Gris',
            price: 86.5,
            type: 'configurable_single',
            variantAxes: [MERCH_ZIP_HOODIE_SIZE_AXIS],
            listingTag: 'SELLING FAST',
            description: 'Grey zip hoodie — official OFFSTAGE Les Ardentes collection.',
          },
          {
            id: 'merch-hoodie-lineup-denim',
            name: 'Hoodie Line Up 2026 Denim',
            price: 82.5,
            type: 'configurable_single',
            variantAxes: [MERCH_COMBO_HOODIE_SIZE_AXIS],
            description: 'Line-up hoodie — denim colourway.',
          },
          {
            id: 'merch-hoodie-lineup-noir',
            name: 'Hoodie Line Up 2026 Noir',
            price: 82.5,
            type: 'configurable_single',
            variantAxes: [MERCH_COMBO_HOODIE_SIZE_AXIS],
            description: 'Line-up hoodie — black colourway.',
          },
          {
            id: 'merch-hoodie-hof-noir',
            name: 'Hoodie Hall Of Fame 20 Ans Noir',
            price: 82.5,
            type: 'configurable_single',
            variantAxes: [MERCH_COMBO_HOODIE_SIZE_AXIS],
            listingTag: 'SOLD OUT',
            description: '20th anniversary Hall Of Fame hoodie — black.',
          },
        ],
      },
    ],
  },
];

export const DEFAULT_TICKET_IMAGE =
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80';

export const ENTITY_IMAGES: Record<string, string> = {
  'camp-4day-bundle':
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
  'camp-addon-byt':
    'https://images.unsplash.com/photo-1532339142463-fd0a8979791a?auto=format&fit=crop&w=800&q=80',
  'camp-easy':
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
  'camp-easy-plus':
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80',
  'camp-comfort':
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
  'camp-glamping':
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
  'camp-glamping-vip':
    'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=800&q=80',
  'merch-tee-lineup-beige':
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Beige.png?width=800',
  'merch-tee-lineup-blanc':
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Blanc_538eec21-4f46-4630-9e6a-2ac4bed9c83c.png?width=800',
  'merch-tee-lineup-bleu':
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/1_b5e2c57d-bab7-4c95-8850-d60573cb0abf.png?width=800',
  'merch-tee-lineup-noir':
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Noir_00cdefc0-eb1f-4cb5-96a9-8ff3df0b558a.png?width=800',
  'merch-tee-lineup-vert':
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Ardentevertback_2.png?width=800',
  'merch-hoodie-zip-grey':
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Design_sans_titre_13.png?width=800',
  'merch-hoodie-lineup-denim':
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/NOUVEA_1.png?width=800',
  'merch-hoodie-lineup-noir':
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Hoodienoirfront.png?width=800',
  'merch-hoodie-hof-noir':
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/HoodienoirfrontHOF.png?width=800',
};

export const ENTITY_GALLERIES: Record<string, string[]> = {
  'camp-4day-bundle': [
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
  ],
  'camp-easy': [
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80',
  ],
  'camp-easy-plus': [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
  ],
  'camp-comfort': [
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
  ],
  'camp-glamping': [
    'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
  ],
  'merch-hoodie-zip-grey': [
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Design_sans_titre_13.png?width=800',
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Design_sans_titre_12.png?width=800',
  ],
  'merch-tee-lineup-beige': [
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Beige.png?width=800',
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Beigefront.png?width=800',
  ],
  'merch-tee-lineup-blanc': [
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Blanc_538eec21-4f46-4630-9e6a-2ac4bed9c83c.png?width=800',
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Blancfront.png?width=800',
  ],
  'merch-tee-lineup-bleu': [
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/1_b5e2c57d-bab7-4c95-8850-d60573cb0abf.png?width=800',
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/2_cd6923f8-6e92-49e8-b499-2a21d489c1ff.png?width=800',
  ],
  'merch-tee-lineup-noir': [
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Noir_00cdefc0-eb1f-4cb5-96a9-8ff3df0b558a.png?width=800',
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Nouveaunoirfront.png?width=800',
  ],
  'merch-tee-lineup-vert': [
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Ardentevertback_2.png?width=800',
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Ardentevertfront.png?width=800',
  ],
  'merch-hoodie-lineup-denim': [
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/NOUVEA_1.png?width=800',
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/NOUVEA_2.png?width=800',
  ],
  'merch-hoodie-lineup-noir': [
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Hoodienoirfront.png?width=800',
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/Hoodienoir.png?width=800',
  ],
  'merch-hoodie-hof-noir': [
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/HoodienoirfrontHOF.png?width=800',
    'https://cdn.shopify.com/s/files/1/0652/8322/7913/files/HoodienoirHOF.png?width=800',
  ],
};

export function getEntityImages(entityId: string): string[] {
  if (ENTITY_GALLERIES[entityId]) return ENTITY_GALLERIES[entityId];
  if (ENTITY_IMAGES[entityId]) return [ENTITY_IMAGES[entityId]];
  if (entityId.startsWith('ticket-')) return [DEFAULT_TICKET_IMAGE];
  if (entityId.startsWith('merch-')) {
    return ENTITY_GALLERIES[entityId] ?? (ENTITY_IMAGES[entityId] ? [ENTITY_IMAGES[entityId]] : []);
  }
  return [];
}

export function findEntity(entityId: string): PlanEntity | undefined {
  for (const category of PLAN_CATALOG) {
    for (const group of category.groups) {
      const entity = group.entities.find((item) => item.id === entityId);
      if (entity) return entity;
    }
  }
  return undefined;
}

export function formatEntityPrice(price: number): string {
  return `${price.toFixed(2).replace('.', ',')} €`;
}
