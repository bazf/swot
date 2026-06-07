/* Starfield — deterministic twinkling star layer. */

import { useMemo } from 'react';
import type { CSSVars } from './css';

interface StarfieldProps {
  count?: number;
  seed?: number;
}

export function Starfield({ count = 90, seed = 1 }: StarfieldProps) {
  const stars = useMemo(() => {
    let s = seed * 9301;
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: count }, () => ({
      x: rnd() * 100,
      y: rnd() * 100,
      sz: rnd() * 2.2 + 0.6,
      tw: (rnd() * 4 + 2).toFixed(2) + 's',
      d: (rnd() * 4).toFixed(2) + 's',
    }));
  }, [count, seed]);

  return (
    <div className="starfield">
      {stars.map((star, i) => (
        <i
          key={i}
          style={
            {
              left: star.x + '%',
              top: star.y + '%',
              width: star.sz,
              height: star.sz,
              '--tw': star.tw,
              animationDelay: star.d,
              boxShadow: star.sz > 2 ? '0 0 6px 1px rgba(180,210,255,.8)' : 'none',
            } as CSSVars
          }
        />
      ))}
    </div>
  );
}
