/* ProcessingOverlay — shown on phones while the AI structures the ideas. */

export function ProcessingOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(8,11,32,.78)',
        backdropFilter: 'blur(6px)',
        animation: 'fade-up .4s ease',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          padding: '0 30px',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,.12)',
            borderTopColor: 'var(--gold)',
            animation: 'spin-slow 1s linear infinite',
          }}
        />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>Обробка…</div>
          <div style={{ color: 'var(--ink-dim)', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
            Бортовий ШІ структурує думки команди в планети
          </div>
        </div>
      </div>
    </div>
  );
}
