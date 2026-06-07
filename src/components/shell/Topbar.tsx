/* Topbar — demo header: brand, phase stepper, theme + view toggles. */

import { Fragment } from 'react';
import logo from '../../assets/logo.png';
import type { Phase, View } from '../../state/types';
import { PHASES } from './phases';

type Theme = 'dark' | 'light';

interface TopbarProps {
  phase: Phase;
  view: View;
  setView: (v: View) => void;
  jump: (phase: Phase) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export function Topbar({ phase, view, setView, jump, theme, setTheme }: TopbarProps) {
  const activeIndex = PHASES.findIndex((x) => x.key === phase);
  return (
    <div
      className="app-topbar"
      style={{
        position: 'relative',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        rowGap: 10,
        flexWrap: 'wrap',
        padding: '12px 18px',
        borderBottom: '1px solid var(--glass-brd)',
        background: 'var(--bar-bg)',
        backdropFilter: 'blur(14px)',
        transition: 'background .5s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <img src={logo} alt="" style={{ height: 32 }} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13.5, lineHeight: 1 }}>
            Галактика 1946
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '.06em' }}>
            Прототип інтерактиву · SWOT
          </div>
        </div>
      </div>

      <div className="app-stepper" style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '0 auto' }}>
        {PHASES.map((p, i) => {
          const active = p.key === phase;
          const done = activeIndex > i;
          return (
            <Fragment key={p.key}>
              {i > 0 && <div className="app-stepline" style={{ width: 18, height: 1.5, background: done || active ? 'var(--gold)' : 'var(--hairline)' }} />}
              <button
                onClick={() => jump(p.key)}
                title={p.label}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '5px 10px',
                  borderRadius: 999,
                  background: active ? 'rgba(242,169,0,.16)' : 'transparent',
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 10,
                    background: active ? 'var(--gold)' : done ? 'rgba(242,169,0,.35)' : 'var(--surface-2)',
                    color: active ? '#2a1c00' : 'var(--ink)',
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: active ? 'var(--ink)' : 'var(--ink-mute)', display: active ? 'inline' : 'none' }}>
                  {p.label}
                </span>
              </button>
            </Fragment>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title={theme === 'light' ? 'Темна тема' : 'Світла тема'}
          aria-label="Перемкнути тему"
          style={{
            cursor: 'pointer',
            border: '1px solid var(--glass-brd)',
            width: 38,
            height: 38,
            borderRadius: 999,
            background: 'var(--surface)',
            color: 'var(--ink)',
            fontSize: 16,
            display: 'grid',
            placeItems: 'center',
            transition: 'all .2s',
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--glass-brd)' }}>
          {([['board', '🖥️ Мультиборд'], ['phone', '📱 Телефон']] as [View, string][]).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              style={{
                cursor: 'pointer',
                border: 'none',
                borderRadius: 999,
                padding: '7px 13px',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 12,
                whiteSpace: 'nowrap',
                background: view === k ? 'linear-gradient(180deg,#FFD86B,var(--gold))' : 'transparent',
                color: view === k ? '#2a1c00' : 'var(--ink-dim)',
                transition: 'all .2s',
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
