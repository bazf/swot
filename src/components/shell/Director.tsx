/* Director — Oksana's control bar. Demo mode adds idea-injection shortcuts;
   live mode shows only the real moderator actions. */

import type { ReactNode } from 'react';
import { THRESHOLD } from '../../data/catalog';
import type { Phase } from '../../state/types';

interface CtrlProps {
  onClick: () => void;
  children: ReactNode;
  gold?: boolean;
  disabled?: boolean;
}
function Ctrl({ onClick, children, gold, disabled }: CtrlProps) {
  return (
    <button
      className={'btn ' + (gold ? 'btn-gold' : 'btn-ghost')}
      onClick={onClick}
      disabled={disabled}
      style={{ ...(gold ? { padding: '11px 20px', fontSize: 13.5 } : {}), opacity: disabled ? 0.5 : 1 }}
    >
      {children}
    </button>
  );
}

interface DirectorProps {
  phase: Phase;
  count: number;
  cycle?: number;
  busy?: boolean;
  demo?: boolean;
  auto?: boolean;
  onToggleAuto?: () => void;
  onAddIdea?: () => void;
  start: () => void;
  swipe: () => void;
  continueCycle: () => void;
  finish: () => void;
  reset: () => void;
}

export function Director(p: DirectorProps) {
  const { phase, count, busy, demo, auto } = p;
  return (
    <div
      className="app-director"
      style={{
        position: 'relative',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '12px 20px',
        borderTop: '1px solid var(--glass-brd)',
        background: 'var(--bar-bg)',
        backdropFilter: 'blur(14px)',
        flexWrap: 'wrap',
        transition: 'background .5s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 6 }}>
        <span style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
          Режисер
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: 'var(--gold-soft)' }}>
          Оксана
        </span>
      </div>

      {phase === 'start' && (
        <Ctrl gold onClick={p.start}>
          🚀 Почати місію
        </Ctrl>
      )}

      {phase === 'collecting' && (
        <>
          {demo && p.onAddIdea && <Ctrl onClick={p.onAddIdea}>+ Думка</Ctrl>}
          {demo && p.onToggleAuto && <Ctrl onClick={p.onToggleAuto}>{auto ? '⏸ Пауза потоку' : '⏩ Потік думок'}</Ctrl>}
          <span style={{ fontSize: 12, color: 'var(--ink-dim)' }}>
            {count}/{THRESHOLD} до критичної маси
          </span>
        </>
      )}

      {phase === 'critical' && (
        <Ctrl gold disabled={busy} onClick={p.swipe}>
          {busy ? '🛰️ ШІ-синтез…' : '↑ Свайп ядра → ШІ-синтез'}
        </Ctrl>
      )}

      {phase === 'clusters' && (
        <>
          <Ctrl onClick={p.continueCycle}>+ Новий цикл накопичення</Ctrl>
          <Ctrl gold disabled={busy} onClick={p.finish}>
            {busy ? '🛰️ Аналіз…' : '🏁 Завершити місію: Зоряна карта'}
          </Ctrl>
        </>
      )}

      {phase === 'starmap' && (
        <>
          <span style={{ fontSize: 12.5, color: 'var(--ink-dim)' }}>Місію завершено · звіт надіслано на телефони</span>
          <Ctrl onClick={p.reset}>↺ Спочатку</Ctrl>
        </>
      )}

      {phase !== 'start' && phase !== 'starmap' && (
        <button
          onClick={p.reset}
          title="Скинути"
          style={{ marginLeft: 6, cursor: 'pointer', border: 'none', background: 'transparent', color: 'var(--ink-mute)', fontSize: 16 }}
        >
          ↺
        </button>
      )}
    </div>
  );
}
