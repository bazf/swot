/* FitStage — scale a fixed-size scene to fit its container (scale-aware drag). */

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ScaleCtx } from '../cosmos';

interface FitStageProps {
  w: number;
  h: number;
  children: ReactNode;
}

export function FitStage({ w, h, children }: FitStageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.1);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) setScale(Math.min(r.width / w, r.height / h));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [w, h]);

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'center', flexShrink: 0, position: 'relative' }}>
        <ScaleCtx.Provider value={scale}>{children}</ScaleCtx.Provider>
      </div>
    </div>
  );
}
