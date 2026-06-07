/* LoadingScreen — minimal cosmic loader for lazy-loaded chunks. */

export function LoadingScreen() {
  return (
    <div className="app-root" style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center' }}>
      <div className="cosmos-bg" style={{ opacity: 0.5 }} />
      <div
        style={{
          position: 'relative',
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,.12)',
          borderTopColor: 'var(--gold)',
          animation: 'spin-slow 1s linear infinite',
        }}
      />
    </div>
  );
}
