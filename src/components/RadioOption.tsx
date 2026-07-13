import { colors } from '../lib/theme';

interface RadioOptionProps {
  label: string;
  sublabel?: string;
  price: string;
  isSelected: boolean;
  onClick: () => void;
  isLast?: boolean;
}

export function RadioOption({ 
  label, 
  sublabel, 
  price, 
  isSelected, 
  onClick,
  isLast = false,
}: RadioOptionProps) {
  return (
    <div
      className="relative flex items-center justify-between cursor-pointer transition-all"
      style={{
        padding: '1rem',
        backgroundColor: isSelected ? colors.primaryLight : colors.white,
        borderLeft: isSelected ? `3px solid ${colors.primary}` : 'none',
        paddingLeft: isSelected ? 'calc(1rem - 3px)' : '1rem',
        borderBottom: isLast ? 'none' : `1px solid ${colors.border}`,
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-[0.75rem]">
        <div
          className="flex items-center justify-center transition-colors"
          style={{
            width: '1.25rem',
            height: '1.25rem',
            borderRadius: '50%',
            border: `2px solid ${isSelected ? colors.primary : colors.border}`,
          }}
        >
          {isSelected && (
            <div
              style={{
                width: '0.625rem',
                height: '0.625rem',
                borderRadius: '50%',
                backgroundColor: colors.primary,
              }}
            />
          )}
        </div>
        
        <div className="flex flex-col">
          <span
            style={{
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              fontWeight: 400,
              color: colors.textDark,
            }}
          >
            {label}
          </span>
          {sublabel && (
            <span
              style={{
                fontSize: '0.75rem',
                lineHeight: '1rem',
                fontWeight: 600,
                color: colors.primaryDark,
                cursor: 'pointer',
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
      </div>
      
      <span
        style={{
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          fontWeight: isSelected ? 600 : 400,
          color: isSelected ? colors.textDark : colors.textMuted,
        }}
      >
        {price}
      </span>
    </div>
  );
}
