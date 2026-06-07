/* ThemeToggle — round dark/light switch. */

import type { CSSProperties } from 'react';
import type { Theme } from '../../state/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  style?: CSSProperties;
}

export function ThemeToggle({ theme, onToggle, style }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      title={theme === 'light' ? 'Темна тема' : 'Світла тема'}
      aria-label="Перемкнути тему"
      style={{
        cursor: 'pointer',
        border: '1px solid var(--glass-brd)',
        width: 38,
        height: 38,
        borderRadius: 999,
        background: 'var(--surface)',
        color: 'var(--ink)',
        fontSize: 16,
        display: 'grid',
        placeItems: 'center',
        transition: 'all .2s',
        ...style,
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
