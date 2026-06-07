import { THRESHOLD } from '../data/catalog';
import { initialState, missionReducer, type MissionState } from './machine';
import type { Cluster, Idea, MissionFinalReport, SwotMap } from './types';

const idea = (): Omit<Idea, 'id'> => ({ cat: 'str', text: 'x', x: 0, y: 0, delay: 0, fl: 5 });

describe('missionReducer', () => {
  it('start → collecting', () => {
    expect(missionReducer(initialState, { type: 'start' }).phase).toBe('collecting');
  });

  it('accumulates ideas and flips to critical at the threshold', () => {
    let s: MissionState = { ...initialState, phase: 'collecting' };
    for (let i = 0; i < THRESHOLD; i++) s = missionReducer(s, { type: 'addIdea', idea: idea() });
    expect(s.count).toBe(THRESHOLD);
    expect(s.phase).toBe('critical');
    expect(s.ideas).toHaveLength(THRESHOLD);
  });

  it('parks overflow once critical mass is reached (hidden queue)', () => {
    const s = missionReducer({ ...initialState, count: THRESHOLD, phase: 'critical' }, { type: 'addIdea', idea: idea() });
    expect(s.count).toBe(THRESHOLD);
  });

  it('swipe → clusters, resets count, bumps the cycle', () => {
    const clusters: Cluster[] = [{ cat: 'str', title: 't', emoji: '⭐', percentage: 10 }];
    const s = missionReducer({ ...initialState, phase: 'critical', count: THRESHOLD, cycle: 1 }, { type: 'swipe', clusters });
    expect(s.phase).toBe('clusters');
    expect(s.count).toBe(0);
    expect(s.cycle).toBe(2);
    expect(s.clusters).toEqual(clusters);
    expect(s.ideas).toEqual([]);
  });

  it('finish → starmap and stores the final report', () => {
    const report: MissionFinalReport = { map: {} as SwotMap, priorities: ['a'], conclusion: 'c' };
    const s = missionReducer({ ...initialState, phase: 'clusters' }, { type: 'finish', report });
    expect(s.phase).toBe('starmap');
    expect(s.finalReport).toBe(report);
  });

  it('reset → initial state', () => {
    expect(missionReducer({ ...initialState, phase: 'starmap', count: 5 }, { type: 'reset' })).toEqual(initialState);
  });

  it('seed sets phase and advances nextId past seeded ids', () => {
    const ideas: Idea[] = [{ id: 3, ...idea() }];
    const s = missionReducer(initialState, { type: 'seed', phase: 'collecting', ideas, count: 1 });
    expect(s.phase).toBe('collecting');
    expect(s.count).toBe(1);
    expect(s.nextId).toBe(3);
  });
});
