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

const TAB_SCROLL_TOLERANCE_PX = 8;
const TAB_SCROLL_SETTLE_MS = 80;

function parseCssLengthPx(raw: string, rootFontSize: number) {
  const value = raw.trim();
  if (!value) return 0;
  if (value.endsWith('rem')) return parseFloat(value) * rootFontSize;
  if (value.endsWith('px')) return parseFloat(value);
  return parseFloat(value) || 0;
}

/** Scroll so sticky tabs sit below the nav and active category content is aligned. */
function getActiveTabScrollTarget(tabId: string) {
  const section = document.getElementById(tabId);
  const anchor = document.querySelector<HTMLElement>('.planTabsScrollAnchor');
  const planPage = section?.closest('.planPage') ?? anchor?.closest('.planPage') ?? null;
  if (!planPage) return null;

  const styles = getComputedStyle(planPage);
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const navHeight = parseCssLengthPx(styles.getPropertyValue('--festival-nav-height'), rootFontSize);
  const tabsHeight = parseCssLengthPx(styles.getPropertyValue('--sticky-tabs-height'), rootFontSize);
  const gap = parseCssLengthPx(styles.getPropertyValue('--tab-content-scroll-gap'), rootFontSize);
  const stickyOffset = navHeight + tabsHeight + gap;

  const targets: number[] = [];

  if (section) {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    targets.push(Math.max(0, sectionTop - stickyOffset));
  }

  if (anchor) {
    const anchorTop = anchor.getBoundingClientRect().top + window.scrollY;
    targets.push(Math.max(0, anchorTop - navHeight));
  }

  if (targets.length === 0) return null;
  return Math.min(...targets);
}

function scrollToActiveTab(tabId: string) {
  const targetTop = getActiveTabScrollTarget(tabId);
  if (targetTop === null) return;
  if (Math.abs(window.scrollY - targetTop) <= TAB_SCROLL_TOLERANCE_PX) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({
    top: targetTop,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}

function scheduleActiveTabScroll(tabId: string) {
  let settleTimer: ReturnType<typeof setTimeout> | undefined;

  const run = () => scrollToActiveTab(tabId);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      run();
      settleTimer = window.setTimeout(run, TAB_SCROLL_SETTLE_MS);
    });
  });

  return () => {
    if (settleTimer !== undefined) window.clearTimeout(settleTimer);
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
      window.location.hash = tabId;
    },
    [activeTab],
  );

  useEffect(() => {
    const onHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!hasInitialTabScrollRef.current) {
      hasInitialTabScrollRef.current = true;
      if (activeTab === 'overview' && !window.location.hash.replace(/^#/, '')) {
        return;
      }
    }

    return scheduleActiveTabScroll(activeTab);
  }, [activeTab]);

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
