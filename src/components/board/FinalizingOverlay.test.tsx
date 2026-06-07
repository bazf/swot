import { render, screen } from '@testing-library/react';
import { FinalizingOverlay } from './FinalizingOverlay';

describe('FinalizingOverlay', () => {
  it('announces the synthesis with a prominent heading', () => {
    render(<FinalizingOverlay />);
    expect(screen.getByRole('heading', { name: /Формування зоряної карти/ })).toBeInTheDocument();
    expect(screen.getByText(/рахує голоси/)).toBeInTheDocument();
  });
});
