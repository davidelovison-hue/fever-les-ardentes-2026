import { colors } from '../lib/theme';

interface DotNavigationProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
  showSwipeHint?: boolean;
  swipeHintText?: string;
}

export function DotNavigation({
  total,
  current,
  onChange,
  showSwipeHint = true,
  swipeHintText = 'Desliza para ver más',
}: DotNavigationProps) {
  return (
    <div className="flex flex-col items-center" style={{ gap: '0.5rem' }}>
      <div className="flex justify-center" style={{ gap: '0.375rem' }}>
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            style={{
              height: '0.5rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              width: current === i ? '1.5rem' : '0.5rem',
              backgroundColor: current === i ? colors.primary : colors.border,
            }}
          />
        ))}
      </div>

      {showSwipeHint && (
        <p className="md:hidden text-[12px] flex items-center gap-[4px]" style={{ color: colors.textMuted }}>
          <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          {swipeHintText}
        </p>
      )}
    </div>
  );
}
