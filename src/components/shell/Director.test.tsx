import { render, screen } from '@testing-library/react';
import { Director } from './Director';

const noop = () => {};
const base = { count: 0, start: noop, swipe: noop, continueCycle: noop, finish: noop, reset: noop };

describe('Director', () => {
  it('shows the start button on the start phase', () => {
    render(<Director phase="start" {...base} />);
    expect(screen.getByRole('button', { name: /Почати місію/ })).toBeInTheDocument();
  });

  it('shows the swipe action on critical', () => {
    render(<Director phase="critical" {...base} />);
    expect(screen.getByRole('button', { name: /Свайп ядра/ })).toBeInTheDocument();
  });

  it('shows idea-injection controls only in demo mode', () => {
    const { rerender } = render(<Director phase="collecting" demo onAddIdea={noop} onToggleAuto={noop} {...base} />);
    expect(screen.getByRole('button', { name: /Думка/ })).toBeInTheDocument();

    rerender(<Director phase="collecting" {...base} />);
    expect(screen.queryByRole('button', { name: /Думка/ })).not.toBeInTheDocument();
  });
});
