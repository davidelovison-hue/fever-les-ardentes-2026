import { colors, fonts, radius } from '../lib/theme';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        height: '3rem',
        padding: '0 1rem',
        borderRadius: radius.full,
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        fontWeight: 600,
        fontFamily: fonts.body,
        whiteSpace: 'nowrap',
        border: isActive ? 'none' : `1px solid ${colors.primary}`,
        background: isActive ? colors.primary : colors.white,
        color: isActive ? colors.white : colors.primary,
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {label}
    </button>
  );
}
