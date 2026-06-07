/* useBackgroundMusic — looping board music with a persisted mute toggle. */

import { useCallback, useEffect, useRef, useState } from 'react';

const MUTE_KEY = 'glx-muted';

function loadMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Plays `src` on a loop while `active && !muted`. Autoplay works because the
 * mission starts from a user click (the page gains activation); any block is
 * swallowed. Mute is remembered across sessions.
 */
export function useBackgroundMusic(src: string, active: boolean, volume = 0.3) {
  const [muted, setMuted] = useState(loadMuted);
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch {
      /* storage unavailable */
    }
  }, [muted]);

  useEffect(() => {
    let a = ref.current;
    if (!a) {
      try {
        a = new Audio(src);
        a.loop = true;
        a.volume = volume;
        ref.current = a;
      } catch {
        return;
      }
    }
    if (active && !muted) {
      const p = a.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      a.pause();
    }
  }, [src, active, muted, volume]);

  // Stop on unmount.
  useEffect(
    () => () => {
      ref.current?.pause();
      ref.current = null;
    },
    [],
  );

  const toggle = useCallback(() => setMuted((m) => !m), []);
  return { muted, toggle };
}
