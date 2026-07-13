import { colors } from '../lib/theme';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  itemLabel?: string;
  itemLabelPlural?: string;
  min?: number;
}

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  itemLabel = 'entrada',
  itemLabelPlural = 'entradas',
  min = 1,
}: QuantitySelectorProps) {
  const canDecrement = quantity > min;

  return (
    <div className="flex items-center justify-center" style={{ gap: '1rem' }}>
      <button
        onClick={onDecrement}
        disabled={!canDecrement}
        className="flex items-center justify-center transition-colors"
        style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          border: canDecrement ? 'none' : `1px solid ${colors.border}`,
          cursor: canDecrement ? 'pointer' : 'not-allowed',
          backgroundColor: canDecrement ? colors.primaryLight : colors.background,
          color: canDecrement ? colors.primary : colors.textLight,
        }}
      >
        <svg className="w-[1.25rem] h-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <span
        style={{
          fontSize: '1rem',
          lineHeight: '1.5rem',
          fontWeight: 400,
          color: colors.textDark,
          minWidth: '5rem',
          textAlign: 'center',
        }}
      >
        {quantity} {quantity === 1 ? itemLabel : itemLabelPlural}
      </span>

      <button
        onClick={onIncrement}
        className="flex items-center justify-center transition-colors"
        style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: colors.primary,
          color: colors.white,
        }}
      >
        <svg className="w-[1.25rem] h-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
