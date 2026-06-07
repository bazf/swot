/* haptics.ts — best-effort vibration feedback for mobile clients. */

/**
 * Vibrate with a duration or pattern (ms). Silently no-ops where the Vibration
 * API is unavailable (desktop, iOS Safari) or blocked — purely additive feedback.
 */
export function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    /* vibration unavailable */
  }
}
