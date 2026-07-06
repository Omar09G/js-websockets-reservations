import LoginForm from './components/LoginForm';
import ReservationPanel from './components/ReservationPanel';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { session, login, logout, error } = useAuth();

  if (!session) {
    return (
      <div className="screen auth-bg">
        <LoginForm onLogin={login} error={error} />
      </div>
    );
  }

  return (
    <div className="screen app-bg">
      <ReservationPanel session={session} onLogout={logout} />
    </div>
  );
}
