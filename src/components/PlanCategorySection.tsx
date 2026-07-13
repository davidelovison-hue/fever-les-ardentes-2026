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
  const hasSingleGroupEntityFilters = groups.length === 1 && (groups[0]?.entities.length ?? 0) > 1;
  const [activeGroupId, setActiveGroupId] = useState<string>(
    groups.length > 1 ? ALL_GROUPS : groups[0]?.id ?? '',
  );
  const [activeEntityId, setActiveEntityId] = useState<string>(ALL_GROUPS);

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

  const showChips = groups.length > 1 || hasSingleGroupEntityFilters;
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
                (hasSingleGroupEntityFilters ? activeEntityId : activeGroupId) === ALL_GROUPS
                  ? 'groupChip groupChipSelected'
                  : 'groupChip'
              }
              aria-pressed={(hasSingleGroupEntityFilters ? activeEntityId : activeGroupId) === ALL_GROUPS}
              onClick={() => {
                if (hasSingleGroupEntityFilters) setActiveEntityId(ALL_GROUPS);
                else setActiveGroupId(ALL_GROUPS);
              }}
            >
              All
            </button>
            {hasSingleGroupEntityFilters
              ? groups[0].entities.map((entity) => (
                  <button
                    key={entity.id}
                    type="button"
                    className={
                      activeEntityId === entity.id ? 'groupChip groupChipSelected' : 'groupChip'
                    }
                    aria-pressed={activeEntityId === entity.id}
                    onClick={() => setActiveEntityId(entity.id)}
                  >
                    {entity.name}
                  </button>
                ))
              : groups.map((group) => (
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

      {hasSingleGroupEntityFilters ? (
        <div className="groupBlock">
          <GroupCarousel
            mobileGroupLayout="filtered"
            itemCount={
              activeEntityId === ALL_GROUPS ? groups[0].entities.length : 1
            }
            ariaLabel={groups[0].title}
          >
            {(activeEntityId === ALL_GROUPS
              ? groups[0].entities
              : groups[0].entities.filter((entity) => entity.id === activeEntityId)
            ).map((entity) => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </GroupCarousel>
        </div>
      ) : activeGroupId === ALL_GROUPS && showChips ? (
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
