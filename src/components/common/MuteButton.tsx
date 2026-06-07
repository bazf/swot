/* MuteButton — toggle the board background music. */

import type { CSSProperties } from 'react';

interface MuteButtonProps {
  muted: boolean;
  onToggle: () => void;
  style?: CSSProperties;
}

export function MuteButton({ muted, onToggle, style }: MuteButtonProps) {
  return (
    <button
      onClick={onToggle}
      title={muted ? 'Увімкнути музику' : 'Вимкнути музику'}
      aria-label="Музика"
      aria-pressed={muted}
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
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
