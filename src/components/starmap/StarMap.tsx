/* StarMap — the final Strategic Star Map: 4 constellations + TOP-3 orbit + voice. */

import { useEffect, useState } from 'react';
import { cancelSpeech, speak } from '../../lib/speech';
import type { FinalReport, SwotMap } from '../../state/types';
import { Starfield } from '../cosmos';
import { PriorityCore } from './PriorityCore';
import { Quadrant } from './Quadrant';

interface StarMapProps {
  map: SwotMap;
  report: FinalReport;
  /** Narrate the conclusion automatically on mount (default true). */
  autoSpeak?: boolean;
}

export function StarMap({ map, report, autoSpeak = true }: StarMapProps) {
  const [speaking, setSpeaking] = useState(false);

  const speakNow = () => {
    const started = speak(report.conclusion, {
      onend: () => setSpeaking(false),
      onerror: () => setSpeaking(false),
    });
    setSpeaking(started);
  };

  useEffect(() => {
    if (!autoSpeak) return;
    const t = setTimeout(speakNow, 900);
    return () => {
      clearTimeout(t);
      cancelSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSpeak]);

  return (
    <div className="board-stage" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div className="cosmos-bg" />
      <Starfield count={130} seed={7} />

      <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 30, textAlign: 'center' }}>
        <div className="eyebrow">Місія завершена · Бортовий журнал сформовано</div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 26,
            margin: '6px 0 0',
            background: 'var(--title-grad)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Зоряна карта стратегії
        </h2>
      </div>

      <Quadrant cat="str" planets={map.str} corner="tl" />
      <Quadrant cat="wek" planets={map.wek} corner="tr" />
      <Quadrant cat="opp" planets={map.opp} corner="bl" />
      <Quadrant cat="thr" planets={map.thr} corner="br" />

      <PriorityCore report={report} speaking={speaking} onSpeak={speakNow} />
    </div>
  );
}
