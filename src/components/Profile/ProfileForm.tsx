import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import styles from './Profile.module.css';
import { User } from '../../types';

interface ProfileFormProps {
  user: User;
}

interface Session {
  id: string;
  device_id?: string | null;
  device_label?: string | null;
  user_agent: string;
}

interface Profile {
  display_name: string;
}

interface Section {
  id: string;
  title: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const { getProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const savedBackground = localStorage.getItem('profileBackground');
    if (savedBackground) {
      setSelectedBackground(savedBackground);
    }
  }, []);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const profileData: any = await getProfile();
        if (profileData.sessions) {
          const allSessions = profileData.sessions.sessions || profileData.sessions || [];
          setSessions(allSessions);

          const profile = profileData.profile;
          setProfile(profile);
          console.log(profile);

          const userProfile = localStorage.getItem('userProfile');
          if (userProfile) {
            const parsedProfile = JSON.parse(userProfile);
            setCurrentSessionId(parsedProfile.current_session_id || '');
          }
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    };

    loadSessions();
  }, [getProfile]);

  const sections: Section[] = [
    { id: 'personalization', title: 'Персонализация' },
    { id: 'statistics', title: 'Статистика' },
    { id: 'achievements', title: 'Достижения' },
    { id: 'history', title: 'История' },
    { id: 'sessions', title: 'Активные сессии' }
  ];

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setAvatar(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAvatarMenuOpen(!isAvatarMenuOpen);
  };

  const handleUploadPhoto = () => {
    setIsAvatarMenuOpen(false);
    handleAvatarClick();
  };

  const handleGenerateAvatar = () => {
    setIsAvatarMenuOpen(false);
    console.log('Generate avatar functionality will be implemented later');
  };

  const handleBackgroundSelect = (background: string) => {
    setSelectedBackground(background);
    window.dispatchEvent(new CustomEvent('backgroundChange', { detail: background }));
    localStorage.setItem('profileBackground', background);
  };

  const handleSave = () => {
    console.log('Profile data saved');
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessionToRevoke(sessionId);
    setShowConfirmDialog(true);
  };

  const confirmRevokeSession = async () => {
    if (!sessionToRevoke) return;
    
    try {
      const success = await apiService.revokeSpecificSession(sessionToRevoke);
      if (success) {
        // Remove session from local state
        setSessions(prevSessions => 
          prevSessions.filter(session => session.id !== sessionToRevoke)
        );
      }
    } catch (error) {
      console.error('Error revoking session:', error);
      alert('Ошибка при завершении сессии');
    }
    
    setShowConfirmDialog(false);
    setSessionToRevoke(null);
  };

  const cancelRevokeSession = () => {
    setShowConfirmDialog(false);
    setSessionToRevoke(null);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (isAvatarMenuOpen) {
        setIsAvatarMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isAvatarMenuOpen]);

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'personalization':
        return (
          <div>
            <h2 className={styles.panelHeader}>Персонализация</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Дата рождения:
              </label>
              <input 
                type="date" 
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Статус:
              </label>
              <input 
                type="text" 
                placeholder="Введите ваш статус"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                О себе:
              </label>
              <textarea 
                placeholder="Расскажите немного о себе"
                rows={4}
                className={styles.formTextarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Фон профиля:
              </label>
              <div className={styles.backgroundSelection}>
                <div 
                  className={`${styles.backgroundOption} ${selectedBackground === '/assets/background.png' ? styles.selected : ''}`}
                  style={{ 
                    backgroundImage: 'url(/assets/background.png)'
                  }}
                  onClick={() => handleBackgroundSelect('/assets/background.png')}
                />
                <div 
                  className={`${styles.backgroundOption} ${selectedBackground === '/assets/login_background.png' ? styles.selected : ''}`}
                  style={{ 
                    backgroundImage: 'url(/assets/login_background.png)'
                  }}
                  onClick={() => handleBackgroundSelect('/assets/login_background.png')}
                />

              </div>
            </div>
            <button className={styles.saveButton} onClick={handleSave}>
              Сохранить
            </button>
          </div>
        );
      case 'statistics':
        return (
          <div>
            <h2 className={styles.panelHeader}>Статистика</h2>
            <p>Здесь будет статистика пользователя.</p>
          </div>
        );
      case 'achievements':
        return (
          <div>
            <h2 className={styles.panelHeader}>Достижения</h2>
            <p>Здесь будут достижения пользователя.</p>
          </div>
        );
      case 'history':
        return (
          <div>
            <h2 className={styles.panelHeader}>История</h2>
            <p>Здесь будет история активности пользователя.</p>
          </div>
        );
      case 'sessions':
        const otherSessions = sessions.filter(session => session.id !== currentSessionId);
        
        return (
          <div>
            <h2 className={styles.panelHeader}>Активные сессии</h2>
            <div className={styles.formGroup}>
              <h3 className={styles.sessionSectionTitle}>Текущая сессия</h3>
              <div className={styles.sessionItem}>
                <div className={styles.sessionDeviceInfo}>
                  <p className={styles.sessionDeviceName}>Это устройство</p>
                  <p className={styles.sessionDeviceDetails}>
                    {navigator.userAgent.includes('Mobile') ? 'Мобильное устройство' : 'Компьютер'} • {new Date().toLocaleString()}
                  </p>
                </div>
                <div className={styles.sessionActions}>
                  <button 
                    className={`${styles.saveButton} ${styles.sessionActionButton}`}
                    onClick={() => alert('Вы уверены, что хотите завершить эту сессию?')}
                  >
                    Завершить
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.formGroup}>
              <h3 className={styles.sessionSectionTitle}>Другие сессии</h3>
              {otherSessions.length > 0 ? (
                <div className={styles.sessionList}>
                  {otherSessions.map(session => (
                    <div key={session.id} className={styles.sessionItem}>
                      <div className={styles.sessionDeviceInfo}>
                        <p className={styles.sessionDeviceName}>
                          {session.device_label || session.device_id || 'Неизвестное устройство'}
                        </p>
                        <p className={styles.sessionDeviceDetails}>
                          {session.user_agent}
                        </p>
                      </div>
                      <div className={styles.sessionActions}>
                        <button 
                          className={`${styles.saveButton} ${styles.sessionActionButton}`}
                          onClick={() => handleRevokeSession(session.id)}
                        >
                          Завершить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.sessionNoSessions}>
                  <p>Нет других активных сессий</p>
                </div>
              )}
            </div>
            

          </div>
        );
      default:
        return <div>Выберите раздел</div>;
    }
  };

  return (
    <>
      <div className={styles.profileContainer}>
        {/* Left Panel - Avatar and Username */}
        <div className={styles.leftPanel}>
          <div className={styles.userInfoContainer}>
            <div className={styles.avatarUploadWrapper}>
              <div className={styles.avatarContainer}>
                <div 
                  className={styles.avatar}
                  onClick={handleAvatarClick}
                  style={{ backgroundImage: avatar ? `url(${avatar})` : 'none' }}
                >
                  {!avatar && '👤'}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  accept="image/*"
                />
              </div>
              <div 
                className={styles.avatarUploadIcon}
                onClick={handleAvatarIconClick}
              />
              <div className={`${styles.avatarMenu} ${isAvatarMenuOpen ? styles.open : ''}`}>
                <div 
                  className={styles.avatarMenuItem}
                  onClick={handleUploadPhoto}
                >
                  Загрузить своё фото
                </div>
                <div 
                  className={styles.avatarMenuItem}
                  onClick={handleGenerateAvatar}
                >
                  Сгенерировать аватар
                </div>
              </div>
            </div>
            <div className={styles.username}>
              {profile?.display_name || 'Пользователь'}
            </div>
            {/* Achievements section similar to home page */}
            <div className={styles.achievements}>
              <span className={styles.achievementBadge}>🏆 5</span>
              <span className={styles.achievementBadge}>⭐ 12</span>
              <span className={styles.achievementBadge}>🏅 3</span>
            </div>
          </div>
          <div className={styles.achievementsSection}>
            {/* This section can be used for additional achievements or information */}
            <h3 className={styles.achievementsTitle}>Ваши достижения</h3>
            <p className={styles.achievementsDescription}>
              Продолжайте активно использовать сайт, чтобы получить больше достижений!
            </p>
          </div>
        </div>

        {/* Right Panel - Sections and Content */}
        <div className={styles.rightPanel}>
          <div className={styles.sectionsList}>
            {sections.map((section) => (
              <div
                key={section.id}
                className={`${styles.sectionItem} ${activeSection === section.id ? styles.active : ''}`}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              >
                {section.title}
              </div>
            ))}
          </div>

          {/* For mobile, show content below each button */}
          {isMobile ? (
            <div className={styles.contentPanel}>
              {sections.map((section) => (
                activeSection === section.id && (
                  <div
                    key={section.id}
                    className={`${styles.panelContent} ${activeSection === section.id ? styles.active : ''}`}
                  >
                    {renderSectionContent(section.id)}
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className={styles.contentPanel}>
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`${styles.panelContent} ${activeSection === section.id ? styles.active : ''}`}
                >
                  {renderSectionContent(section.id)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Full-screen Confirmation Dialog */}
      {showConfirmDialog && (
        <div className={styles.confirmDialogOverlay}>
          <div className={styles.confirmDialog}>
            <h3>Подтверждение</h3>
            <p>Вы точно хотите завершить сессию?</p>
            <div className={styles.confirmDialogButtons}>
              <button 
                className={`${styles.saveButton} ${styles.confirmButton}`}
                onClick={confirmRevokeSession}
              >
                Да
              </button>
              <button 
                className={`${styles.saveButton} ${styles.cancelButton}`}
                onClick={cancelRevokeSession}
              >
                Нет
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileForm;