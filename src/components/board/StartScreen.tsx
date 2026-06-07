/* StartScreen — mission intro with the pulsing core, title and join card. */

import { GalaxyCore } from '../cosmos';
import { CategoryLegend } from './CategoryLegend';

interface StartScreenProps {
  onStart: () => void;
  link: string;
}

export function StartScreen({ onStart, link }: StartScreenProps) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
          <button className="btn btn-gold" onClick={onStart}>
            🚀 Почати місію
          </button>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 11px 9px 15px', borderRadius: 14 }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                Приєднатися
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12.5 }}>{link}</div>
            </div>
            <div style={{ width: 46, height: 46, borderRadius: 9, background: '#fff', padding: 4 }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 5,
                  backgroundImage: 'repeating-conic-gradient(#0a0e27 0% 25%, #fff 0% 50%)',
                  backgroundSize: '11px 11px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
