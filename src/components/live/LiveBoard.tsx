/* LiveBoard — the Master multiboard, driven by Firebase + OpenRouter. */

import { LINK } from '../../data/catalog';
import type { MissionService } from '../../lib/firebase';
import type { OpenRouterOptions } from '../../lib/openrouter';
import { useLiveMission } from '../../state/useLiveMission';
import { Multiboard } from '../board';
import { StarMap } from '../starmap';
import { Director } from '../shell/Director';
import { FitStage } from '../shell/FitStage';

interface LiveBoardProps {
  service: MissionService;
  orOpts: OpenRouterOptions;
}

export function LiveBoard({ service, orOpts }: LiveBoardProps) {
  const m = useLiveMission(service, 'board', orOpts);
  return (
    <div className="app-root" style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="cosmos-bg" style={{ opacity: 0.5 }} />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <FitStage w={1280} h={720}>
          <div
            className="board-canvas"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 40px 120px -30px rgba(0,0,0,.8), 0 0 0 1px rgba(150,170,255,.12)',
            }}
          >
            {m.phase === 'starmap' ? (
              <StarMap map={m.map} report={m.report} />
            ) : (
              <Multiboard
                phase={m.phase}
                ideas={m.ideas}
                count={m.count}
                cycle={m.cycle}
                clusters={m.clusters}
                link={LINK}
                onStart={m.start}
                onSwipe={m.swipe}
              />
            )}
          </div>
        </FitStage>
      </div>
      <Director
        phase={m.phase}
        count={m.count}
        cycle={m.cycle}
        busy={m.busy}
        start={m.start}
        swipe={m.swipe}
        continueCycle={m.continueCycle}
        finish={m.finish}
        reset={m.reset}
      />
    </div>
  );
}
