/* ReportOverlay — full-screen report preview (scaled to fit) with PDF export. */

import { useLayoutEffect, useRef, useState } from 'react';
import { generateReportPdf } from '../../lib/pdf';
import type { FinalReport, SwotMap } from '../../state/types';
import { ReportDocument } from './ReportDocument';

const DOC_W = 520;
const PAD = 16;

interface ReportOverlayProps {
  map: SwotMap;
  report: FinalReport;
  onClose: () => void;
}

export function ReportOverlay({ map, report, onClose }: ReportOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ scale: 1, h: 0 });
  const [busy, setBusy] = useState(false);

  // Scale the fixed-width 520px document down to fit narrow screens (phones).
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const doc = docRef.current;
    if (!overlay || !doc) return;
    const measure = () => {
      const avail = overlay.clientWidth - PAD * 2;
      setDim({ scale: Math.min(1, avail / DOC_W), h: doc.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(overlay);
    return () => ro.disconnect();
  }, []);

  const download = async () => {
    if (!docRef.current || busy) return;
    setBusy(true);
    try {
      // docRef is the unscaled 520px node → the rasterized PDF stays crisp.
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
      ref={overlayRef}
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
        padding: PAD,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, maxHeight: '100%' }}>
        <div className="no-scrollbar" style={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' }}>
          {/* bounded box collapses the scaled document to its visual size (no overflow) */}
          <div style={{ width: DOC_W * dim.scale, height: dim.h ? dim.h * dim.scale : undefined, overflow: 'hidden' }}>
            <div style={{ width: DOC_W, transform: `scale(${dim.scale})`, transformOrigin: 'top left' }}>
              <div ref={docRef}>
                <ReportDocument map={map} report={report} />
              </div>
            </div>
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
