import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputForm } from './InputForm';

describe('InputForm', () => {
  it('enables submit after typing, then submits (no category) and clears', async () => {
    const onSubmit = vi.fn();
    render(<InputForm onSubmit={onSubmit} />);

    const submit = screen.getByRole('button', { name: /Запустити в космос/ });
    expect(submit).toBeDisabled();

    const textarea = screen.getByLabelText('Ваша думка');
    await userEvent.type(textarea, 'Сильна команда');
    expect(submit).toBeEnabled();

    await userEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith('Сильна команда');
    expect(textarea).toHaveValue('');
    expect(screen.getByText(/надіслано: 1/)).toBeInTheDocument();
  });

  it('offers suggestions on demand and fills the box when one is tapped', async () => {
    render(<InputForm />);
    await userEvent.click(screen.getByRole('button', { name: /Запропонувати думку/ }));

    const chips = screen.getAllByRole('button').filter((b) => b.textContent?.startsWith('✦'));
    expect(chips.length).toBeGreaterThan(0);

    await userEvent.click(chips[0]);
    const textarea = screen.getByLabelText('Ваша думка') as HTMLTextAreaElement;
    expect(textarea.value.length).toBeGreaterThan(0);
  });
});
