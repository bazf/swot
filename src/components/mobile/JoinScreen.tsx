/* JoinScreen — waiting room shown before the mission starts. */

import { GalaxyCore } from '../cosmos';

export function JoinScreen() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: '0 26px', zIndex: 5 }}>
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
        <GalaxyCore size={120} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, margin: '12px 0 0' }}>
          Ви на борту
        </h2>
        <p style={{ color: 'var(--ink-dim)', fontSize: 14, lineHeight: 1.5, margin: 0 }}>
          Очікуємо, доки модератор запустить місію. Усі відповіді —{' '}
          <b style={{ color: 'var(--ink)' }}>повністю анонімні</b>.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-mute)', fontSize: 12.5 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--opp)',
              boxShadow: '0 0 8px var(--opp)',
              animation: 'core-pulse 1.4s infinite',
            }}
          />
          З'єднання активне
        </div>
      </div>
    </div>
  );
}
