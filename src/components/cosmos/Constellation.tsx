/* Constellation — glowing SVG polyline + nodes between planet points. */

export interface Point {
  x: number;
  y: number;
}

interface ConstellationProps {
  points: Point[];
  glow: string;
}

export function Constellation({ points, glow }: ConstellationProps) {
  if (!points || points.length < 2) return null;
  const d = points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ');
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={`rgba(${glow},.85)`}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 5px rgba(${glow},.9))` }}
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="2.6"
          fill="#fff"
          style={{ filter: `drop-shadow(0 0 4px rgba(${glow},1))` }}
        />
      ))}
    </svg>
  );
}
