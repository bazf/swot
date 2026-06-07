/* Multiboard — the moderator's big screen for start/collecting/critical/clusters.
   (The finale is rendered by StarMap.) */

import type { CategoryKey, Cluster, Idea, Phase } from '../../state/types';
import { Asteroid, Draggable, GalaxyCore, Planet, Starfield, StarBirth, glowForId } from '../cosmos';
import { BoardHUD } from './BoardHUD';
import { BoardZones } from './BoardZones';
import { CriticalBanner } from './CriticalBanner';
import { StartScreen } from './StartScreen';
import { zoneForPoint } from './zones';

interface MultiboardProps {
  phase: Phase;
  ideas: Idea[];
  count: number;
  cycle: number;
  clusters: Cluster[];
  onStart: () => void;
  onSwipe: () => void;
  onAssign: (idea: Idea, cat: CategoryKey) => void;
}

export function Multiboard({ phase, ideas, count, cycle, clusters, onStart, onSwipe, onAssign }: MultiboardProps) {
  const crit = phase === 'critical';
  const showCore = phase === 'collecting' || phase === 'critical';
  const showIdeas = phase === 'collecting' || phase === 'critical';
  return (
    <div className="board-stage" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div className="cosmos-bg" />
      <Starfield count={110} />

      {phase === 'start' && <StartScreen onStart={onStart} />}

      {phase !== 'start' && phase !== 'starmap' && <BoardHUD phase={phase} count={count} cycle={cycle} />}

      {showIdeas && <BoardZones />}

      {showIdeas &&
        ideas.map((it) => (
          <Draggable
            key={it.id}
            style={{ position: 'absolute', left: it.x, top: it.y, zIndex: 10 }}
            onDrop={(delta) => onAssign(it, zoneForPoint(it.x + delta.x, it.y + delta.y))}
          >
            <div
              style={{
                position: 'relative',
                animation: `float-soft ${it.fl}s ease-in-out ${0.9 + it.delay}s infinite`,
              }}
            >
              <StarBirth glow={glowForId(it.id)} delay={it.delay} />
              <div style={{ animation: `idea-birth 1.05s cubic-bezier(.2,.7,.3,1.15) ${it.delay}s both` }}>
                <Asteroid cat={it.cat} text={it.text} />
              </div>
            </div>
          </Draggable>
        ))}

      {showCore && (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 15 }}>
          <GalaxyCore size={236} critical={crit} onSwipe={crit ? onSwipe : null} />
        </div>
      )}

      {crit && <CriticalBanner />}

      {phase === 'collecting' && (
        <div className="drag-hint">✋ Перетягуйте думки в кольорові зони, щоб упорядкувати їх</div>
      )}

      {phase === 'clusters' && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', zIndex: 18, animation: 'fade-up .7s ease' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
            <div style={{ textAlign: 'center' }}>
              <div className="eyebrow">Хаос структуровано · цикл {cycle}</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, margin: '8px 0 0' }}>
                Думки згруповано в планети
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1040 }}>
              {clusters.map((cl, i) => (
                <Draggable key={i} style={{ position: 'relative' }}>
                  <div style={{ animation: `asteroid-in .6s ease ${i * 0.12}s both` }}>
                    <Planet cat={cl.cat} title={cl.title} emoji={cl.emoji} percentage={cl.percentage} />
                  </div>
                </Draggable>
              ))}
            </div>
            <div style={{ color: 'var(--ink-dim)', fontSize: 14 }}>
              Цикл накопичення можна продовжити або завершити місію
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
