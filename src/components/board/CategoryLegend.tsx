/* CategoryLegend — the 4 SWOT categories with name + hint. */

import { CATS, CAT_ORDER } from '../../data/catalog';
import { CategoryOrb } from '../cosmos';

export function CategoryLegend({ compact }: { compact?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: compact ? 14 : 22, flexWrap: 'wrap', justifyContent: 'center' }}>
      {CAT_ORDER.map((k) => {
        const c = CATS[k];
        return (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CategoryOrb cat={k} size={38} fontSize={18} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>{c.planet}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{c.hint}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
