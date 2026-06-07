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

/** A teacher's thought, rendered as a drifting asteroid.
   `cat` is undefined until the moderator sorts it into a zone (or the AI groups it). */
export interface Idea {
  id: number;
  cat?: CategoryKey;
  text: string;
  /** Live Firebase message key (for category write-back). */
  key?: string;
  /** Spawn coordinates inside the 1280×720 board. */
  x: number;
  y: number;
  /** Animation timings. */
  delay: number;
  fl: number;
}

/** Raw message as stored in Firebase `/messages`. Teachers don't categorize;
   `cat` is set only if the moderator sorts the thought into a zone. */
export interface Message {
  cat?: CategoryKey;
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

/** Priorities, recommendations, a written summary + the spoken AI conclusion. */
export interface FinalReport {
  priorities: string[];
  conclusion: string;
  /** Actionable recommendations rendered in the written report. */
  recommendations?: string[];
  /** A fuller written summary for the report (the spoken `conclusion` stays short). */
  summary?: string;
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
  addIdea: (text?: string) => void;
  /** Moderator manually sorts a thought into a SWOT zone. */
  assignCategory: (idea: Idea, cat: CategoryKey) => void;
  swipe: () => void;
  continueCycle: () => void;
  finish: () => void;
  /** Wrap up immediately from any phase (cluster current thoughts, then finalize). */
  finishNow: () => void;
  reset: () => void;
  jump: (phase: Phase) => void;
}
