/* FinishedScreen — finale on the phone: download the official SWOT report. */

import { REPORT_FILENAME } from '../../lib/pdf';

interface FinishedScreenProps {
  onOpenReport: () => void;
}

export function FinishedScreen({ onOpenReport }: FinishedScreenProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: '0 24px', zIndex: 5 }}>
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          animation: 'fade-up .6s ease',
        }}
      >
        <div style={{ position: 'relative', width: 96, height: 96, display: 'grid', placeItems: 'center' }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '1px solid rgba(242,169,0,.5)',
                animation: `ring-pulse 2.6s ease-out ${i * 0.7}s infinite`,
              }}
            />
          ))}
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              fontSize: 34,
              background: 'linear-gradient(180deg,#FFD86B,var(--gold))',
              boxShadow: '0 0 30px rgba(242,169,0,.6)',
            }}
          >
            🗺️
          </div>
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, margin: 0 }}>Місію завершено</h2>
          <p style={{ color: 'var(--ink-dim)', fontSize: 14, lineHeight: 1.5, margin: '10px 0 0', maxWidth: 280 }}>
            Зоряну карту стратегії складено. Офіційний SWOT-звіт готовий до завантаження.
          </p>
        </div>
        <button className="btn btn-gold" onClick={onOpenReport} style={{ width: '100%', maxWidth: 300, padding: '16px' }}>
          📥 Завантажити SWOT-звіт (PDF)
        </button>
        <div style={{ fontSize: 11.5, color: 'var(--ink-mute)' }}>{REPORT_FILENAME} · генерується на пристрої</div>
      </div>
    </div>
  );
}
