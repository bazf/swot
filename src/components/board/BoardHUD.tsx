/* BoardHUD — brand mark, phase chip and the ideas-to-critical-mass counter. */

import logo from '../../assets/logo.png';
import { THRESHOLD } from '../../data/catalog';
import type { Phase } from '../../state/types';

const PHASE_LABEL: Partial<Record<Phase, string>> = {
  collecting: 'Фаза накопичення',
  critical: 'Критична маса',
  clusters: 'ШІ-синтез завершено',
  starmap: 'Зоряна карта',
};

interface BoardHUDProps {
  phase: Phase;
  count: number;
  cycle: number;
}

export function BoardHUD({ phase, count, cycle }: BoardHUDProps) {
  const pct = Math.min(100, (count / THRESHOLD) * 100);
  const ring = 56,
    sw = 5,
    R = (ring - sw) / 2,
    C = 2 * Math.PI * R;
  const crit = phase === 'critical';
  const phaseLabel = PHASE_LABEL[phase] ?? '';
  return (
    <>
      <div style={{ position: 'absolute', top: 26, left: 30, display: 'flex', alignItems: 'center', gap: 12, zIndex: 30 }}>
        <img src={logo} alt="" style={{ height: 42, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.5))' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '.02em' }}>
            Галактика ліцею
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
            Місія 1946
          </div>
        </div>
      </div>

      {phaseLabel && (
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '8px 18px',
            borderRadius: 999,
            background: crit ? 'rgba(255,70,70,.16)' : 'var(--surface)',
            border: '1px solid ' + (crit ? 'rgba(255,90,90,.5)' : 'var(--glass-brd)'),
            backdropFilter: 'blur(10px)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: crit ? 'var(--thr)' : 'var(--opp)',
              boxShadow: `0 0 10px ${crit ? 'var(--thr)' : 'var(--opp)'}`,
              animation: 'core-pulse 1.4s ease-in-out infinite',
            }}
          />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12.5, letterSpacing: '.04em' }}>
            {phaseLabel}
          </span>
          {cycle > 1 && <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>· цикл {cycle}</span>}
        </div>
      )}

      <div style={{ position: 'absolute', top: 22, right: 30, zIndex: 30, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: crit ? 'var(--thr)' : 'var(--ink)' }}>
            {count} <span style={{ color: 'var(--ink-mute)', fontSize: 14 }}>/ {THRESHOLD}</span>
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
            ідей у потоці
          </div>
        </div>
        <svg width={ring} height={ring} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={ring / 2} cy={ring / 2} r={R} fill="none" stroke="var(--hairline)" strokeWidth={sw} />
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={R}
            fill="none"
            stroke={crit ? 'var(--thr)' : 'var(--gold)'}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C - (pct / 100) * C}
            style={{
              transition: 'stroke-dashoffset .5s, stroke .4s',
              filter: `drop-shadow(0 0 5px ${crit ? 'var(--thr)' : 'var(--gold)'})`,
            }}
          />
        </svg>
      </div>
    </>
  );
}
