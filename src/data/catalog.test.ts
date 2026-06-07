import { CATS, CAT_ORDER, FINAL_REPORT, SAMPLE_CLUSTERS, STAR_MAP, THRESHOLD } from './catalog';

describe('catalog', () => {
  it('defines exactly the 4 SWOT categories in order', () => {
    expect(CAT_ORDER).toEqual(['str', 'wek', 'opp', 'thr']);
    CAT_ORDER.forEach((k) => {
      expect(CATS[k].key).toBe(k);
      expect(CATS[k].emoji).toBeTruthy();
      expect(CATS[k].glow).toMatch(/^\d+,\d+,\d+$/);
    });
  });

  it('STAR_MAP is keyed by category with valid percentages', () => {
    CAT_ORDER.forEach((k) => {
      expect(STAR_MAP[k].length).toBeGreaterThan(0);
      STAR_MAP[k].forEach((p) => {
        expect(p.percentage).toBeGreaterThanOrEqual(0);
        expect(p.percentage).toBeLessThanOrEqual(100);
      });
    });
  });

  it('THRESHOLD is 50', () => expect(THRESHOLD).toBe(50));

  it('FINAL_REPORT has priorities, recommendations, summary and a conclusion', () => {
    expect(FINAL_REPORT.priorities).toHaveLength(3);
    expect(FINAL_REPORT.conclusion.length).toBeGreaterThan(0);
    expect(FINAL_REPORT.recommendations?.length).toBeGreaterThan(0);
    expect((FINAL_REPORT.summary ?? '').length).toBeGreaterThan(0);
  });

  it('sample clusters reference valid categories', () => {
    SAMPLE_CLUSTERS.forEach((c) => expect(CAT_ORDER).toContain(c.cat));
  });
});
