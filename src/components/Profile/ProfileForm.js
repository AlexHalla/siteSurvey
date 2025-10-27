import React, { useState, useRef } from 'react';
import styles from './Profile.module.css';

const ProfileForm = ({ user }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Load saved background from localStorage on component mount
  React.useEffect(() => {
    const savedBackground = localStorage.getItem('profileBackground');
    if (savedBackground) {
      setSelectedBackground(savedBackground);
    }
  }, []);

  const sections = [
    { id: 'personalization', title: 'Персонализация' },
    { id: 'statistics', title: 'Статистика' },
    { id: 'achievements', title: 'Достижения' },
    { id: 'history', title: 'История' }
  ];

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarIconClick = (e) => {
    e.stopPropagation();
    setIsAvatarMenuOpen(!isAvatarMenuOpen);
  };

  const handleUploadPhoto = () => {
    setIsAvatarMenuOpen(false);
    handleAvatarClick();
  };

  const handleGenerateAvatar = () => {
    setIsAvatarMenuOpen(false);
    // Placeholder for avatar generation functionality
    console.log('Generate avatar functionality will be implemented later');
  };

  const handleBackgroundSelect = (background) => {
    setSelectedBackground(background);
    // Change background immediately without requiring save
    window.dispatchEvent(new CustomEvent('backgroundChange', { detail: background }));
    // Also save to localStorage immediately
    localStorage.setItem('profileBackground', background);
  };

  const handleSave = () => {
    // Save other form data here if needed
    console.log('Profile data saved');
  };

  // Close avatar menu when clicking outside
  React.useEffect(() => {
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

  const renderSectionContent = (sectionId) => {
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
                rows="4"
                className={styles.formTextarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Фон профиля:
              </label>
              <div className={styles.backgroundSelection}>
                <div 
                  className={`${styles.backgroundOption} ${selectedBackground === 'background.png' ? styles.selected : ''}`}
                  style={{ 
                    backgroundImage: 'url(/assets/background.png)'
                  }}
                  onClick={() => handleBackgroundSelect('background.png')}
                />
                <div 
                  className={`${styles.backgroundOption} ${selectedBackground === 'login_background.png' ? styles.selected : ''}`}
                  style={{ 
                    backgroundImage: 'url(/assets/login_background.png)'
                  }}
                  onClick={() => handleBackgroundSelect('login_background.png')}
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
      default:
        return <div>Выберите раздел</div>;
    }
  };

  return (
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
            {user?.username || 'Пользователь'}
          </div>
        </div>
        <div className={styles.achievementsSection}>
          {/* Achievements will be displayed here in the future */}
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
      </div>
    </div>
  );
};

export default ProfileForm;