/* useDemoMission — local in-memory simulation (no Firebase, no AI). */

import { useCallback, useMemo, useReducer } from 'react';
import { FINAL_REPORT, SAMPLE_CLUSTERS, STAR_MAP } from '../data/catalog';
import { initialState, missionReducer } from './machine';
import { makeIdea, seedCollecting, seedCritical } from './sim';
import type { CategoryKey, Idea, MissionApi, Phase } from './types';

const sampleClusters = () => SAMPLE_CLUSTERS.map((c) => ({ ...c }));
const sampleFinal = () => ({ map: STAR_MAP, ...FINAL_REPORT });

export function useDemoMission(): MissionApi {
  const [state, dispatch] = useReducer(missionReducer, initialState);

  const start = useCallback(() => dispatch({ type: 'start' }), []);
  const addIdea = useCallback((text?: string) => dispatch({ type: 'addIdea', idea: makeIdea(text) }), []);
  const assignCategory = useCallback(
    (idea: Idea, cat: CategoryKey) => dispatch({ type: 'assignCat', id: idea.id, cat }),
    [],
  );
  const swipe = useCallback(() => dispatch({ type: 'swipe', clusters: sampleClusters() }), []);
  const continueCycle = useCallback(() => dispatch({ type: 'continueCycle' }), []);
  const finish = useCallback(() => dispatch({ type: 'finish', report: sampleFinal() }), []);
  const finishNow = finish;
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const cycleRef = state.cycle;
  const jump = useCallback(
    (phase: Phase) => {
      switch (phase) {
        case 'start':
          return dispatch({ type: 'reset' });
        case 'collecting':
          return dispatch({ type: 'seed', phase: 'collecting', ideas: seedCollecting(), count: 8 });
        case 'critical':
          return dispatch({ type: 'seed', phase: 'critical', ideas: seedCritical(), count: 40 });
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
    [cycleRef],
  );

  const map = state.finalReport?.map ?? STAR_MAP;
  const report = useMemo(
    () =>
      state.finalReport
        ? { priorities: state.finalReport.priorities, conclusion: state.finalReport.conclusion }
        : FINAL_REPORT,
    [state.finalReport],
  );

  return {
    phase: state.phase,
    ideas: state.ideas,
    count: state.count,
    cycle: state.cycle,
    clusters: state.clusters,
    map,
    report,
    busy: false,
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
