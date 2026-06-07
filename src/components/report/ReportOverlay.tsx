/* ReportOverlay — full-screen report preview with PDF export. */

import { useRef, useState } from 'react';
import { generateReportPdf } from '../../lib/pdf';
import type { FinalReport, SwotMap } from '../../state/types';
import { ReportDocument } from './ReportDocument';

interface ReportOverlayProps {
  map: SwotMap;
  report: FinalReport;
  onClose: () => void;
}

export function ReportOverlay({ map, report, onClose }: ReportOverlayProps) {
  const docRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const download = async () => {
    if (!docRef.current || busy) return;
    setBusy(true);
    try {
      await generateReportPdf(docRef.current);
    } catch {
      try {
        window.print?.();
      } catch {
        /* printing unavailable */
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="SWOT-звіт"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(5,7,20,.9)',
        animation: 'fade-up .4s ease',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, maxHeight: '100%', transform: 'scale(.92)' }}
      >
        <div style={{ maxHeight: '78vh', overflow: 'auto' }} className="no-scrollbar">
          <div ref={docRef}>
            <ReportDocument map={map} report={report} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={onClose}>
            ← Закрити
          </button>
          <button className="btn btn-gold" onClick={download} disabled={busy} style={{ padding: '12px 24px' }}>
            {busy ? '⏳ Збереження…' : '📥 Зберегти PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
