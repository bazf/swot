/* audio.ts — lightweight one-shot sound effects (best-effort). */

/** Play a sound once; silently no-ops if blocked or unavailable. */
export function playOneShot(src: string, volume = 0.6): void {
  try {
    const a = new Audio(src);
    a.volume = volume;
    const p = a.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch {
    /* audio unavailable */
  }
}
