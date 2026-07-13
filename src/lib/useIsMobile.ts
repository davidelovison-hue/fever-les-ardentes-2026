import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${breakpoint}px)`).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
}
