import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';
import { User } from '../../types';

interface HeaderProps {
  // Add any props if needed in the future
}

const Header: React.FC<HeaderProps> = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleArticlesClick = () => {
    if (isAuthenticated) {
      navigate('/articles');
    } else {
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
  };

  const handleTestsClick = () => {
    if (isAuthenticated) {
      navigate('/tests');
    } else {
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link to="/" onClick={(e) => { e.preventDefault(); handleHomeClick(); }}>
            Психолино
          </Link>
        </div>
        
        {/* Desktop Navigation - hidden on mobile */}
        <ul className={styles.navList}>
          <li>
            <Link to="/" className={styles.navLink} onClick={(e) => { e.preventDefault(); handleHomeClick(); }}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/articles" className={styles.navLink} onClick={(e) => { e.preventDefault(); handleArticlesClick(); }}>
              Статьи
            </Link>
          </li>
          <li>
            <Link to="/tests" className={styles.navLink} onClick={(e) => { e.preventDefault(); handleTestsClick(); }}>
              Тесты
            </Link>
          </li>
        </ul>
        
        <div className={`${styles.auth} ${isMobileMenuOpen ? styles.hidden : ''}`}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button onClick={handleProfileClick} className={styles.profileButton}>
                👤 Профиль
              </button>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Выйти
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginButton} onClick={closeMobileMenu}>
              Войти
            </Link>
          )}
        </div>
        
        {/* Mobile menu button - only visible on mobile */}
        <button 
          className={styles.mobileMenuButton} 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>
      
      {/* Mobile Navigation - controlled by CSS class */}
      <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`}>
        <button 
          onClick={closeMobileMenu}
          className={styles.closeButton}
          aria-label="Close mobile menu"
        >
          ✕
        </button>
        <ul className={styles.mobileNavList}>
          <li className={styles.mobileNavItem}>
            <Link 
              to="/" 
              className={styles.mobileNavLink}
              onClick={(e) => { e.preventDefault(); handleHomeClick(); }}
            >
              Главная
            </Link>
          </li>
          <li className={styles.mobileNavItem}>
            <Link 
              to="/articles" 
              className={styles.mobileNavLink}
              onClick={(e) => { e.preventDefault(); handleArticlesClick(); }}
            >
              Статьи
            </Link>
          </li>
          <li className={styles.mobileNavItem}>
            <Link 
              to="/tests" 
              className={styles.mobileNavLink}
              onClick={(e) => { e.preventDefault(); handleTestsClick(); }}
            >
              Тесты
            </Link>
          </li>
          {!isAuthenticated && (
            <li className={styles.mobileNavItem}>
              <Link 
                to="/login" 
                className={styles.mobileNavLink}
                onClick={(e) => { e.preventDefault(); navigate('/login'); closeMobileMenu(); }}
              >
                Войти
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <>
              <li className={styles.mobileNavItem}>
                <button 
                  onClick={() => { handleProfileClick(); }}
                  className={styles.mobileNavButton}
                >
                  👤 Профиль
                </button>
              </li>
              <li className={styles.mobileNavItem}>
                <button 
                  onClick={() => { handleLogout(); }}
                  className={styles.mobileNavButton}
                >
                  Выйти
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;