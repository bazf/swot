/* openrouter.ts — AI clustering + final SWOT synthesis.

   Only the master (board) calls these (the brief's rate-limit guard). Every call
   degrades gracefully to the sample data so a live педрада never hard-fails. */

import { CAT_ORDER, FINAL_REPORT, MAX_PLANETS, SAMPLE_CLUSTERS, STAR_MAP } from '../data/catalog';
import type {
  CategoryKey,
  Cluster,
  Message,
  MissionFinalReport,
  StarPlanet,
  SwotMap,
} from '../state/types';

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'meta-llama/llama-3-8b-instruct:free';

export interface OpenRouterOptions {
  key: string;
  model?: string;
  endpoint?: string;
  fetchImpl?: typeof fetch;
}

/** Pull the first JSON object/array out of an LLM response (tolerates fences/prose). */
export function extractJson<T = unknown>(text: string): T | null {
  if (!text) return null;
  let t = text.trim();
  // strip a leading ```json / ``` fence and trailing ```
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  const firstObj = t.indexOf('{');
  const firstArr = t.indexOf('[');
  let start = -1;
  let close = '}';
  if (firstArr !== -1 && (firstObj === -1 || firstArr < firstObj)) {
    start = firstArr;
    close = ']';
  } else if (firstObj !== -1) {
    start = firstObj;
    close = '}';
  }
  if (start === -1) return null;
  const end = t.lastIndexOf(close);
  if (end <= start) return null;
  try {
    return JSON.parse(t.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

async function chat(prompt: string, opts: OpenRouterOptions): Promise<string | null> {
  const f = opts.fetchImpl ?? fetch;
  try {
    const res = await f(opts.endpoint ?? ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${opts.key}`,
      },
      body: JSON.stringify({
        model: opts.model || DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

const isCat = (v: unknown): v is CategoryKey =>
  typeof v === 'string' && (CAT_ORDER as string[]).includes(v);

function validClusters(raw: unknown): Cluster[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: Cluster[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const cat = isCat(o.cat) ? o.cat : null;
    const title = typeof o.title === 'string' ? o.title : null;
    if (!cat || !title) continue;
    out.push({
      cat,
      title,
      emoji: typeof o.emoji === 'string' && o.emoji ? o.emoji : '🪐',
      percentage: Math.max(0, Math.min(100, Number(o.percentage) || 0)),
    });
  }
  return out.length ? out : null;
}

/** The brief's "eruption" prompt — group ~40 messages into 4–5 planets.
   Most thoughts are uncategorized (teachers don't pick a zone) — the model must
   assign each cluster a SWOT category; a `[cat]` prefix is a moderator hint. */
export function clusterPrompt(messages: Message[]): string {
  const lines = messages
    .map((m, i) => `${i + 1}. ${m.cat ? `[${m.cat}] ` : ''}${m.text}`)
    .join('\n');
  return (
    'Ти — аналітик педагогічної ради. Тобі надано анонімні думки вчителів; ' +
    'деякі мають орієнтовну категорію у дужках, більшість — без категорії. ' +
    'Згрупуй усі думки у 4–5 змістових кластерів і КОЖНОМУ кластеру признач категорію SWOT: ' +
    'str=сильні сторони, wek=слабкі сторони, opp=можливості, thr=загрози. ' +
    'Поверни СУВОРИЙ JSON-масив без пояснень у форматі: ' +
    '[{"cat":"str|wek|opp|thr","title":"коротка назва","emoji":"один емодзі","percentage":25}]. ' +
    'Сума percentage має приблизно дорівнювати 100.\n\nДумки:\n' +
    lines
  );
}

/** Cluster the accumulated messages; falls back to SAMPLE_CLUSTERS. */
export async function clusterIdeas(
  messages: Message[],
  opts: OpenRouterOptions,
): Promise<Cluster[]> {
  if (!opts.key || messages.length === 0) return SAMPLE_CLUSTERS.map((c) => ({ ...c }));
  const content = await chat(clusterPrompt(messages), opts);
  const parsed = content ? extractJson(content) : null;
  return validClusters(parsed) ?? SAMPLE_CLUSTERS.map((c) => ({ ...c }));
}

function validPlanets(raw: unknown): StarPlanet[] {
  if (!Array.isArray(raw)) return [];
  const out: StarPlanet[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    if (typeof o.title !== 'string') continue;
    out.push({
      title: o.title,
      emoji: typeof o.emoji === 'string' && o.emoji ? o.emoji : '🪐',
      percentage: Math.max(0, Math.min(100, Number(o.percentage) || 0)),
    });
  }
  // The star-map/report layout only has room for MAX_PLANETS per quadrant.
  return out.slice(0, MAX_PLANETS);
}

function validFinal(raw: unknown): MissionFinalReport | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const m = o.map as Record<string, unknown> | undefined;
  if (!m) return null;
  const map = {} as SwotMap;
  for (const k of CAT_ORDER) {
    map[k] = validPlanets(m[k]);
  }
  const total = CAT_ORDER.reduce((n, k) => n + map[k].length, 0);
  if (total === 0) return null;
  const priorities = Array.isArray(o.priorities)
    ? (o.priorities as unknown[]).filter((p): p is string => typeof p === 'string').slice(0, 3)
    : [];
  const conclusion = typeof o.conclusion === 'string' ? o.conclusion : '';
  if (priorities.length === 0 || !conclusion) return null;
  const recommendations = Array.isArray(o.recommendations)
    ? (o.recommendations as unknown[]).filter((p): p is string => typeof p === 'string').slice(0, 6)
    : [];
  const summary = typeof o.summary === 'string' ? o.summary : '';
  return {
    map,
    priorities,
    conclusion,
    recommendations: recommendations.length ? recommendations : FINAL_REPORT.recommendations ?? [],
    summary: summary || FINAL_REPORT.summary || conclusion,
  };
}

/** The brief's final prompt — build the SWOT map + TOP-3 + spoken conclusion. */
export function finalPrompt(clusters: Cluster[]): string {
  const lines = clusters
    .map((c) => `- [${c.cat}] ${c.title} (${c.percentage}%)`)
    .join('\n');
  return (
    'Проаналізуй усі зібрані думки та кластери педагогічної ради. ' +
    'Якщо якась думка не має категорії — самостійно признач їй правильний квадрант SWOT. ' +
    'Створи деталізований SWOT-звіт: для кожної категорії str/wek/opp/thr — 2–3 планети (пункти). ' +
    'Визнач ТОП-3 пріоритети на наступний рік. ' +
    'Додай 3–5 конкретних практичних рекомендацій (recommendations) — що саме зробити команді. ' +
    'Напиши розгорнутий підсумок на 2–3 речення (summary) для письмового звіту. ' +
    'Напиши також одне коротке речення-висновок (conclusion) для озвучення роботом (без спецсимволів та емодзі). ' +
    'Поверни СУВОРИЙ JSON без пояснень у форматі: ' +
    '{"map":{"str":[{"title":"","emoji":"⭐","percentage":40}],"wek":[],"opp":[],"thr":[]},' +
    '"priorities":["","",""],"recommendations":["",""],"summary":"","conclusion":""}.\n\nКластери:\n' +
    lines
  );
}

/** Synthesize the finale; falls back to the design's STAR_MAP + FINAL_REPORT. */
export async function finalAnalysis(
  clusters: Cluster[],
  opts: OpenRouterOptions,
): Promise<MissionFinalReport> {
  const fallback: MissionFinalReport = { map: STAR_MAP, ...FINAL_REPORT };
  if (!opts.key || clusters.length === 0) return fallback;
  const content = await chat(finalPrompt(clusters), opts);
  const parsed = content ? extractJson(content) : null;
  return validFinal(parsed) ?? fallback;
}
