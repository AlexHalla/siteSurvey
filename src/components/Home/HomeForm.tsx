import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Home.module.css';
import { User, NewsItem, FeedItem } from '../../types';

const HomeForm: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [news] = useState<NewsItem[]>([
    {
      id: 1,
      title: 'Новый курс по психологии общения',
      date: '2025-10-25',
      excerpt: 'Открыт набор на новый курс по развитию коммуникативных навыков'
    },
    {
      id: 2,
      title: 'Конференция по когнитивной психологии',
      date: '2025-10-20',
      excerpt: 'Приглашаем всех желающих на ежегодную конференцию 15 ноября'
    },
    {
      id: 3,
      title: 'Обновление мобильного приложения',
      date: '2025-10-15',
      excerpt: 'Вышло важное обновление с новыми функциями и улучшениями'
    }
  ]);

  const [feedItems] = useState<FeedItem[]>([
    {
      id: 1,
      type: 'article',
      title: 'Как улучшить память',
      author: 'Др. Иванов',
      date: '2025-10-28',
      image: '/assets/article.png'
    },
    {
      id: 2,
      type: 'event',
      title: 'Вебинар по управлению стрессом',
      date: '2025-11-05',
      time: '18:00',
      image: '/assets/article.png'
    },
    {
      id: 3,
      type: 'image',
      title: 'Инфографика: Типы личности',
      date: '2025-10-27',
      image: '/assets/article.png'
    },
    {
      id: 4,
      type: 'article',
      title: 'Психология сна',
      author: 'Др. Петрова',
      date: '2025-10-26',
      image: '/assets/article.png'
    }
  ]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleFeedItemClick = (item: FeedItem) => {
    const articleIdMap: Record<number, string> = {
      1: '4',
      2: '5',
      3: '6',
      4: '7'
    };
    
    const articleId = articleIdMap[item.id] || '4';
    navigate(`/articles?id=${articleId}&type=${item.type}`);
  };

  // Handle click on news item - navigate to articles page with the selected news
  const handleNewsItemClick = (newsItem: NewsItem) => {
    // Map news item ID to article ID (in a real app, this would be handled by a database)
    const articleIdMap: Record<number, string> = {
      1: '8',
      2: '9',
      3: '10'
    };
    
    const articleId = articleIdMap[newsItem.id] || '8';
    navigate(`/articles?id=${articleId}&type=news`);
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.leftColumn}>
        {/* User/Auth Block */}
        <div className={styles.userBlock}>
          {isAuthenticated ? (
            <div className={styles.userCard}>
              <div className={styles.avatarContainer}>
                <div 
                  className={styles.avatar}
                  style={{ 
                    backgroundImage: user?.avatar ? `url(${user.avatar})` : 'linear-gradient(135deg, #7b2cbf, #9d4edd)'
                  }}
                >
                  {!user?.avatar && (
                    <span className={styles.avatarInitials}>
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.username}>{user?.username || 'Пользователь'}</h3>
                <div className={styles.achievements}>
                  <span className={styles.achievementBadge}>🏆 5</span>
                  <span className={styles.achievementBadge}>⭐ 12</span>
                  <span className={styles.achievementBadge}>🏅 3</span>
                </div>
                <button 
                  className={styles.profileButton}
                  onClick={handleProfileClick}
                >
                  Перейти в профиль
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.authCard}>
              <h3>Войдите в систему</h3>
              <p>Чтобы получить доступ ко всем возможностям сайта</p>
              <button 
                className={styles.loginButton}
                onClick={handleLoginClick}
              >
                Войти
              </button>
            </div>
          )}
        </div>

        {/* News Block */}
        <div className={styles.newsBlock}>
          <h2>Новости</h2>
          <div className={styles.newsList}>
            {news.map((item) => (
              <div 
                key={item.id} 
                className={styles.newsItem}
                onClick={() => handleNewsItemClick(item)}
              >
                <div className={styles.newsDate}>{item.date}</div>
                <h3 className={styles.newsTitle}>{item.title}</h3>
                <p className={styles.newsExcerpt}>{item.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feed Block */}
      <div className={styles.rightColumn}>
        <div className={styles.feedBlock}>
          <h2>Лента</h2>
          <div className={styles.feedList}>
            {feedItems.map((item) => (
              <div 
                key={item.id} 
                className={styles.feedItem}
                onClick={() => handleFeedItemClick(item)}
              >
                <div className={styles.feedImageContainer}>
                  {item.image && item.image !== '/assets/article1.jpg' && item.image !== '/assets/event1.jpg' && item.image !== '/assets/image1.jpg' && item.image !== '/assets/article2.jpg' ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className={styles.feedImage}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        const target = e.target as HTMLImageElement;
                        // Set a solid color background as fallback
                        target.style.backgroundColor = '#7b2cbf';
                        target.style.display = 'flex';
                        target.style.alignItems = 'center';
                        target.style.justifyContent = 'center';
                        target.style.color = 'white';
                        target.style.fontWeight = 'bold';
                        target.style.objectFit = 'cover';
                        // Add text based on type
                        target.textContent = item.type === 'article' ? 'A' : item.type === 'event' ? 'E' : 'I';
                      }}
                    />
                  ) : (
                    <div 
                      className={styles.feedImage}
                      style={{
                        backgroundColor: '#7b2cbf',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        objectFit: 'cover'
                      }}
                    >
                      {item.type === 'article' ? 'A' : item.type === 'event' ? 'E' : 'I'}
                    </div>
                  )}
                </div>
                <div className={styles.feedContent}>
                  <span className={`${styles.feedType} ${styles[item.type]}`}>
                    {item.type === 'article' ? 'Статья' : item.type === 'event' ? 'Событие' : 'Изображение'}
                  </span>
                  <h3 className={styles.feedTitle}>{item.title}</h3>
                  {item.author && <p className={styles.feedAuthor}>Автор: {item.author}</p>}
                  <div className={styles.feedMeta}>
                    <span className={styles.feedDate}>{item.date}</span>
                    {item.time && <span className={styles.feedTime}>{item.time}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeForm;