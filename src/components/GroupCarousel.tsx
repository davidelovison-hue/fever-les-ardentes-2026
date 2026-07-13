import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import './PlanCategorySection.css';

type GroupCarouselProps = {
  itemCount: number;
  mobileGroupLayout: 'all' | 'filtered';
  ariaLabel: string;
  children: ReactNode;
};

function useIsMobile(breakpoint = 900) {
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

export function GroupCarousel({
  itemCount,
  mobileGroupLayout,
  ariaLabel,
  children,
}: GroupCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [scrollable, setScrollable] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const slides = Children.toArray(children).filter(isValidElement);

  const useStack = isMobile && mobileGroupLayout === 'filtered' && itemCount >= 1;
  const useCarousel =
    !useStack && (isMobile ? mobileGroupLayout === 'all' && itemCount > 1 : itemCount >= 3);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element || !useCarousel) {
      setScrollable(false);
      setAtStart(true);
      setAtEnd(true);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = element;
    setScrollable(scrollWidth > clientWidth + 2);
    setAtStart(scrollLeft <= 4);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 4);
  }, [useCarousel]);

  useLayoutEffect(() => {
    updateScrollState();
  }, [itemCount, useCarousel, updateScrollState]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !useCarousel) return;

    element.addEventListener('scroll', updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);

    return () => {
      element.removeEventListener('scroll', updateScrollState);
      observer.disconnect();
    };
  }, [useCarousel, updateScrollState, itemCount]);

  const scrollByPage = (direction: 1 | -1) => {
    const element = scrollRef.current;
    if (!element) return;
    const firstChild = element.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(element).gap || '12') || 12;
    const amount = firstChild ? firstChild.offsetWidth + gap : element.clientWidth * 0.85;
    element.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  let containerClass = 'groupCarouselSingle';
  let slideClass = 'carouselSlidePair';

  if (useStack) {
    containerClass = 'groupCarouselStack';
    slideClass = 'carouselSlideStack';
  } else if (useCarousel) {
    containerClass = 'groupCarouselMany';
    slideClass = 'carouselSlideMany';
  } else if (!isMobile && itemCount === 2) {
    containerClass = 'groupCarouselTwo';
    slideClass = 'carouselSlidePair';
  }

  return (
    <div
      className="groupCarouselOuter"
      data-scrollable={useCarousel && scrollable ? 'true' : 'false'}
      data-at-start={useCarousel && scrollable ? String(atStart) : 'true'}
      data-at-end={useCarousel && scrollable ? String(atEnd) : 'true'}
    >
      {useCarousel && scrollable ? (
        <>
          {!atStart ? (
            <button
              type="button"
              className="carouselNavBtn carouselNavPrev"
              aria-label="Previous cards"
              onClick={() => scrollByPage(-1)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : null}
          {!atEnd ? (
            <button
              type="button"
              className="carouselNavBtn carouselNavNext"
              aria-label="Next cards"
              onClick={() => scrollByPage(1)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ) : null}
        </>
      ) : null}

      <div ref={scrollRef} className={containerClass} aria-label={ariaLabel}>
        {slides.map((slide, index) => (
          <div key={slide.key ?? `slide-${index}`} className={slideClass}>
            <div className="carouselSlideInner">{slide}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
