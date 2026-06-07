/* Draggable — pointer-based drag (mouse + touch), scale-aware. */

import React, { useContext, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ScaleCtx } from './ScaleCtx';

interface DraggableProps {
  style?: CSSProperties;
  baseTransform?: string;
  children: ReactNode;
  disabled?: boolean;
  /** Fired on release with the final scale-compensated offset (board units). */
  onDrop?: (delta: { x: number; y: number }) => void;
}

export function Draggable({ style = {}, baseTransform = '', children, disabled = false, onDrop }: DraggableProps) {
  const scale = useContext(ScaleCtx);
  const [d, setD] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(false);
  const st = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  if (disabled) return <div style={style}>{children}</div>;

  const offsetFor = (e: React.PointerEvent) => {
    const k = scale || 1;
    const s = st.current!;
    return { x: s.ox + (e.clientX - s.px) / k, y: s.oy + (e.clientY - s.py) / k };
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDrag(true);
    st.current = { px: e.clientX, py: e.clientY, ox: d.x, oy: d.y };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* setPointerCapture unsupported */
    }
    e.stopPropagation();
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!st.current) return;
    setD(offsetFor(e));
  };
  const finishDrag = (e: React.PointerEvent<HTMLDivElement>, fire: boolean) => {
    if (st.current) {
      const nd = offsetFor(e);
      setD(nd);
      if (fire) onDrop?.(nd);
    }
    st.current = null;
    setDrag(false);
  };

  // Keep a moved element elevated so it stays above the core (z 15) and re-grabbable.
  const moved = d.x !== 0 || d.y !== 0;
  return (
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={(e) => finishDrag(e, true)}
      onPointerCancel={(e) => finishDrag(e, false)}
      style={{
        ...style,
        transform: `${baseTransform} translate(${d.x}px, ${d.y}px)`.trim(),
        zIndex: drag ? 900 : moved ? 60 : style.zIndex,
        cursor: drag ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        filter: drag ? 'drop-shadow(0 10px 24px rgba(0,0,0,.5))' : style.filter,
      }}
    >
      {children}
    </div>
  );
}
