import { render, screen } from '@testing-library/react';
import { Planet } from './Planet';

describe('Planet', () => {
  it('renders the percentage, emoji and title', () => {
    render(<Planet cat="str" title="Команда" emoji="⭐" percentage={42} />);
    expect(screen.getByText('42%')).toBeInTheDocument();
    expect(screen.getByText('⭐')).toBeInTheDocument();
    expect(screen.getByText('Команда')).toBeInTheDocument();
  });

  it('hides the label when showLabel is false', () => {
    render(<Planet cat="opp" title="Прихована" emoji="🪐" percentage={10} showLabel={false} />);
    expect(screen.queryByText('Прихована')).not.toBeInTheDocument();
  });
});
