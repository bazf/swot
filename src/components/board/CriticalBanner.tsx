/* CriticalBanner — the "critical mass, swipe the core" alert. */

export function CriticalBanner() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 64,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 28px',
        borderRadius: 999,
        background: 'rgba(255,50,50,.14)',
        border: '1px solid rgba(255,90,90,.6)',
        boxShadow: '0 0 40px rgba(255,60,60,.4)',
        backdropFilter: 'blur(10px)',
        animation: 'core-pulse 1.1s ease-in-out infinite',
      }}
    >
      <span style={{ fontSize: 22 }}>⚠️</span>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#fff' }}>
          Критична маса!
        </div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,220,220,.9)' }}>
          Потрібен ШІ-синтез — свайпніть ядро вгору
        </div>
      </div>
    </div>
  );
}
