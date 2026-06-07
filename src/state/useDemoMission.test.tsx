import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { THRESHOLD } from '../data/catalog';
import { useDemoMission } from './useDemoMission';

describe('useDemoMission', () => {
  it('walks the full mission lifecycle', () => {
    vi.useFakeTimers();
    try {
      const { result } = renderHook(() => useDemoMission());
      expect(result.current.phase).toBe('start');

      act(() => result.current.start());
      expect(result.current.phase).toBe('collecting');

      act(() => {
        for (let i = 0; i < THRESHOLD; i++) result.current.addIdea('думка');
      });
      expect(result.current.count).toBe(THRESHOLD);
      expect(result.current.phase).toBe('critical');

      act(() => result.current.swipe());
      expect(result.current.phase).toBe('clusters');
      expect(result.current.clusters.length).toBeGreaterThan(0);

      // Finalizing holds briefly (drives the big board indicator) before the finale.
      act(() => result.current.finish());
      expect(result.current.finalizing).toBe(true);
      expect(result.current.phase).toBe('clusters');

      act(() => vi.runAllTimers());
      expect(result.current.finalizing).toBe(false);
      expect(result.current.phase).toBe('starmap');
      expect(result.current.report.priorities).toHaveLength(3);
      expect(result.current.report.recommendations?.length).toBeGreaterThan(0);
      expect(result.current.report.summary).toBeTruthy();
      expect(result.current.report.stats?.total).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('jumps straight to a phase via the stepper', () => {
    const { result } = renderHook(() => useDemoMission());
    act(() => result.current.jump('critical'));
    expect(result.current.phase).toBe('critical');
    expect(result.current.count).toBe(THRESHOLD);
    act(() => result.current.jump('starmap'));
    expect(result.current.phase).toBe('starmap');
  });
});
