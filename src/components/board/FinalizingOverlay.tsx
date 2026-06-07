/* FinalizingOverlay — the big, unmissable board indicator shown while the finale
   is being synthesized (the bottom Director button alone is too subtle). */

export function FinalizingOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'grid',
        placeItems: 'center',
        background: 'radial-gradient(80% 80% at 50% 50%, rgba(8,11,32,.72), rgba(5,7,20,.92))',
        backdropFilter: 'blur(8px)',
        animation: 'fade-up .4s ease',
      }}
    >
      <div style={{ position: 'relative', display: 'grid', placeItems: 'center', width: 300, height: 300 }}>
        {/* expanding gold rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              borderRadius: '50%',
              border: '1px solid rgba(242,169,0,.45)',
              animation: `ring-pulse 2.8s ease-out ${i * 0.7}s infinite`,
            }}
          />
        ))}
        {/* rotating synthesis ring */}
        <div
          style={{
            position: 'absolute',
            width: 132,
            height: 132,
            borderRadius: '50%',
            border: '4px solid rgba(255,255,255,.1)',
            borderTopColor: 'var(--gold)',
            boxShadow: '0 0 50px rgba(242,169,0,.45)',
            animation: 'spin-slow 1.1s linear infinite',
          }}
        />
        <div style={{ fontSize: 54, animation: 'core-pulse 1.6s ease-in-out infinite' }}>🛰️</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 12, maxWidth: 560, padding: '0 24px' }}>
        <div className="eyebrow" style={{ color: 'var(--gold-soft)' }}>
          Фаза синтезу
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 32,
            margin: '8px 0 10px',
            background: 'var(--title-grad)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Формування зоряної карти…
        </h2>
        <p style={{ color: 'var(--ink-dim)', fontSize: 15, lineHeight: 1.5, margin: 0 }}>
          Бортовий ШІ аналізує всі думки команди, рахує голоси та схожі ідеї.
        </p>
      </div>
    </div>
  );
}
