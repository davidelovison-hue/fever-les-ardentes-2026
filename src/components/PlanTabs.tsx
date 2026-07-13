import { useEffect, useRef } from 'react';
import { PLAN_CATALOG } from '../data/planCatalog';
import './PlanTabs.css';

type PlanTabsProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export function PlanTabs({ activeTab, onTabChange }: PlanTabsProps) {
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabButton = document.getElementById(`plan-tab-${activeTab}`);
    const scrollContainer = tabsScrollRef.current;
    if (!tabButton || !scrollContainer) return;

    if (scrollContainer.scrollWidth <= scrollContainer.clientWidth + 1) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const buttonLeft = tabButton.offsetLeft;
    const buttonWidth = tabButton.offsetWidth;
    const containerWidth = scrollContainer.clientWidth;
    const maxScrollLeft = scrollContainer.scrollWidth - containerWidth;
    const targetLeft = Math.min(
      maxScrollLeft,
      Math.max(0, buttonLeft - (containerWidth - buttonWidth) / 2),
    );

    scrollContainer.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [activeTab]);

  return (
    <div className="stickyTabsBar">
      <nav className="tabsNav" aria-label="Plan categories">
        <div className="tabsBarInner">
          <div className="tabsScroll" ref={tabsScrollRef}>
            <ul className="tabsList" role="tablist">
              {PLAN_CATALOG.map((category) => {
                const isActive = activeTab === category.id;
                return (
                  <li key={category.id} className="tabsItem" role="none">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      id={`plan-tab-${category.id}`}
                      className={`tabsLink ${isActive ? 'tabsLinkActive' : ''}`}
                      onClick={() => onTabChange(category.id)}
                    >
                      {category.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
