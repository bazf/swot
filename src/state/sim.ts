/* sim.ts — demo-mode idea generation + phase seeding (mirrors the prototype).
   Ideas are category-less "stardust" — they gain a category only when the
   moderator drags them into a zone (or the AI groups them). */

import { CAT_ORDER, IDEA_POOL, THRESHOLD } from '../data/catalog';
import type { Idea } from './types';

const ALL_TEXTS = CAT_ORDER.flatMap((k) => IDEA_POOL[k]);

/** Random spawn position inside the 1280×720 board, ringed around the core. */
export function spawnPos(): { x: number; y: number } {
  const cx = 640,
    cy = 360,
    ang = Math.random() * Math.PI * 2,
    rad = 205 + Math.random() * 150;
  const x = cx + Math.cos(ang) * rad - 95;
  const y = cy + Math.sin(ang) * rad * 0.72 - 22;
  return { x: Math.max(18, Math.min(1075, x)), y: Math.max(82, Math.min(612, y)) };
}

/** A random sample thought (uncategorized). */
export function randText(): string {
  return ALL_TEXTS[Math.floor(Math.random() * ALL_TEXTS.length)];
}

/** Build an idea (without id) — explicit text, or a random sample. No category. */
export function makeIdea(text?: string): Omit<Idea, 'id'> {
  return {
    text: text ?? randText(),
    ...spawnPos(),
    delay: +(Math.random() * 0.2).toFixed(2),
    fl: +(4 + Math.random() * 3).toFixed(1),
  };
}

/** Seed 8 ideas for the "jump to collecting" shortcut. */
export function seedCollecting(): Idea[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    text: randText(),
    ...spawnPos(),
    delay: +(i * 0.05).toFixed(2),
    fl: +(4 + Math.random() * 3).toFixed(1),
  }));
}

/** Seed a full 40 ideas for the "jump to critical" shortcut. */
export function seedCritical(): Idea[] {
  return Array.from({ length: THRESHOLD }, (_, i) => ({
    id: i + 1,
    text: randText(),
    ...spawnPos(),
    delay: +(Math.random() * 0.3).toFixed(2),
    fl: +(4 + Math.random() * 3).toFixed(1),
  }));
}
