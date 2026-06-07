/* PriorityCore — central TOP-3 orbit panel + the AI-voice trigger. */

import type { FinalReport } from '../../state/types';

interface PriorityCoreProps {
  report: FinalReport;
  speaking: boolean;
  onSpeak: () => void;
}

export function PriorityCore({ report, speaking, onSpeak }: PriorityCoreProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 22,
        width: 312,
        animation: 'fade-up 1s ease',
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: -30 - i * 26,
            borderRadius: '50%',
            border: '1px solid rgba(242,169,0,.35)',
            animation: `ring-pulse 3.4s ease-out ${i * 0.7}s infinite`,
          }}
        />
      ))}
      <div
        className="glass"
        style={{
          padding: '22px 22px 24px',
          borderRadius: 24,
          textAlign: 'center',
          border: '1px solid rgba(242,169,0,.3)',
          boxShadow: '0 0 50px rgba(242,169,0,.22), var(--shadow)',
        }}
      >
        <div className="eyebrow" style={{ color: 'var(--gold-soft)' }}>
          Орбіта пріоритетів
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, margin: '8px 0 16px' }}>
          ТОП-3 на наступний рік
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
          {report.priorities.map((p, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '9px 12px',
                borderRadius: 12,
                background: 'var(--surface)',
                border: '1px solid var(--glass-brd)',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 13,
                  color: '#2a1c00',
                  background: 'linear-gradient(180deg,#FFD86B,var(--gold))',
                  boxShadow: '0 0 12px rgba(242,169,0,.6)',
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{p}</span>
            </div>
          ))}
        </div>
        <button
          className="btn"
          onClick={onSpeak}
          style={{
            marginTop: 18,
            width: '100%',
            background: speaking ? 'rgba(242,169,0,.18)' : 'var(--surface-2)',
            border: '1px solid rgba(242,169,0,.45)',
            color: 'var(--ink)',
            padding: '12px',
            fontSize: 14,
          }}
        >
          <span style={{ fontSize: 16 }}>{speaking ? '🔊' : '🛰️'}</span>
          {speaking ? 'Бортовий ШІ говорить…' : 'Озвучити висновок'}
        </button>
      </div>
    </div>
  );
}
