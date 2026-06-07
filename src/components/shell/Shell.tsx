/* Shell — the offline demo: the full clickable prototype (board ⇄ phone),
   Director controls, theme toggle and the report overlay. */

import { useEffect, useRef, useState } from 'react';
import orbitalDrift from '../../assets/audio/orbital-drift.mp3';
import { useBackgroundMusic } from '../../state/useBackgroundMusic';
import { useDemoMission } from '../../state/useDemoMission';
import type { Phase, View } from '../../state/types';
import { useTheme } from '../../state/useTheme';
import { Multiboard } from '../board';
import { MobileClient, PhoneScreen } from '../mobile';
import { ReportOverlay } from '../report';
import { StarMap } from '../starmap';
import { Director } from './Director';
import { FitStage } from './FitStage';
import { Topbar } from './Topbar';

const boardCardStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  borderRadius: 18,
  overflow: 'hidden',
  boxShadow: '0 40px 120px -30px rgba(0,0,0,.8), 0 0 0 1px rgba(150,170,255,.12)',
};

export function Shell() {
  const m = useDemoMission();
  const { phase, addIdea } = m;
  const [view, setView] = useState<View>('board');
  const { theme, setTheme } = useTheme('dark');
  const { muted, toggle: toggleMute } = useBackgroundMusic(orbitalDrift, m.phase !== 'start');
  const [report, setReport] = useState(false);
  const [auto, setAuto] = useState(false);
  const autoRef = useRef<number | null>(null);

  // Auto idea-stream while collecting (demo convenience).
  useEffect(() => {
    if (!auto || phase !== 'collecting') return;
    const id = window.setInterval(() => addIdea(), 320);
    autoRef.current = id;
    return () => window.clearInterval(id);
  }, [auto, phase, addIdea]);

  // Auto-stop the stream once we leave the collecting phase.
  useEffect(() => {
    if (phase !== 'collecting') setAuto(false);
  }, [phase]);

  const jump = (phase: Phase) => {
    setAuto(false);
    m.jump(phase);
  };
  const reset = () => {
    setAuto(false);
    m.reset();
  };

  return (
    <div
      className={'app-root ' + (theme === 'light' ? 'theme-light' : '')}
      style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column' }}
    >
      <div className="cosmos-bg" style={{ opacity: 0.5 }} />
      <Topbar
        phase={m.phase}
        view={view}
        setView={setView}
        jump={jump}
        theme={theme}
        setTheme={setTheme}
        muted={muted}
        onToggleMute={toggleMute}
      />

      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        {view === 'board' ? (
          <FitStage w={1280} h={720}>
            <div className="board-canvas" style={boardCardStyle}>
              {m.phase === 'starmap' ? (
                <StarMap map={m.map} report={m.report} />
              ) : (
                <Multiboard
                  phase={m.phase}
                  ideas={m.ideas}
                  count={m.count}
                  cycle={m.cycle}
                  clusters={m.clusters}
                  finalizing={m.finalizing}
                  onStart={m.start}
                  onSwipe={m.swipe}
                  onAssign={m.assignCategory}
                />
              )}
            </div>
          </FitStage>
        ) : (
          <FitStage w={390} h={844}>
            <PhoneScreen>
              <MobileClient phase={m.phase} onSubmit={m.addIdea} onOpenReport={() => setReport(true)} />
            </PhoneScreen>
          </FitStage>
        )}

        {report && <ReportOverlay map={m.map} report={m.report} onClose={() => setReport(false)} />}
      </div>

      <Director
        demo
        phase={m.phase}
        count={m.count}
        cycle={m.cycle}
        auto={auto}
        onToggleAuto={() => setAuto((a) => !a)}
        onAddIdea={() => m.addIdea()}
        start={m.start}
        swipe={m.swipe}
        continueCycle={m.continueCycle}
        finish={m.finish}
        finishNow={m.finishNow}
        reset={reset}
      />
    </div>
  );
}
