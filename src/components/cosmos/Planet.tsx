/* Planet — a spherical segmented cluster diagram (conic share ring). */

import { CATS } from '../../data/catalog';
import type { CategoryKey } from '../../state/types';

interface PlanetProps {
  cat: CategoryKey;
  title: string;
  emoji: string;
  percentage: number;
  size?: number;
  showLabel?: boolean;
}

export function Planet({ cat, title, emoji, percentage, size = 132, showLabel = true }: PlanetProps) {
  const c = CATS[cat];
  const deep = `var(--${c.cssVar}-deep)`;
  const bright = `var(--${c.cssVar})`;
  const ringDeg = Math.round((percentage / 100) * 360);
  return (
    <div
      className="planet"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        animation: 'float-soft 6s ease-in-out infinite',
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* conic share ring */}
        <div
          style={{
            position: 'absolute',
            inset: -7,
            borderRadius: '50%',
            background: `conic-gradient(rgba(${c.glow},.95) ${ringDeg}deg, rgba(255,255,255,.08) ${ringDeg}deg)`,
            WebkitMask: 'radial-gradient(circle, transparent 60%, #000 61%)',
            mask: 'radial-gradient(circle, transparent 60%, #000 61%)',
            filter: `drop-shadow(0 0 6px rgba(${c.glow},.6))`,
          }}
        />
        {/* sphere */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle at 34% 28%, ${bright}, ${deep} 64%, #0a0e27 100%)`,
            boxShadow: `inset -10px -12px 22px rgba(0,0,0,.55), inset 8px 8px 18px rgba(255,255,255,.18), 0 12px 28px -8px rgba(${c.glow},.5)`,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <span style={{ fontSize: size * 0.34, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.4))' }}>{emoji}</span>
        </div>
        {/* share badge */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            right: 8,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 12,
            color: '#fff',
            textShadow: '0 1px 4px rgba(0,0,0,.6)',
            zIndex: 2,
          }}
        >
          {percentage}%
        </div>
      </div>
      {showLabel && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>
            {title}
          </div>
        </div>
      )}
    </div>
  );
}
