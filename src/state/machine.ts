/* machine.ts — pure mission reducer (phase / ideas / count / cycle / clusters).
   Encodes the brief's mechanics so it can be unit-tested in isolation. */

import { THRESHOLD } from '../data/catalog';
import type { Cluster, Idea, MissionFinalReport, Phase } from './types';

export interface MissionState {
  phase: Phase;
  ideas: Idea[];
  count: number;
  cycle: number;
  clusters: Cluster[];
  finalReport: MissionFinalReport | null;
  nextId: number;
}

export const initialState: MissionState = {
  phase: 'start',
  ideas: [],
  count: 0,
  cycle: 1,
  clusters: [],
  finalReport: null,
  nextId: 0,
};

export type MissionAction =
  | { type: 'start' }
  | { type: 'addIdea'; idea: Omit<Idea, 'id'> }
  | { type: 'swipe'; clusters: Cluster[] }
  | { type: 'continueCycle' }
  | { type: 'finish'; report: MissionFinalReport }
  | { type: 'reset' }
  | {
      type: 'seed';
      phase: Phase;
      ideas?: Idea[];
      count?: number;
      clusters?: Cluster[];
      cycle?: number;
    };

export function missionReducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {
    case 'start':
      return { ...state, phase: 'collecting' };

    case 'addIdea': {
      // Once critical mass is reached, new ideas go to a hidden queue (brief).
      if (state.count >= THRESHOLD) return state;
      const id = state.nextId + 1;
      const ideas = [...state.ideas.slice(-(THRESHOLD - 1)), { id, ...action.idea }];
      const count = state.count + 1;
      const phase: Phase = count >= THRESHOLD ? 'critical' : state.phase;
      return { ...state, ideas, count, nextId: id, phase };
    }

    case 'swipe':
      // Oksana swipes the core → AI clusters the 40 → next accumulation cycle.
      return {
        ...state,
        clusters: action.clusters,
        ideas: [],
        count: 0,
        cycle: state.cycle + 1,
        phase: 'clusters',
      };

    case 'continueCycle':
      return { ...state, phase: 'collecting' };

    case 'finish':
      return { ...state, phase: 'starmap', finalReport: action.report };

    case 'reset':
      return { ...initialState };

    case 'seed': {
      const ideas = action.ideas ?? state.ideas;
      const maxId = ideas.reduce((m, i) => Math.max(m, i.id), state.nextId);
      return {
        ...state,
        phase: action.phase,
        ideas,
        count: action.count ?? state.count,
        clusters: action.clusters ?? state.clusters,
        cycle: action.cycle ?? state.cycle,
        nextId: maxId,
      };
    }

    default:
      return state;
  }
}
