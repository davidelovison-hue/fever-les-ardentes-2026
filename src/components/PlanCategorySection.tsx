import { useState } from 'react';
import type { PlanCategory } from '../data/planCatalog';
import { EntityCard } from './EntityCard';
import { GroupCarousel } from './GroupCarousel';
import { OverviewSection } from './OverviewSection';
import './PlanCategorySection.css';

const ALL_GROUPS = '__all__';

type PlanCategorySectionProps = {
  category: PlanCategory;
  isActive?: boolean;
};

export function PlanCategorySection({ category, isActive = true }: PlanCategorySectionProps) {
  const groups = category.groups;
  const [activeGroupId, setActiveGroupId] = useState<string>(
    groups.length > 1 ? ALL_GROUPS : groups[0]?.id ?? '',
  );

  const sectionClassName = isActive ? 'categorySection' : 'categorySection categorySectionHidden';

  if (category.contentMode === 'overview' || category.id === 'overview') {
    return (
      <section
        id={category.id}
        className={sectionClassName}
        aria-label={category.title}
        aria-hidden={!isActive}
        hidden={!isActive}
      >
        <OverviewSection />
      </section>
    );
  }

  if (groups.length === 0) {
    return (
      <section
        id={category.id}
        className={sectionClassName}
        aria-label={category.title}
        aria-hidden={!isActive}
        hidden={!isActive}
      />
    );
  }

  const showChips = groups.length > 1;
  const activeGroup =
    activeGroupId === ALL_GROUPS ? null : groups.find((group) => group.id === activeGroupId) ?? groups[0];

  return (
    <section
      id={category.id}
      className={sectionClassName}
      aria-label={category.title}
      aria-hidden={!isActive}
      hidden={!isActive}
    >
      {showChips ? (
        <div className="groupChipsWrap" role="group" aria-label={`${category.title} filters`}>
          <div className="groupChipsScroll">
            <button
              type="button"
              className={
                activeGroupId === ALL_GROUPS ? 'groupChip groupChipSelected' : 'groupChip'
              }
              aria-pressed={activeGroupId === ALL_GROUPS}
              onClick={() => setActiveGroupId(ALL_GROUPS)}
            >
              All
            </button>
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={
                  activeGroupId === group.id ? 'groupChip groupChipSelected' : 'groupChip'
                }
                aria-pressed={activeGroupId === group.id}
                onClick={() => setActiveGroupId(group.id)}
              >
                {group.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {activeGroupId === ALL_GROUPS && showChips ? (
        <div className="groupStackAll">
          {groups.map((group) =>
            group.entities.length === 0 ? null : (
              <div key={group.id} className="groupBlock">
                <h3 className="groupCarouselTitle">{group.title}</h3>
                <GroupCarousel
                  mobileGroupLayout="all"
                  itemCount={group.entities.length}
                  ariaLabel={group.title}
                >
                  {group.entities.map((entity) => (
                    <EntityCard key={entity.id} entity={entity} />
                  ))}
                </GroupCarousel>
              </div>
            ),
          )}
        </div>
      ) : activeGroup ? (
        <div className="groupBlock">
          {!showChips ? <h3 className="groupCarouselTitle">{activeGroup.title}</h3> : null}
          <GroupCarousel
            mobileGroupLayout="filtered"
            itemCount={activeGroup.entities.length}
            ariaLabel={activeGroup.title}
          >
            {activeGroup.entities.map((entity) => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </GroupCarousel>
        </div>
      ) : null}
    </section>
  );
}
