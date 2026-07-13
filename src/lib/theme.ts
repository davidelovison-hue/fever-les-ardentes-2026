/**
 * Fever Design System Tokens
 * Use these constants instead of hardcoding colors/fonts
 */

export const colors = {
  primary: '#8a1343',
  primaryLight: '#f5e6ec',
  primaryDark: '#7b0f3a',
  
  textDark: '#031419',
  textMuted: '#536b75',
  textLight: '#a7b2ba',
  
  border: '#ccd2d8',
  background: '#f2f3f3',
  white: '#ffffff',
  
  accent: {
    blue: '#0079ca',
    blueLight: '#e6f4ff',
    green: '#24a865',
    greenDark: '#18824c',
    purple: '#6f41d7',
    red: '#eb0052',
  },
} as const;

export const fonts = {
  heading: "'Montserrat', sans-serif",
  body: "'Muli', sans-serif",
} as const;

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  xxl: '2rem',     // 32px
} as const;

export const radius = {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '1rem',      // 16px
  full: '10rem',   // pill shape
} as const;

export const shadows = {
  card: 'rgba(0, 0, 0, 0.24) 0px 0px 6px 0px',
  cardHover: 'rgba(186, 178, 182, 0.6) 0px 0px 6px 0px',
  button: '0px 2px 4px rgba(0, 0, 0, 0.12)',
} as const;

export const formatPrice = (price: number): string => {
  return price.toFixed(2).replace('.', ',') + ' €';
};
