/* GalaxyCore — the lyceum logo as a pulsing galaxy core. */

import logo from '../../assets/logo.png';

interface GalaxyCoreProps {
  size?: number;
  critical?: boolean;
  label?: string | null;
  onSwipe?: (() => void) | null;
}

export function GalaxyCore({ size = 220, critical = false, label, onSwipe }: GalaxyCoreProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'grid',
        placeItems: 'center',
        // Decorative — never intercept pointers, so thoughts under/near it stay draggable.
        pointerEvents: 'none',
        animation: critical ? 'core-shake .5s ease-in-out infinite' : 'float-soft 7s ease-in-out infinite',
      }}
    >
      {/* outer aura */}
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.42,
          borderRadius: '50%',
          background: critical
            ? 'radial-gradient(circle, rgba(255,70,70,.55), rgba(255,70,70,0) 62%)'
            : 'radial-gradient(circle, rgba(120,150,255,.40), rgba(120,150,255,0) 65%)',
          filter: 'blur(6px)',
          animation: critical ? 'core-pulse 1s ease-in-out infinite' : 'core-pulse 4.5s ease-in-out infinite',
        }}
      />
      {/* rotating orbit ring */}
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.16,
          borderRadius: '50%',
          border: '1px dashed ' + (critical ? 'rgba(255,120,120,.5)' : 'rgba(160,185,255,.35)'),
          animation: 'spin-slow 26s linear infinite',
        }}
      />
      {/* disc backing under the logo */}
      <div
        style={{
          position: 'absolute',
          width: size * 0.92,
          height: size * 0.92,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 32%, rgba(255,255,255,.14), rgba(10,16,50,.85) 70%)',
          boxShadow: critical
            ? '0 0 110px 18px rgba(255,40,40,.75), inset 0 0 60px rgba(255,60,60,.6)'
            : '0 0 60px 4px rgba(90,130,255,.45), inset 0 0 36px rgba(120,150,255,.25)',
          transition: 'box-shadow .5s',
        }}
      />
      <img
        src={logo}
        alt="Зубрянський ліцей"
        draggable="false"
        style={{
          width: size * 0.74,
          height: 'auto',
          position: 'relative',
          zIndex: 2,
          filter: critical
            ? 'drop-shadow(0 0 16px rgba(255,80,80,.9)) saturate(1.2)'
            : 'drop-shadow(0 6px 18px rgba(0,0,0,.55))',
          userSelect: 'none',
        }}
      />
      {critical && onSwipe && (
        <button
          onClick={onSwipe}
          title="Свайп по ядру"
          style={{
            position: 'absolute',
            bottom: -size * 0.06,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            pointerEvents: 'auto',
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontWeight: 800,
            fontSize: 13,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            textShadow: '0 2px 8px rgba(0,0,0,.7)',
            animation: 'float-soft 1.4s ease-in-out infinite',
          }}
        >
          <span style={{ fontSize: 22 }}>⤒</span>
          Свайп ядра
        </button>
      )}
      {label && (
        <div
          style={{
            position: 'absolute',
            bottom: -34,
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            letterSpacing: '.04em',
            fontSize: 13,
            color: 'var(--ink-dim)',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
