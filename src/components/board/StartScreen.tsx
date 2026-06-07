/* StartScreen — mission intro with the pulsing core, title and start button. */

import { GalaxyCore } from '../cosmos';
import { CategoryLegend } from './CategoryLegend';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', zIndex: 20, animation: 'fade-up .8s ease' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          textAlign: 'center',
          maxWidth: 780,
          padding: '0 30px',
        }}
      >
        <GalaxyCore size={158} label={null} />
        <div style={{ marginTop: 6 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Цифровий SWOT-аналіз у реальному часі
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 40,
              lineHeight: 1.04,
              margin: 0,
              background: 'var(--title-grad)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Галактика Зубрянського ліцею
          </h1>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 16,
              color: 'var(--gold-soft)',
              marginTop: 8,
              letterSpacing: '.1em',
            }}
          >
            Місія 1946
          </div>
        </div>
        <p style={{ color: 'var(--ink-dim)', fontSize: 15, lineHeight: 1.55, maxWidth: 540, margin: 0 }}>
          Сьогодні ми аналізуємо наш рік не на папері, а в космосі. Чотири зони думок — анонімно, з ваших смартфонів.
        </p>
        <CategoryLegend compact />
        <button className="btn btn-gold" onClick={onStart} style={{ marginTop: 4 }}>
          🚀 Почати місію
        </button>
      </div>
    </div>
  );
}
