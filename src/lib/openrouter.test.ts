import { SAMPLE_CLUSTERS } from '../data/catalog';
import type { Cluster, Message } from '../state/types';
import { clusterIdeas, clusterPrompt, extractJson, finalAnalysis, finalPrompt } from './openrouter';

const msgs: Message[] = [{ cat: 'str', text: 'Сильна команда', ts: 0 }];
const clusters: Cluster[] = [{ cat: 'str', title: 'Команда', emoji: '⭐', percentage: 50 }];

const fakeFetch = (content: string) =>
  ((async () => ({ ok: true, json: async () => ({ choices: [{ message: { content } }] }) })) as unknown as typeof fetch);

describe('extractJson', () => {
  it('parses plain JSON', () => expect(extractJson('{"a":1}')).toEqual({ a: 1 }));
  it('strips ```json fences', () => expect(extractJson('```json\n[{"x":1}]\n```')).toEqual([{ x: 1 }]));
  it('extracts JSON embedded in prose', () => expect(extractJson('Ось: [1,2,3] кінець')).toEqual([1, 2, 3]));
  it('returns null on non-JSON', () => expect(extractJson('нічого тут немає')).toBeNull());
});

describe('clusterIdeas', () => {
  it('falls back to samples without an API key', async () => {
    expect(await clusterIdeas(msgs, { key: '' })).toEqual(SAMPLE_CLUSTERS);
  });
  it('parses a valid AI response', async () => {
    const content = '[{"cat":"str","title":"Команда","emoji":"⭐","percentage":50}]';
    const r = await clusterIdeas(msgs, { key: 'k', fetchImpl: fakeFetch(content) });
    expect(r[0]).toMatchObject({ cat: 'str', title: 'Команда', percentage: 50 });
  });
  it('falls back on a malformed response', async () => {
    const r = await clusterIdeas(msgs, { key: 'k', fetchImpl: fakeFetch('garbage') });
    expect(r).toEqual(SAMPLE_CLUSTERS);
  });
});

describe('finalAnalysis', () => {
  it('falls back to the sample report without a key', async () => {
    const r = await finalAnalysis(clusters, { key: '' });
    expect(r.priorities).toHaveLength(3);
    expect(r.map.str.length).toBeGreaterThan(0);
  });
  it('parses a valid finale response', async () => {
    const content = JSON.stringify({
      map: { str: [{ title: 'A', emoji: '⭐', percentage: 40 }], wek: [], opp: [], thr: [] },
      priorities: ['p1', 'p2', 'p3'],
      conclusion: 'Готово',
    });
    const r = await finalAnalysis(clusters, { key: 'k', fetchImpl: fakeFetch(content) });
    expect(r.conclusion).toBe('Готово');
    expect(r.map.str[0].title).toBe('A');
  });
});

describe('prompts', () => {
  it('cluster prompt asks for the JSON shape and includes messages', () => {
    const p = clusterPrompt(msgs);
    expect(p).toContain('percentage');
    expect(p).toContain('Сильна команда');
  });
  it('final prompt asks for SWOT priorities + conclusion', () => {
    const p = finalPrompt(clusters);
    expect(p).toContain('priorities');
    expect(p).toContain('conclusion');
  });
});
