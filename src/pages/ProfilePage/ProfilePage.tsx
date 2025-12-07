import { useAuthStore } from '../../store/auth';
import './ProfilePage.css';

export const ProfilePage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <h1>Ваш профиль</h1>
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="profile-info">
          <div className="info-card">
            <div className="info-label">Имя пользователя</div>
            <div className="info-value">{user?.username}</div>
          </div>
          
          <div className="info-card">
            <div className="info-label">Роль</div>
            <div className={`role-badge role-${user?.role.toLowerCase()}`}>
              {user?.role}
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-label">Статистика</div>
            <div className="stats">
              <div className="stat-item">
                <div className="stat-value">0</div>
                <div className="stat-label">Игр сыграно</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">0</div>
                <div className="stat-label">Побед</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">0</div>
                <div className="stat-label">Рейтинг</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
};