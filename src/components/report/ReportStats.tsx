/* ReportStats — the vote-tally block of the printed report: how many thoughts were
   collected, how they spread across the SWOT quadrants, and the most-shared ideas. */

import { CATS, CAT_ORDER } from '../../data/catalog';
import { categorizedTotal } from '../../lib/stats';
import type { CategoryKey, VoteStats } from '../../state/types';

const TONE: Record<CategoryKey, string> = { str: '#B8860B', wek: '#6D3FC4', opp: '#0E8A77', thr: '#C53A28' };

interface ReportStatsProps {
  stats: VoteStats;
}

export function ReportStats({ stats }: ReportStatsProps) {
  const catTotal = categorizedTotal(stats);
  return (
    <>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 13,
          color: 'var(--navy)',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--opp)', display: 'inline-block' }} />
        Статистика голосів
      </div>

      <div style={{ fontSize: 11.5, color: '#2a2f45', marginBottom: catTotal > 0 ? 10 : 14 }}>
        Зібрано думок: <strong>{stats.total}</strong> · Унікальних тем: <strong>{stats.unique}</strong>
        {catTotal > 0 && (
          <>
            {' '}
            · Відсортовано в зони: <strong>{catTotal}</strong>
          </>
        )}
      </div>

      {catTotal > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {CAT_ORDER.map((k) => {
            const n = stats.byCategory[k];
            const pct = Math.round((n / catTotal) * 100);
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 116, flexShrink: 0, fontSize: 11, color: TONE[k], fontWeight: 700 }}>
                  {CATS[k].emoji} {CATS[k].swot}
                </span>
                <div style={{ flex: 1, height: 8, borderRadius: 999, background: '#eef0f7', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: TONE[k] }} />
                </div>
                <span style={{ width: 58, flexShrink: 0, textAlign: 'right', fontSize: 10.5, color: '#667' }}>
                  {n} · {pct}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {stats.themes.length > 0 && (
        <>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: '#667', marginBottom: 7 }}>
            Найчастіші думки · схожі голоси
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 18 }}>
            {stats.themes.map((t, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '6px 10px',
                  borderRadius: 7,
                  background: '#f7f8fc',
                  border: '1px solid #e8ebf5',
                }}
              >
                <span style={{ flex: 1, fontSize: 11, color: '#2a2f45', lineHeight: 1.3 }}>
                  {t.cat ? `${CATS[t.cat].emoji} ` : ''}
                  {t.text}
                </span>
                <span
                  style={{
                    flexShrink: 0,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 10.5,
                    color: '#fff',
                    background: 'var(--navy)',
                    borderRadius: 999,
                    padding: '2px 9px',
                  }}
                >
                  ×{t.count}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
