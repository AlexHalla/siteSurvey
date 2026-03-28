import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Test.module.css';
import apiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { canCreateSurvey } from '../../utils/roles';

// Define types
interface TestTopic {
  id: string;
  name: string;
  count: number;
}

interface Survey {
  _id: string;
  name: string;
  description: string;
  author: string;
  visible?: boolean;
  questionsCount?: number;
}

const TestForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCreate = canCreateSurvey(user);
  
  // Topics data
  const topics: TestTopic[] = [
    { id: 'all', name: 'Все тесты', count: 0 },
    { id: 'new', name: 'Новые', count: 0 },
    { id: 'popular', name: 'Популярные', count: 0 },
    { id: 'psychology', name: 'Психология', count: 0 },
    { id: 'personality', name: 'Тип личности', count: 0 },
    { id: 'intelligence', name: 'Интеллект', count: 0 },
    { id: 'career', name: 'Профориентация', count: 0 },
  ];

  // State management
  const [activeTopic, setActiveTopic] = useState<string>('all');
  const [tests, setTests] = useState<Survey[]>([]);
  const [filteredTests, setFilteredTests] = useState<Survey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load tests from API
  useEffect(() => {
    const loadTests = async () => {
      try {
        setLoading(true);
        // Fetch surveys from the backend API
        const surveys = await apiService.getSurveys();
        const visibleSurveys = (surveys as Survey[]).filter((survey) => survey.visible !== false);
        
        setTests(visibleSurveys);
        setFilteredTests(visibleSurveys);
      } catch (err) {
        setError('Не удалось загрузить тесты');
        console.error('Error loading tests:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  // Filter tests based on selected topic
  useEffect(() => {
    if (activeTopic === 'all') {
      setFilteredTests(tests);
    } else if (activeTopic === 'new') {
      // For demo purposes, show first 3 tests as "new"
      setFilteredTests(tests.slice(0, 3));
    } else if (activeTopic === 'popular') {
      // For demo purposes, show last 3 tests as "popular"
      setFilteredTests(tests.slice(-3));
    } else {
      // For other topics, show all tests (in a real app, you would filter by topic)
      setFilteredTests(tests);
    }
  }, [activeTopic, tests]);

  // Handle topic selection
  const handleSelectTopic = (topicId: string) => {
    setActiveTopic(topicId);
  };

  // Handle test selection
  const handleSelectTest = (test: Survey) => {
    // Navigate to test taking page using _id instead of id
    navigate(`/tests/take/${test._id}`);
  };

  // Handle create test
  const handleCreateTest = () => {
    // Navigate to test constructor
    navigate('/tests/constructor');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Категории тестов</h2>
          <div className={styles.topicList}>
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`${styles.topicItem} ${activeTopic === topic.id ? styles.active : ''}`}
                onClick={() => handleSelectTopic(topic.id)}
              >
                {topic.name} ({topic.count})
              </div>
            ))}
          </div>
          {canCreate && (
            <button className={styles.createTestButton} onClick={handleCreateTest}>
              + Создать тест
            </button>
          )}
        </div>
        <div className={styles.mainContent}>
          <div className={styles.testsList}>
            <h2 className={styles.contentTitle}>Загрузка тестов...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Категории тестов</h2>
          <div className={styles.topicList}>
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`${styles.topicItem} ${activeTopic === topic.id ? styles.active : ''}`}
                onClick={() => handleSelectTopic(topic.id)}
              >
                {topic.name} ({topic.count})
              </div>
            ))}
          </div>
          {canCreate && (
            <button className={styles.createTestButton} onClick={handleCreateTest}>
              + Создать тест
            </button>
          )}
        </div>
        <div className={styles.mainContent}>
          <div className={styles.testsList}>
            <h2 className={styles.contentTitle}>Ошибка: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar with topics */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Категории тестов</h2>
        <div className={styles.topicList}>
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`${styles.topicItem} ${activeTopic === topic.id ? styles.active : ''}`}
              onClick={() => handleSelectTopic(topic.id)}
            >
              {topic.name} ({topic.count})
            </div>
          ))}
        </div>
        {canCreate && (
          <button className={styles.createTestButton} onClick={handleCreateTest}>
            + Создать тест
          </button>
        )}
      </div>

      {/* Main content area */}
      <div className={styles.mainContent}>
        <div className={styles.testsList}>
          <h2 className={styles.contentTitle}>
            {topics.find(topic => topic.id === activeTopic)?.name || 'Все тесты'}
          </h2>
          {filteredTests.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Пока нет тестов в этой категории.</p>
              {canCreate && (
                <button className={styles.createTestButton} onClick={handleCreateTest}>
                  Создать первый тест
                </button>
              )}
            </div>
          ) : (
            <div className={styles.testList}>
              {filteredTests.map((test) => (
                <div
                  key={test._id}
                  className={styles.testCard}
                  onClick={() => handleSelectTest(test)}
                >
                  <h3 className={styles.testTitle}>{test.name}</h3>
                  <p className={styles.testDescription}>{test.description}</p>
                  <div className={styles.testAuthor}>
                    Автор: {test.author}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestForm;
