import { render } from '@testing-library/react';
import { Constellation } from './Constellation';

describe('Constellation', () => {
  it('renders nothing for fewer than 2 points', () => {
    const { container } = render(<Constellation points={[{ x: 0, y: 0 }]} glow="1,2,3" />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('draws a path and a node per point', () => {
    const { container } = render(<Constellation points={[{ x: 0, y: 0 }, { x: 10, y: 20 }]} glow="1,2,3" />);
    expect(container.querySelector('path')?.getAttribute('d')).toBe('M0 0 L10 20');
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });
});
