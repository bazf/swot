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

  // Centre the fixed-size scene with absolute positioning rather than grid
  // place-items: when the container is narrower than the scene, a grid track
  // grows to the scene's unscaled width and overflows to the right (default
  // justify-content: start), pushing the scaled board off-centre and clipping
  // its right edge. translate(-50%,-50%) keeps the scene centred on the
  // container's centre at any container/scene size ratio.
  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: w,
          height: h,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <ScaleCtx.Provider value={scale}>{children}</ScaleCtx.Provider>
      </div>
    </div>
  );
}
