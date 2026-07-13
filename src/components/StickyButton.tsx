import { colors, radius } from '../lib/theme';

interface StickyButtonProps {
  label: string;
  onClick: () => void;
  price?: number;
  priceLabel?: string;
}

export function StickyButton({ 
  label, 
  onClick, 
  price,
  priceLabel = 'Comprar ahora',
}: StickyButtonProps) {
  const displayText = price && price > 0 
    ? `${price.toFixed(2).replace('.', ',')} € — ${priceLabel}` 
    : label;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-[16px] py-[12px] safe-area-pb">
      <button
        onClick={onClick}
        className="w-full h-[48px] flex items-center justify-center"
        style={{
          background: colors.primary,
          borderRadius: radius.full,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span className="text-white text-[16px] font-semibold">
          {displayText}
        </span>
      </button>
    </div>
  );
}
