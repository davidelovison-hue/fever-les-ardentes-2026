import { useCallback, useEffect, useRef, useState } from 'react';
import { AddToCartToast } from '../components/AddToCartToast';
import { CartPanel } from '../components/CartPanel';
import { FestivalGallery } from '../components/FestivalGallery';
import { FestivalNavbar } from '../components/FestivalNavbar';
import { OverviewTicketsCta } from '../components/OverviewTicketsCta';
import { PlanCategorySection } from '../components/PlanCategorySection';
import { PlanTabs } from '../components/PlanTabs';
import { useCart } from '../lib/cartContext';
import { useIsMobile } from '../lib/useIsMobile';
import { PLAN_CATALOG } from '../data/planCatalog';
import './PlanPage.css';

function getTabFromHash() {
  const hash = window.location.hash.replace(/^#/, '');
  if (PLAN_CATALOG.some((category) => category.id === hash)) {
    return hash;
  }
  return 'overview';
}

const TAB_SCROLL_GAP_PX = 12;
const STICKY_CHECK_TOLERANCE_PX = 2;

function getStickyOffsetPx() {
  const nav = document.querySelector<HTMLElement>('.planStickyNav');
  const tabs = document.querySelector<HTMLElement>('.planTabsSlot');
  const navH = nav?.getBoundingClientRect().height ?? 0;
  const tabsH = tabs?.getBoundingClientRect().height ?? 0;
  return navH + tabsH + TAB_SCROLL_GAP_PX;
}

function isTabsBarStickyNow() {
  const nav = document.querySelector<HTMLElement>('.planStickyNav');
  const tabs = document.querySelector<HTMLElement>('.planTabsSlot');
  const anchor = document.querySelector<HTMLElement>('.planTabsScrollAnchor');
  if (!tabs) return false;
  if (!anchor) return false;

  const navH = nav?.getBoundingClientRect().height ?? 0;
  // Sticky engages once we've scrolled past the anchor point (adjusted by nav height).
  const anchorDocTop = anchor.getBoundingClientRect().top + window.scrollY;
  return window.scrollY >= anchorDocTop - navH - STICKY_CHECK_TOLERANCE_PX;
}

function getScrollTargetEl(tabId: string) {
  const section = document.getElementById(tabId);
  if (!section) return null;
  // Prefer the filters row if it exists; otherwise fall back to section top.
  const chips = section.querySelector<HTMLElement>('.groupChipsWrap');
  if (chips) return chips;

  // Tabs without filters (e.g. Travel & Parking) should align to the first visible
  // content block/title, not the section wrapper, to avoid awkward whitespace.
  const firstTitle = section.querySelector<HTMLElement>('.groupCarouselTitle');
  if (firstTitle) return firstTitle;
  const firstBlock = section.querySelector<HTMLElement>('.groupBlock');
  return firstBlock ?? section;
}

function scheduleActiveTabScroll(tabId: string, isMobile: boolean) {
  let cancelled = false;
  let rafId = 0;

  const runOnce = () => {
    if (isMobile && tabId === 'overview') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    if (!isTabsBarStickyNow()) return;

    const targetEl = getScrollTargetEl(tabId);
    if (!targetEl) return;

    // Deterministic and robust: scroll the element into view, then compensate for
    // sticky navbar + tabs so the target isn't hidden underneath.
    targetEl.scrollIntoView({ block: 'start', behavior: 'auto' });
    const offset = getStickyOffsetPx();
    if (offset > 0) window.scrollBy({ top: -offset, left: 0, behavior: 'auto' });
  };

  rafId = requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!cancelled) runOnce();
    });
  });

  return () => {
    cancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
  };
}

export function PlanPage() {
  const { items } = useCart();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(getTabFromHash);
  const tabsAnchorRef = useRef<HTMLDivElement>(null);
  const hasInitialTabScrollRef = useRef(false);
  const hasCart = items.length > 0;
  const isOverview = activeTab === 'overview';

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (tabId === activeTab) return;
      setActiveTab(tabId);
      // Avoid native hash scrolling (which is jarring with sticky UI).
      // pushState updates the URL without triggering an automatic scroll.
      window.history.pushState(null, '', `#${tabId}`);
    },
    [activeTab],
  );

  useEffect(() => {
    const onPopState = () => setActiveTab(getTabFromHash());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!hasInitialTabScrollRef.current) {
      hasInitialTabScrollRef.current = true;
      if (activeTab === 'overview' && !window.location.hash.replace(/^#/, '')) {
        return;
      }
    }

    return scheduleActiveTabScroll(activeTab, isMobile);
  }, [activeTab, isMobile]);

  return (
    <div className="planPage">
      <div className="planStickyNav">
        <FestivalNavbar />
      </div>

      <div className="planDesktopShell">
        <div className="planHeroSlot planHeroSlot--mediaHero">
          <FestivalGallery />
        </div>

        <h1 className="eventTitle">Les Ardentes 2026</h1>

        <div className="planTabsScrollAnchor" ref={tabsAnchorRef} aria-hidden="true" />
        <div className="planTabsSlot">
          <PlanTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        <div className="planMainShell">
          <div className="planMainColumn">
            <div className="planContentColumn">
              {PLAN_CATALOG.map((category) => (
                <PlanCategorySection
                  key={category.id}
                  category={category}
                  isActive={activeTab === category.id}
                />
              ))}
            </div>
            {isMobile ? <AddToCartToast variant="mobile" /> : null}
            {isMobile && !hasCart && isOverview ? (
              <OverviewTicketsCta mode="mobile" onGoToTickets={() => handleTabChange('tickets')} />
            ) : null}
          </div>
        </div>

        {isMobile && hasCart ? <CartPanel mode="mobile" /> : null}

        {!isMobile && hasCart ? (
          <CartPanel mode="desktop" />
        ) : !isMobile && isOverview ? (
          <OverviewTicketsCta mode="desktop" onGoToTickets={() => handleTabChange('tickets')} />
        ) : !isMobile ? (
          <aside className="planCartColumn planCartColumn--placeholder" aria-hidden="true" />
        ) : null}
      </div>
    </div>
  );
}
