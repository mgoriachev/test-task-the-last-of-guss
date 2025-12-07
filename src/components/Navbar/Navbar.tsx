import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import './Navbar.css';

export const Navbar = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/profile" className="navbar-logo">
            Игровая платформа
          </Link>
        </div>
        
        <div className="navbar-menu">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link 
                to="/profile" 
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                Профиль
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/play" 
                className={`nav-link ${location.pathname.startsWith('/play') || location.pathname.startsWith('/round') ? 'active' : ''}`}
              >
                Раунды
              </Link>
            </li>
          </ul>
          
          <div className="navbar-user">
            <span className="username">{user.username}</span>
            <span className={`role role-${user.role.toLowerCase()}`}>
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};