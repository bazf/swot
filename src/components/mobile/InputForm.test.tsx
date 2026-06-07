import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputForm } from './InputForm';

describe('InputForm', () => {
  it('enables submit only after a category + text, then submits and clears', async () => {
    const onSubmit = vi.fn();
    render(<InputForm onSubmit={onSubmit} />);

    const submit = screen.getByRole('button', { name: /Запустити в космос/ });
    expect(submit).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: /Зірки/ }));
    const textarea = screen.getByLabelText('Ваша думка');
    await userEvent.type(textarea, 'Сильна команда');
    expect(submit).toBeEnabled();

    await userEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith('str', 'Сильна команда');
    expect(textarea).toHaveValue('');
    expect(screen.getByText(/надіслано: 1/)).toBeInTheDocument();
  });
});
