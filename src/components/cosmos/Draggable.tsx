/* Draggable — pointer-based drag (mouse + touch), scale-aware. */

import React, { useContext, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ScaleCtx } from './ScaleCtx';

interface DraggableProps {
  style?: CSSProperties;
  baseTransform?: string;
  children: ReactNode;
  disabled?: boolean;
}

export function Draggable({ style = {}, baseTransform = '', children, disabled = false }: DraggableProps) {
  const scale = useContext(ScaleCtx);
  const [d, setD] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(false);
  const st = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  if (disabled) return <div style={style}>{children}</div>;

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
    const k = scale || 1;
    setD({
      x: st.current.ox + (e.clientX - st.current.px) / k,
      y: st.current.oy + (e.clientY - st.current.py) / k,
    });
  };
  const end = () => {
    st.current = null;
    setDrag(false);
  };

  return (
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={end}
      onPointerCancel={end}
      style={{
        ...style,
        transform: `${baseTransform} translate(${d.x}px, ${d.y}px)`.trim(),
        zIndex: drag ? 900 : style.zIndex,
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
