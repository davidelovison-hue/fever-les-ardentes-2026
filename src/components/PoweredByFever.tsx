import { colors } from '../lib/theme';

export function PoweredByFever() {
  return (
    <div className="flex items-center justify-center" style={{ gap: '0.25rem' }}>
      <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>Powered by</span>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.textDark }}>fever</span>
    </div>
  );
}
