import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Articles.module.css';
import { FeedItem } from '../../types';

// Define types
interface ArticleCategory {
  id: string;
  name: string;
  count: number;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  type: 'article' | 'event' | 'image' | 'news';
  time?: string;
  imageUrl?: string;
}

const ArticleForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get article ID from URL query parameters if present
  const searchParams = new URLSearchParams(location.search);
  const initialArticleId = searchParams.get('id');
  const initialArticleType = searchParams.get('type');

  // Categories including feed item types
  const categories: ArticleCategory[] = [
    { id: 'all', name: 'Все', count: 24 },
    { id: 'article', name: 'Статьи', count: 8 },
    { id: 'event', name: 'События', count: 5 },
    { id: 'image', name: 'Изображения', count: 7 },
    { id: 'news', name: 'Новости', count: 4 },
  ];

  // Mock data for articles and feed items
  const allArticles: Article[] = [
    // Existing articles
    {
      id: '1',
      title: 'Исследование новых технологий в 2025 году',
      excerpt: 'В этом году мы наблюдаем значительный прогресс в области технологий. Новые разработки в области искусственного интеллекта...',
      content: 'В этом году мы наблюдаем значительный прогресс в области технологий. Новые разработки в области искусственного интеллекта и машинного обучения открывают невероятные возможности для человечества.\n\nИсследования показывают, что к 2025 году более 70% компаний будут использовать AI в своих процессах. Это приведет к значительному увеличению производительности и эффективности.\n\nОднако вместе с преимуществами приходят и вызовы. Вопросы конфиденциальности данных и этические аспекты использования AI становятся все более актуальными. Эксперты предупреждают о необходимости разработки четких правил и регулирования в этой сфере.\n\nНовые алгоритмы машинного обучения позволяют компьютерам не только обрабатывать информацию, но и принимать сложные решения, которые раньше были прерогативой человека. Это открывает новые горизонты в медицине, науке и промышленности.',
      date: '25 октября 2025',
      author: 'Александр Петров',
      category: 'Технологии',
      type: 'article',
      imageUrl: 'https://via.placeholder.com/800x400/7b2cbf/ffffff?text=Технологии+2025'
    },
    {
      id: '2',
      title: 'Открытия в области квантовой физики',
      excerpt: 'Недавние открытия в области квантовой физики перевернули наше понимание материи и энергии. Ученые впервые смогли стабилизировать квантовые состояния...',
      content: 'Недавние открытия в области квантовой физики перевернули наше понимание материи и энергии. Ученые впервые смогли стабилизировать квантовые состояния на протяжении нескольких часов.\n\nЭто открытие может привести к революции в вычислительных технологиях. Квантовые компьютеры станут доступны для широкого круга пользователей.\n\nКроме того, новые материалы, созданные на основе квантовых принципов, обладают уникальными свойствами, которые могут изменить строительную индустрию. Эти материалы обладают сверхпроводимостью при комнатной температуре и могут кардинально изменить энергетику.\n\nИсследования продолжаются, и ученые надеются в ближайшие годы создать первые коммерческие образцы квантовых устройств.',
      date: '20 октября 2025',
      author: 'Елена Сидорова',
      category: 'Наука',
      type: 'article',
      imageUrl: 'https://via.placeholder.com/800x400/7b2cbf/ffffff?text=Квантовая+физика'
    },
    {
      id: '3',
      title: 'Культурные тенденции современности',
      excerpt: 'Современные культурные тенденции отражают глобализацию и цифровизацию общества. Виртуальные выставки и онлайн-концерты становятся новой нормой...',
      content: 'Современные культурные тенденции отражают глобализацию и цифровизацию общества. Виртуальные выставки и онлайн-концерты становятся новой нормой.\n\nИскусство все чаще融合 с технологиями, создавая новые формы самовыражения. NFT-арт и цифровые коллекции набирают популярность среди молодежи.\n\nТрадиционные культурные институты адаптируются к новым реалиям, предлагая гибридные форматы взаимодействия с аудиторией. Музеи и театры создают цифровые копии своих экспонатов и спектаклей.\n\nНовая цифровая культура формирует иное восприятие искусства, где зритель становится соавтором произведения, взаимодействуя с ним в виртуальном пространстве.',
      date: '18 октября 2025',
      author: 'Мария Иванова',
      category: 'Культура',
      type: 'article',
      imageUrl: 'https://via.placeholder.com/800x400/7b2cbf/ffffff?text=Культура+2025'
    },
    // Feed items converted to articles
    {
      id: '4',
      title: 'Как улучшить память',
      excerpt: 'Практические советы и упражнения для развития памяти',
      content: 'Развитие памяти - важный аспект когнитивной психологии. Существует множество техник, которые могут помочь улучшить запоминание и воспроизведение информации.\n\nОдним из самых эффективных методов является метод ассоциаций. Связывая новую информацию с уже известной, мы создаем более прочные нейронные связи.\n\nРегулярные упражнения для мозга, такие как решение кроссвордов, игра в шахматы или изучение новых языков, также способствуют улучшению памяти.\n\nВажно также соблюдать режим сна и питания, так как недостаток сна и неправильное питание могут негативно сказаться на когнитивных функциях.',
      date: '2025-10-28',
      author: 'Др. Иванов',
      category: 'Психология',
      type: 'article',
      imageUrl: '/assets/article1.jpg'
    },
    {
      id: '5',
      title: 'Вебинар по управлению стрессом',
      excerpt: 'Практические методы борьбы со стрессом в повседневной жизни',
      content: 'Стресс - неотъемлемая часть современной жизни. Однако важно уметь управлять им, чтобы не допустить негативных последствий для здоровья.\n\nВ рамках вебинара будут рассмотрены следующие темы:\n- Причины возникновения стресса\n- Физиологические и психологические проявления стресса\n- Методы саморегуляции\n- Дыхательные техники\n- Медитация и осознанность\n- Планирование времени и приоритетов\n\nВебинар состоится 5 ноября в 18:00. Регистрация открыта на нашем сайте.',
      date: '2025-11-05',
      author: '',
      category: 'События',
      type: 'event',
      time: '18:00',
      imageUrl: '/assets/event1.jpg'
    },
    {
      id: '6',
      title: 'Инфографика: Типы личности',
      excerpt: 'Визуальное представление основных типов личности по теории Кейрси',
      content: 'Теория Кейрси выделяет 16 типов личности, основанных на четырех дихотомиях:\n\n1. Экстраверсия (Е) vs Интроверсия (I)\n2. Сенсорика (S) vs Интуиция (N)\n3. Мышление (T) vs Чувство (F)\n4. Суждение (J) vs Восприятие (P)\n\nКаждый человек обладает определенным сочетанием этих предпочтений, что формирует его уникальный тип личности. Понимание своего типа помогает лучше понимать себя и других людей.\n\nИнфографика наглядно демонстрирует особенности каждого типа и их взаимодействие.',
      date: '2025-10-27',
      author: '',
      category: 'Психология',
      type: 'image',
      imageUrl: '/assets/image1.jpg'
    },
    {
      id: '7',
      title: 'Психология сна',
      excerpt: 'Как качество сна влияет на психическое здоровье',
      content: 'Сон играет ключевую роль в поддержании психического здоровья. Во время сна мозг обрабатывает информацию, полученную в течение дня, и восстанавливает свои ресурсы.\n\nНедостаток сна может привести к следующим проблемам:\n- Ухудшение концентрации внимания\n- Повышенная раздражительность\n- Снижение когнитивных функций\n- Увеличение риска депрессии и тревожности\n\nДля улучшения качества сна рекомендуется:\n- Соблюдать режим сна\n- Избегать кофеина перед сном\n- Создать комфортную обстановку в спальне\n- Ограничивать использование гаджетов перед сном',
      date: '2025-10-26',
      author: 'Др. Петрова',
      category: 'Психология',
      type: 'article',
      imageUrl: '/assets/article2.jpg'
    },
    // News items converted to articles
    {
      id: '8',
      title: 'Новый курс по психологии общения',
      excerpt: 'Открыт набор на новый курс по развитию коммуникативных навыков',
      content: 'Мы рады объявить о старте нового курса по психологии общения. Курс предназначен для всех, кто хочет улучшить свои коммуникативные навыки и научиться эффективно взаимодействовать с окружающими.\n\nПрограмма курса включает:\n- Основы вербальной и невербальной коммуникации\n- Техники активного слушания\n- Управление конфликтами\n- Эмпатия и эмоциональный интеллект\n- Публичные выступления\n\nКурс начинается 1 декабря. Занятия проходят два раза в неделю по вечерам. Количество мест ограничено.\n\nДля регистрации и получения дополнительной информации посетите наш сайт или свяжитесь с нами по телефону.',
      date: '2025-10-25',
      author: 'Администрация',
      category: 'Новости',
      type: 'news',
      imageUrl: 'https://via.placeholder.com/800x400/7b2cbf/ffffff?text=Курс+психологии'
    },
    {
      id: '9',
      title: 'Конференция по когнитивной психологии',
      excerpt: 'Приглашаем всех желающих на ежегодную конференцию 15 ноября',
      content: 'Ежегодная конференция по когнитивной психологии состоится 15 ноября в конференц-зале нашего института.\n\nТемы конференции:\n- Современные исследования памяти\n- Когнитивные процессы в обучении\n- Нейропсихология и искусственный интеллект\n- Когнитивные нарушения и их коррекция\n- Практическое применение когнитивной психологии\n\nВ рамках конференции пройдут мастер-классы от ведущих специалистов в области когнитивной психологии.\n\nУчастие бесплатное, но требуется предварительная регистрация на сайте.',
      date: '2025-10-20',
      author: 'Оргкомитет',
      category: 'События',
      type: 'news',
      imageUrl: 'https://via.placeholder.com/800x400/7b2cbf/ffffff?text=Конференция'
    },
    {
      id: '10',
      title: 'Обновление мобильного приложения',
      excerpt: 'Вышло важное обновление с новыми функциями и улучшениями',
      content: 'Мы выпустили новое обновление для нашего мобильного приложения, которое включает в себя следующие улучшения:\n\nНовые функции:\n- Дневник настроения с графической статистикой\n- Интеграция с календарем для планирования сессий\n- Возможность обмена достижениями с друзьями\n- Новые медитации и упражнения\n\nУлучшения:\n- Ускорена работа приложения\n- Улучшен интерфейс для лучшей навигации\n- Исправлены ошибки, связанные с уведомлениями\n- Оптимизировано использование батареи\n\nОбновление доступно в App Store и Google Play.',
      date: '2025-10-15',
      author: 'Команда разработки',
      category: 'Новости',
      type: 'news',
      imageUrl: 'https://via.placeholder.com/800x400/7b2cbf/ffffff?text=Обновление+приложения'
    }
  ];

  // State management
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(allArticles);

  // Filter articles based on selected category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredArticles(allArticles);
    } else {
      const filtered = allArticles.filter(article => article.type === activeCategory);
      setFilteredArticles(filtered);
    }
  }, [activeCategory]);

  // Handle category selection
  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Reset article selection when changing categories
    setSelectedArticle(null);
    // Update URL without reloading the page
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('category', categoryId);
    navigate(`/articles?${newSearchParams.toString()}`, { replace: true });
  };

  // Handle article selection
  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    // Update URL to reflect the selected article
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('id', article.id);
    newSearchParams.set('type', article.type);
    navigate(`/articles?${newSearchParams.toString()}`, { replace: true });
  };

  // Handle back to articles list
  const handleBackToList = () => {
    setSelectedArticle(null);
    // Update URL to show the current category
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('category', activeCategory);
    navigate(`/articles?${newSearchParams.toString()}`, { replace: true });
  };

  // Check if we need to select an article based on URL parameters
  useEffect(() => {
    if (initialArticleId && initialArticleType) {
      const article = allArticles.find(a => 
        a.id === initialArticleId && a.type === initialArticleType
      );
      if (article) {
        setSelectedArticle(article);
      }
    } else if (searchParams.get('category')) {
      setActiveCategory(searchParams.get('category') || 'all');
    }
  }, [initialArticleId, initialArticleType]);

  return (
    <div className={styles.container}>
      {/* Sidebar with categories */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Типы контента</h2>
        <ul className={styles.categoryList}>
          {categories.map((category) => (
            <li
              key={category.id}
              className={`${styles.categoryItem} ${
                activeCategory === category.id ? styles.active : ''
              }`}
              onClick={() => handleSelectCategory(category.id)}
            >
              <span className={styles.categoryName}>{category.name}</span>
              <span className={styles.categoryCount}>{category.count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content area */}
      <div className={styles.mainContent}>
        {selectedArticle ? (
          // Article detail view
          <div className={styles.articleDetail}>
            <button className={styles.backButton} onClick={handleBackToList}>
              ← Назад к списку
            </button>
            <div className={styles.detailHeader}>
              <div className={`${styles.detailType} ${styles[selectedArticle.type]}`}>
                {selectedArticle.type === 'article' ? 'Статья' : 
                 selectedArticle.type === 'event' ? 'Событие' : 
                 selectedArticle.type === 'image' ? 'Изображение' : 'Новость'}
              </div>
              <h1 className={styles.detailTitle}>{selectedArticle.title}</h1>
              <div className={styles.detailMeta}>
                {selectedArticle.author && <span>Автор: {selectedArticle.author}</span>}
                <span>Дата: {selectedArticle.date}</span>
                {selectedArticle.time && <span>Время: {selectedArticle.time}</span>}
                <span>Категория: {selectedArticle.category}</span>
              </div>
            </div>
            {selectedArticle.imageUrl && (
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className={styles.detailImage}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement;
                  target.style.backgroundColor = '#7b2cbf';
                  target.style.display = 'flex';
                  target.style.alignItems = 'center';
                  target.style.justifyContent = 'center';
                  target.style.color = 'white';
                  target.style.fontWeight = 'bold';
                  target.textContent = selectedArticle.type === 'article' ? 'A' : 
                                     selectedArticle.type === 'event' ? 'E' : 
                                     selectedArticle.type === 'image' ? 'I' : 'N';
                }}
              />
            )}
            <div className={styles.detailContent}>
              {selectedArticle.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        ) : (
          // Articles list view
          <div className={styles.articlesList}>
            <h2 className={styles.listTitle}>
              {categories.find(cat => cat.id === activeCategory)?.name || 'Все'}
            </h2>
            <div className={styles.articlesGrid}>
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className={styles.articleCard}
                  onClick={() => handleSelectArticle(article)}
                >
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className={styles.articleImage}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        const target = e.target as HTMLImageElement;
                        target.style.backgroundColor = '#7b2cbf';
                        target.style.display = 'flex';
                        target.style.alignItems = 'center';
                        target.style.justifyContent = 'center';
                        target.style.color = 'white';
                        target.style.fontWeight = 'bold';
                        target.textContent = article.type === 'article' ? 'A' : 
                                           article.type === 'event' ? 'E' : 
                                           article.type === 'image' ? 'I' : 'N';
                      }}
                    />
                  )}
                  <div className={styles.articleContent}>
                    <div className={`${styles.articleType} ${styles[article.type]}`}>
                      {article.type === 'article' ? 'Статья' : 
                       article.type === 'event' ? 'Событие' : 
                       article.type === 'image' ? 'Изображение' : 'Новость'}
                    </div>
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                    <p className={styles.articleExcerpt}>{article.excerpt}</p>
                    <div className={styles.articleMeta}>
                      {article.author && <span>{article.author}</span>}
                      <span>{article.date}</span>
                      {article.time && <span>{article.time}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleForm;