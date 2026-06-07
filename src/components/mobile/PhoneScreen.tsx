/* PhoneScreen — a neutral, device-agnostic phone viewport for the demo preview.
   No iOS/Android chrome: real teachers open the client full-screen on their own
   device; this is only a framed preview for the board operator. */

import type { ReactNode } from 'react';

interface PhoneScreenProps {
  children: ReactNode;
  width?: number;
  height?: number;
}

export function PhoneScreen({ children, width = 390, height = 844 }: PhoneScreenProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 44,
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--space-1)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.18)',
        border: '1px solid rgba(150,170,255,0.14)',
      }}
    >
      {children}
    </div>
  );
}
