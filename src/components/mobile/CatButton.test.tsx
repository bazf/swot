import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CatButton } from './CatButton';

describe('CatButton', () => {
  it('fires onClick and reflects the active state', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<CatButton cat="str" active={false} onClick={onClick} />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<CatButton cat="str" active onClick={onClick} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('✓')).toBeInTheDocument();
  });
});
