/** Resolve a path under Vite `public/` (respects GitHub Pages base). */
export function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
