import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('submits username and password', async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn().mockResolvedValue(undefined);

    render(<LoginForm onLogin={onLogin} error="" />);

    await user.clear(screen.getByLabelText(/Usuario/i));
    await user.type(screen.getByLabelText(/Usuario/i), 'operador');
    await user.clear(screen.getByLabelText(/Contrasena/i));
    await user.type(screen.getByLabelText(/Contrasena/i), 'Admin123!');
    await user.click(screen.getByRole('button', { name: /Entrar/i }));

    expect(onLogin).toHaveBeenCalledWith('operador', 'Admin123!');
  });
});
