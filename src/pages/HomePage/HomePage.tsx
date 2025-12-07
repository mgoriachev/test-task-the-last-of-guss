import { useAuthStore } from '../../store/auth';
import './HomePage.css';

export const HomePage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Добро пожаловать, {user?.username}!</h1>
        <p>Ваша роль: <strong>{user?.role}</strong></p>
        
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};