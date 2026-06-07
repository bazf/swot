/* Shared domain types for the mission. */

export type CategoryKey = 'str' | 'wek' | 'opp' | 'thr';

export interface Category {
  key: CategoryKey;
  /** Cosmic planet name, e.g. «Зірки». */
  planet: string;
  /** SWOT label, e.g. «Сильні сторони». */
  swot: string;
  emoji: string;
  hint: string;
  /** CSS variable suffix (`--str`, `--wek`, …). */
  cssVar: CategoryKey;
  /** "r,g,b" triple used inside rgba() glows. */
  glow: string;
}

/** Phases of the multiboard, mapped to the brief's app_state. */
export type Phase = 'start' | 'collecting' | 'critical' | 'clusters' | 'starmap';

/** A teacher's thought, rendered as a drifting asteroid. */
export interface Idea {
  id: number;
  cat: CategoryKey;
  text: string;
  /** Spawn coordinates inside the 1280×720 board. */
  x: number;
  y: number;
  /** Animation timings. */
  delay: number;
  fl: number;
}

/** Raw message as stored in Firebase `/messages`. */
export interface Message {
  cat: CategoryKey;
  text: string;
  ts: number;
}

/** AI-grouped planet (one accumulation cycle). */
export interface Cluster {
  cat: CategoryKey;
  title: string;
  emoji: string;
  percentage: number;
}

/** A planet inside a SWOT constellation (category implied by its quadrant). */
export interface StarPlanet {
  title: string;
  emoji: string;
  percentage: number;
}

/** Final star map: planets per SWOT quadrant. */
export type SwotMap = Record<CategoryKey, StarPlanet[]>;

/** TOP-3 priorities + the spoken AI conclusion. */
export interface FinalReport {
  priorities: string[];
  conclusion: string;
}

/** Combined finale payload persisted to Firebase `/final_report`. */
export interface MissionFinalReport extends FinalReport {
  map: SwotMap;
}

/** Master/slave roles (brief's Master-Slave pattern). */
export type Role = 'board' | 'phone';

/** Which client view is shown in demo mode. */
export type View = 'board' | 'phone';

/** Unified mission API consumed by the board/phone scenes (demo + live). */
export interface MissionApi {
  phase: Phase;
  ideas: Idea[];
  count: number;
  cycle: number;
  clusters: Cluster[];
  map: SwotMap;
  report: FinalReport;
  /** AI request in flight (board only). */
  busy: boolean;
  start: () => void;
  addIdea: (cat?: CategoryKey, text?: string) => void;
  swipe: () => void;
  continueCycle: () => void;
  finish: () => void;
  reset: () => void;
  jump: (phase: Phase) => void;
}
