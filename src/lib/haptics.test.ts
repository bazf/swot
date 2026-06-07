import { afterEach, describe, expect, it, vi } from 'vitest';
import { vibrate } from './haptics';

const original = navigator.vibrate;
afterEach(() => {
  if (original) (navigator as unknown as { vibrate: typeof original }).vibrate = original;
  else delete (navigator as unknown as { vibrate?: unknown }).vibrate;
});

describe('vibrate', () => {
  it('forwards the pattern to navigator.vibrate when available', () => {
    const spy = vi.fn();
    (navigator as unknown as { vibrate: unknown }).vibrate = spy;
    vibrate([12, 18, 70]);
    expect(spy).toHaveBeenCalledWith([12, 18, 70]);
  });

  it('no-ops (no throw) where the API is unavailable', () => {
    delete (navigator as unknown as { vibrate?: unknown }).vibrate;
    expect(() => vibrate(20)).not.toThrow();
  });

  it('swallows errors thrown by the API', () => {
    (navigator as unknown as { vibrate: unknown }).vibrate = () => {
      throw new Error('blocked');
    };
    expect(() => vibrate(20)).not.toThrow();
  });
});
