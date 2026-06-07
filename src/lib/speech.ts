/* speech.ts — Web Speech API wrapper for the AI conclusion narration. */

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  onend?: () => void;
  onerror?: () => void;
}

/**
 * Speak `text` with the browser's synthesized voice. Returns `true` if speech
 * was started, `false` if the API is unavailable (so callers can reset state).
 */
export function speak(text: string, opts: SpeakOptions = {}): boolean {
  try {
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return false;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = opts.lang ?? 'uk-UA';
    u.rate = opts.rate ?? 0.95;
    u.pitch = opts.pitch ?? 0.9;
    const voices = synth.getVoices?.() ?? [];
    const v = voices.find((x) => /uk|ua|ukr/i.test(x.lang));
    if (v) u.voice = v;
    if (opts.onend) u.onend = opts.onend;
    if (opts.onerror) u.onerror = opts.onerror;
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
}

/** Stop any in-flight narration. */
export function cancelSpeech(): void {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* speechSynthesis unavailable */
  }
}
