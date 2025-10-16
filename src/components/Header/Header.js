import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Header.module.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link to="/">Мой Сайт</Link>
        </div>
        <ul className={styles.navList}>
          <li>
            <Link to="/" className={styles.navLink}>Главная</Link>
          </li>
          <li>
            <Link to="/articles" className={styles.navLink}>Статьи</Link>
          </li>
          <li>
            <Link to="/tests" className={styles.navLink}>Тесты</Link>
          </li>
        </ul>
        <div className={styles.auth}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button 
                onClick={handleProfileClick}
                className={styles.profileButton}
              >
                👤 Профиль
              </button>
              <button 
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginButton}>
              Войти
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;