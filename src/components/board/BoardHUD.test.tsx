import { render, screen } from '@testing-library/react';
import { BoardHUD } from './BoardHUD';

describe('BoardHUD', () => {
  it('shows the collecting phase label and count', () => {
    const { container } = render(<BoardHUD phase="collecting" count={12} cycle={1} />);
    expect(screen.getByText('Фаза накопичення')).toBeInTheDocument();
    expect(container.textContent).toContain('12');
    expect(container.textContent).toContain('ідей у потоці');
  });

  it('shows the critical label and cycle marker', () => {
    render(<BoardHUD phase="critical" count={40} cycle={2} />);
    expect(screen.getByText('Критична маса')).toBeInTheDocument();
    expect(screen.getByText(/цикл 2/)).toBeInTheDocument();
  });
});
