import { useState } from 'react';

export default function LoginForm({ onLogin, error }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123!');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onLogin(username, password);
  };

  return (
    <section className="auth-card">
      <h1>Sistema de Reservas de Estacionamiento</h1>
      <p className="sub-title">Acceso seguro con JWT y permisos por rol</p>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Usuario
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Contrasena
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error ? <p className="error-msg">{error}</p> : null}
        <button type="submit">Entrar</button>
      </form>
    </section>
  );
}
