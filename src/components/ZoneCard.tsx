import { colors, fonts, radius, shadows } from '../lib/theme';
import type { ZoneData } from '../lib/types';

interface ZoneCardProps {
  zone: ZoneData;
  isSelected: boolean;
  onClick: () => void;
  showNavigationArrows?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export function ZoneCard({
  zone,
  isSelected,
  onClick,
  showNavigationArrows = false,
  onPrev,
  onNext,
}: ZoneCardProps) {
  return (
    <div
      className="flex-shrink-0 flex flex-col lg:flex-row cursor-pointer w-[calc(100%-4rem)] lg:w-[calc(100%-5rem)]"
      style={{
        fontFamily: fonts.body,
        backgroundColor: isSelected ? colors.primaryLight : colors.white,
        border: isSelected ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        boxShadow: shadows.cardHover,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        scrollSnapAlign: 'start',
      }}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0 w-full lg:w-[280px] h-[12.5rem] lg:h-auto lg:min-h-[280px]">
        <img
          src={zone.image}
          alt={zone.name}
          className="w-full h-full object-cover"
        />
        
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: '0.75rem',
            left: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: radius.sm,
            backgroundColor: zone.color,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            fontWeight: 600,
            color: colors.white,
          }}
        >
          {zone.shortName}
        </div>

        {isSelected && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: '0.75rem',
              right: '0.75rem',
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '50%',
              backgroundColor: colors.primary,
            }}
          >
            <svg className="w-[0.875rem] h-[0.875rem] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {isSelected && showNavigationArrows && (
          <div className="flex md:hidden absolute" style={{ bottom: '0.75rem', right: '0.75rem', gap: '0.5rem' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(4px)',
                boxShadow: shadows.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg className="w-[1rem] h-[1rem]" style={{ color: colors.textDark }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext?.(); }}
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: colors.primary,
                boxShadow: shadows.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg className="w-[1rem] h-[1rem] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col" style={{ padding: '1rem', gap: '1rem' }}>
        <div>
          <h3
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.25rem',
              fontWeight: 600,
              color: colors.textDark,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {zone.shortName}
          </h3>
          <p
            style={{
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              fontWeight: 600,
              color: colors.primary,
              marginTop: '0.25rem',
              marginBottom: 0,
            }}
          >
            desde {zone.price}€
          </p>
          <p
            style={{
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              fontWeight: 400,
              color: colors.textMuted,
              margin: 0,
            }}
          >
            Para {zone.capacity} personas
          </p>
        </div>

        <p
          style={{
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: 400,
            color: colors.textDark,
            margin: 0,
          }}
        >
          {zone.description}
        </p>

        <div className="flex flex-col" style={{ gap: '0.25rem' }}>
          {zone.features.map((feature, i) => (
            <div key={i} className="flex items-start" style={{ gap: '0.25rem' }}>
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: '0.9375rem', height: '0.9375rem', marginTop: '0.125rem' }}
              >
                <div
                  style={{
                    width: '0.375rem',
                    height: '0.375rem',
                    borderRadius: '50%',
                    backgroundColor: colors.accent.green,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  fontWeight: 400,
                  color: colors.textDark,
                }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
