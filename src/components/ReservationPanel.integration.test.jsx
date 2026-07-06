import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ReservationPanel from './ReservationPanel';

const listMock = vi.fn();
const createMock = vi.fn();
const updateMock = vi.fn();
const removeMock = vi.fn();

vi.mock('../api/client', () => ({
  reservationsApi: {
    list: (...args) => listMock(...args),
    create: (...args) => createMock(...args),
    update: (...args) => updateMock(...args),
    remove: (...args) => removeMock(...args)
  }
}));

vi.mock('../hooks/useReservationsSocket', () => ({
  useReservationsSocket: () => {}
}));

describe('ReservationPanel integration', () => {
  beforeEach(() => {
    listMock.mockResolvedValue({ data: [] });
    createMock.mockResolvedValue({});
    updateMock.mockResolvedValue({});
    removeMock.mockResolvedValue({});
  });

  it('loads list and creates a reservation from form', async () => {
    const user = userEvent.setup();

    render(
      <ReservationPanel
        session={{ username: 'admin', role: 'ADMIN' }}
        onLogout={() => {}}
      />
    );

    await waitFor(() => expect(listMock).toHaveBeenCalled());

    await user.type(screen.getByLabelText(/Espacio/i), 'A-12');
    await user.type(screen.getByLabelText(/Inicio/i), '2026-07-04T09:00');
    await user.type(screen.getByLabelText(/Fin/i), '2026-07-04T10:00');
    await user.type(screen.getByLabelText(/Notas/i), 'Prueba CRUD');
    await user.click(screen.getByRole('button', { name: /Crear/i }));

    await waitFor(() => expect(createMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(listMock).toHaveBeenCalledTimes(2));
  });
});
