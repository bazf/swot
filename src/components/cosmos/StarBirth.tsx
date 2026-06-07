/* StarBirth — «Народження зірки»: the cosmic ignition layers an idea is born
   from. Layered burst (rays / shockwaves / core / sparks) that flashes once on
   mount, behind the chip. Needs starbirth.css.
   Props: glow ("R,G,B" color), delay (seconds). */

import type { CSSVars } from './css';

interface StarBirthProps {
  /** Glow color as an "R,G,B" triple. */
  glow: string;
  /** Start delay in seconds. */
  delay?: number;
}

const SPARK_ANGLES = [10, 70, 130, 185, 245, 305];

export function StarBirth({ glow, delay = 0 }: StarBirthProps) {
  const d = `${delay}s`;
  return (
    <span className="starbirth" aria-hidden="true" style={{ '--g': glow } as CSSVars}>
      <span className="sb-rays" style={{ animationDelay: d }} />
      <span className="sb-shock" style={{ animationDelay: d }} />
      <span className="sb-shock sb-shock2" style={{ animationDelay: `${delay + 0.14}s` }} />
      <span className="sb-core" style={{ animationDelay: d }} />
      {SPARK_ANGLES.map((a, i) => (
        <span key={i} className="sb-spark" style={{ '--a': `${a}deg`, animationDelay: `${delay + 0.05}s` } as CSSVars} />
      ))}
    </span>
  );
}

/* Per-idea glow color. A golden-angle hue keeps successive ideas maximally
   distinct ("random colors"), and deriving it from a stable id (vs. Math.random
   at render time) keeps each birth's color fixed across re-renders. */
export function glowForId(id: number): string {
  return hslToRgb(((id * 137.508) % 360 + 360) % 360, 0.85, 0.62);
}

function hslToRgb(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c);
  };
  return `${channel(0)},${channel(8)},${channel(4)}`;
}
