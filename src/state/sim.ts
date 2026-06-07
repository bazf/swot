/* sim.ts — demo-mode idea generation + phase seeding (mirrors the prototype). */

import { CAT_ORDER, IDEA_POOL, THRESHOLD } from '../data/catalog';
import type { CategoryKey, Idea } from './types';

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

/** Pick a random sample thought (optionally constrained to a category). */
export function randIdeaText(cat?: CategoryKey): { cat: CategoryKey; text: string } {
  const c = cat ?? CAT_ORDER[Math.floor(Math.random() * CAT_ORDER.length)];
  const arr = IDEA_POOL[c];
  return { cat: c, text: arr[Math.floor(Math.random() * arr.length)] };
}

/** Build an idea (without id) — explicit cat+text, or a random sample. */
export function makeIdea(cat?: CategoryKey | null, text?: string): Omit<Idea, 'id'> {
  const pick = cat && text ? { cat, text } : randIdeaText(cat ?? undefined);
  return {
    ...pick,
    ...spawnPos(),
    delay: +(Math.random() * 0.2).toFixed(2),
    fl: +(4 + Math.random() * 3).toFixed(1),
  };
}

/** Seed 8 ideas for the "jump to collecting" shortcut. */
export function seedCollecting(): Idea[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    ...randIdeaText(),
    ...spawnPos(),
    delay: +(i * 0.05).toFixed(2),
    fl: +(4 + Math.random() * 3).toFixed(1),
  }));
}

/** Seed a full 40 ideas for the "jump to critical" shortcut. */
export function seedCritical(): Idea[] {
  return Array.from({ length: THRESHOLD }, (_, i) => ({
    id: i + 1,
    ...randIdeaText(),
    ...spawnPos(),
    delay: +(Math.random() * 0.3).toFixed(2),
    fl: +(4 + Math.random() * 3).toFixed(1),
  }));
}
