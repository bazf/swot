/* Quadrant — one SWOT constellation hugged into a board corner. */

import type { CSSProperties } from 'react';
import { CATS, MAX_PLANETS } from '../../data/catalog';
import type { CategoryKey, StarPlanet } from '../../state/types';
import { CategoryOrb, Constellation, Draggable, Planet } from '../cosmos';

export type Corner = 'tl' | 'tr' | 'bl' | 'br';

// Planet centres inside a quadrant field (380×220), hugged toward the outer corner.
const LAYOUTS: Record<Corner, Record<number, [number, number][]>> = {
  tl: { 3: [[68, 48], [230, 34], [96, 158]], 2: [[80, 52], [232, 150]] },
  tr: { 3: [[312, 48], [150, 34], [284, 158]], 2: [[300, 52], [148, 150]] },
  bl: { 3: [[78, 138], [238, 156], [102, 50]], 2: [[86, 148], [236, 58]] },
  br: { 3: [[302, 138], [142, 156], [278, 50]], 2: [[294, 148], [144, 58]] },
};

const POS: Record<Corner, CSSProperties> = {
  tl: { left: 30, top: 80 },
  tr: { right: 30, top: 80 },
  bl: { left: 30, bottom: 30 },
  br: { right: 30, bottom: 30 },
};

interface QuadrantProps {
  cat: CategoryKey;
  planets: StarPlanet[];
  corner: Corner;
}

export function Quadrant({ cat, planets, corner }: QuadrantProps) {
  const c = CATS[cat];
  const topHeader = corner === 'tl' || corner === 'tr';
  const rightAlign = corner === 'tr' || corner === 'br';
  // Cap to the layouts we actually have coordinates for, so we never index past `coords`.
  const shown = planets.slice(0, MAX_PLANETS);
  const n = shown.length;
  const coords = (LAYOUTS[corner][n] || LAYOUTS[corner][MAX_PLANETS]).slice(0, n);
  const pts = coords.map(([x, y]) => ({ x, y }));
  const vEdge = topHeader ? 'top' : 'bottom';
  const badge = <CategoryOrb cat={cat} size={30} fontSize={15} boxShadow={`0 0 14px rgba(${c.glow},.6)`} />;
  return (
    <div style={{ position: 'absolute', width: 380, height: 268, ...POS[corner], zIndex: 16, animation: 'fade-up .9s ease' }}>
      {/* header near the outer corner */}
      <div
        style={
          {
            position: 'absolute',
            left: 0,
            right: 0,
            [vEdge]: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: rightAlign ? 'flex-end' : 'flex-start',
          } as CSSProperties
        }
      >
        {!rightAlign && badge}
        <div style={{ textAlign: rightAlign ? 'right' : 'left' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: `var(--${c.cssVar})` }}>
            {c.swot}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            сузір'я «{c.planet}»
          </div>
        </div>
        {rightAlign && badge}
      </div>
      {/* field with lines + planets */}
      <div style={{ position: 'absolute', left: 0, width: 380, height: 220, [vEdge]: 44 } as CSSProperties}>
        <Constellation points={pts} glow={c.glow} />
        {shown.map((pl, i) => (
          <Draggable
            key={i}
            style={{ position: 'absolute', left: coords[i][0], top: coords[i][1] }}
            baseTransform="translate(-50%,-50%)"
          >
            <div style={{ animation: `asteroid-in .7s ease ${0.3 + i * 0.15}s both` }}>
              <Planet cat={cat} title={pl.title} emoji={pl.emoji} percentage={pl.percentage} size={82} />
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
