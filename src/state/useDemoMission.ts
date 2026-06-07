/* useDemoMission — local in-memory simulation (no Firebase, no AI). */

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { FINAL_REPORT, SAMPLE_CLUSTERS, STAR_MAP, THRESHOLD } from '../data/catalog';
import { initialState, missionReducer } from './machine';
import { makeIdea, seedCollecting, seedCritical } from './sim';
import type { CategoryKey, Idea, MissionApi, Phase } from './types';

const sampleClusters = () => SAMPLE_CLUSTERS.map((c) => ({ ...c }));
const sampleFinal = () => ({ map: STAR_MAP, ...FINAL_REPORT });

/** Mirror the live AI synthesis pause so the finale indicator is visible in the demo. */
const FINALIZE_DELAY_MS = 1200;

export function useDemoMission(): MissionApi {
  const [state, dispatch] = useReducer(missionReducer, initialState);
  const [finalizing, setFinalizing] = useState(false);
  const finalizeRef = useRef<number | null>(null);

  const clearFinalize = useCallback(() => {
    if (finalizeRef.current != null) {
      window.clearTimeout(finalizeRef.current);
      finalizeRef.current = null;
    }
  }, []);
  useEffect(() => clearFinalize, [clearFinalize]);

  const start = useCallback(() => dispatch({ type: 'start' }), []);
  const addIdea = useCallback((text?: string) => dispatch({ type: 'addIdea', idea: makeIdea(text) }), []);
  const assignCategory = useCallback(
    (idea: Idea, cat: CategoryKey) => dispatch({ type: 'assignCat', id: idea.id, cat }),
    [],
  );
  const swipe = useCallback(() => dispatch({ type: 'swipe', clusters: sampleClusters() }), []);
  const continueCycle = useCallback(() => dispatch({ type: 'continueCycle' }), []);
  // Hold the finale briefly so the big "Формування зоряної карти…" indicator shows.
  const finish = useCallback(() => {
    if (finalizeRef.current != null) return;
    setFinalizing(true);
    finalizeRef.current = window.setTimeout(() => {
      finalizeRef.current = null;
      setFinalizing(false);
      dispatch({ type: 'finish', report: sampleFinal() });
    }, FINALIZE_DELAY_MS);
  }, []);
  const finishNow = finish;
  const reset = useCallback(() => {
    clearFinalize();
    setFinalizing(false);
    dispatch({ type: 'reset' });
  }, [clearFinalize]);

  const cycleRef = state.cycle;
  const jump = useCallback(
    (phase: Phase) => {
      clearFinalize();
      setFinalizing(false);
      switch (phase) {
        case 'start':
          return dispatch({ type: 'reset' });
        case 'collecting':
          return dispatch({ type: 'seed', phase: 'collecting', ideas: seedCollecting(), count: 8 });
        case 'critical':
          return dispatch({ type: 'seed', phase: 'critical', ideas: seedCritical(), count: THRESHOLD });
        case 'clusters':
          return dispatch({
            type: 'seed',
            phase: 'clusters',
            ideas: [],
            count: 0,
            clusters: sampleClusters(),
            cycle: Math.max(2, cycleRef),
          });
        case 'starmap':
          return dispatch({ type: 'finish', report: sampleFinal() });
      }
    },
    [cycleRef, clearFinalize],
  );

  const map = state.finalReport?.map ?? STAR_MAP;
  const report = state.finalReport ?? FINAL_REPORT;

  return {
    phase: state.phase,
    ideas: state.ideas,
    count: state.count,
    cycle: state.cycle,
    clusters: state.clusters,
    map,
    report,
    busy: finalizing,
    finalizing,
    start,
    addIdea,
    assignCategory,
    swipe,
    continueCycle,
    finish,
    finishNow,
    reset,
    jump,
  };
}
