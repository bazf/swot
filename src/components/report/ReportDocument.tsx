/* ReportDocument — the official A4-style SWOT report (also rasterized to PDF). */

import logo from '../../assets/logo.png';
import type { FinalReport, SwotMap } from '../../state/types';
import { ReportStats } from './ReportStats';
import { SwotCell } from './SwotCell';

interface ReportDocumentProps {
  map: SwotMap;
  report: FinalReport;
}

export function ReportDocument({ map, report }: ReportDocumentProps) {
  const today = new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div
      className="report-doc"
      style={{
        width: 520,
        background: '#fff',
        color: '#1a1f33',
        borderRadius: 6,
        boxShadow: '0 30px 80px -20px rgba(0,0,0,.6)',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 26px', borderBottom: '2px solid var(--navy)' }}>
        <img src={logo} alt="" style={{ height: 54 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>
            Зубрянський ліцей · 1946
          </div>
          <div style={{ fontSize: 11.5, color: '#667', marginTop: 2 }}>
            SWOT-аналіз навчального року · Педагогічна рада
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 10.5, color: '#889' }}>
          <div>Звіт сформовано</div>
          <div style={{ fontWeight: 700, color: '#445' }}>{today}</div>
        </div>
      </div>

      <div style={{ padding: '18px 26px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <SwotCell cat="str" planets={map.str} />
          <SwotCell cat="wek" planets={map.wek} />
          <SwotCell cat="opp" planets={map.opp} />
          <SwotCell cat="thr" planets={map.thr} />
        </div>

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
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
          ТОП-3 пріоритети на наступний рік
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
          {report.priorities.map((p, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '8px 12px',
                borderRadius: 7,
                background: '#f7f8fc',
                border: '1px solid #e8ebf5',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  flexShrink: 0,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 11,
                  color: '#fff',
                  background: 'var(--navy)',
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#2a2f45' }}>{p}</span>
            </div>
          ))}
        </div>

        {report.recommendations && report.recommendations.length > 0 && (
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
              Рекомендації
            </div>
            <ul style={{ margin: '0 0 18px', padding: '0 0 0 22px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {report.recommendations.map((r, i) => (
                <li key={i} style={{ fontSize: 11.5, color: '#2a2f45', lineHeight: 1.4 }}>
                  {r}
                </li>
              ))}
            </ul>
          </>
        )}

        {report.stats && <ReportStats stats={report.stats} />}

        <div style={{ padding: '12px 14px', borderRadius: 8, background: '#fbf6e8', border: '1px solid #f0e2bf' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9a7b1f',
              textTransform: 'uppercase',
              letterSpacing: '.1em',
              marginBottom: 4,
            }}
          >
            Висновок бортового ШІ
          </div>
          <div style={{ fontSize: 11.5, color: '#5a4a1a', lineHeight: 1.5, fontStyle: 'italic' }}>
            «{report.summary || report.conclusion}»
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '10px 26px',
          borderTop: '1px solid #eee',
          fontSize: 9.5,
          color: '#aab',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>SWOT_Lyceum_1946.pdf</span>
        <span>Згенеровано додатком «Галактика 1946»</span>
      </div>
    </div>
  );
}
