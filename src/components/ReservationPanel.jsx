import { useCallback, useEffect, useMemo, useState } from 'react';
import { reservationsApi } from '../api/client';
import { useReservationsSocket } from '../hooks/useReservationsSocket';

const initialForm = {
  parkingSpot: '',
  startTime: '',
  endTime: '',
  notes: ''
};

function localDateTimeValue(value) {
  if (!value) return '';
  const date = new Date(value);
  const pad = (n) => `${n}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function ReservationPanel({ session, onLogout }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const isAdmin = session.role === 'ADMIN';

  const fetchReservations = useCallback(async () => {
    const { data } = await reservationsApi.list();
    setItems(data);
  }, []);

  useEffect(() => {
    fetchReservations().catch(() => setError('No se pudo cargar la lista de reservaciones'));
  }, [fetchReservations]);

  useReservationsSocket(
    (reservation) => {
      setItems((prev) => {
        const exists = prev.some((p) => p.id === reservation.id);
        if (exists) {
          return prev.map((p) => (p.id === reservation.id ? reservation : p));
        }
        return [...prev, reservation].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      });
    },
    (deletedId) => {
      setItems((prev) => prev.filter((p) => p.id !== deletedId));
    }
  );

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const payload = {
      ...form,
      parkingSpot: form.parkingSpot.toUpperCase(),
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString()
    };

    try {
      if (editingId) {
        await reservationsApi.update(editingId, payload);
      } else {
        await reservationsApi.create(payload);
      }
      setForm(initialForm);
      setEditingId(null);
      await fetchReservations();
    } catch (e) {
      setError(e?.response?.data?.message || 'No fue posible guardar la reservacion');
    }
  };

  const remove = async (id) => {
    try {
      await reservationsApi.remove(id);
      await fetchReservations();
    } catch (e) {
      setError(e?.response?.data?.message || 'No fue posible eliminar la reservacion');
    }
  };

  const canEdit = useMemo(
    () => (reservation) => isAdmin || reservation.username === session.username,
    [isAdmin, session.username]
  );

  return (
    <main className="dashboard">
      <header className="header">
        <div>
          <h2>Panel de Reservaciones</h2>
          <p>
            Usuario: <strong>{session.username}</strong> | Rol: <strong>{session.role}</strong> | TZ: America/Mexico_City
          </p>
        </div>
        <button className="outline" onClick={onLogout}>Salir</button>
      </header>

      <section className="card">
        <h3>{editingId ? 'Editar reservacion' : 'Nueva reservacion'}</h3>
        <form onSubmit={submit} className="form-grid two-col">
          <label>
            Espacio
            <input
              value={form.parkingSpot}
              onChange={(e) => setForm((p) => ({ ...p, parkingSpot: e.target.value }))}
              placeholder="A-01"
              required
            />
          </label>
          <label>
            Inicio
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
              required
            />
          </label>
          <label>
            Fin
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
              required
            />
          </label>
          <label>
            Notas
            <input
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </label>
          {error ? <p className="error-msg">{error}</p> : null}
          <div className="actions">
            <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
            {editingId ? (
              <button
                type="button"
                className="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="card">
        <h3>Reservaciones</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Espacio</th>
                <th>Inicio (MX)</th>
                <th>Fin (MX)</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.username}</td>
                  <td>{r.parkingSpot}</td>
                  <td>{new Date(r.startTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</td>
                  <td>{new Date(r.endTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</td>
                  <td>{r.notes}</td>
                  <td>
                    {canEdit(r) ? (
                      <div className="row-actions">
                        <button
                          type="button"
                          className="small"
                          onClick={() => {
                            setEditingId(r.id);
                            setForm({
                              parkingSpot: r.parkingSpot,
                              startTime: localDateTimeValue(r.startTime),
                              endTime: localDateTimeValue(r.endTime),
                              notes: r.notes || ''
                            });
                          }}
                        >
                          Editar
                        </button>
                        <button type="button" className="small danger" onClick={() => remove(r.id)}>
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <span className="hint">Sin permiso</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
