import React, { useState } from 'react';
import styles from './Test.module.css';

// Define types
interface TestTopic {
  id: string;
  name: string;
  count: number;
}

interface Test {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const TestForm: React.FC = () => {
  // Topics data
  const topics: TestTopic[] = [
    { id: 'all', name: 'Все тесты', count: 24 },
    { id: 'new', name: 'Новые', count: 5 },
    { id: 'popular', name: 'Популярные', count: 8 },
    { id: 'psychology', name: 'Психология', count: 7 },
    { id: 'personality', name: 'Тип личности', count: 4 },
    { id: 'intelligence', name: 'Интеллект', count: 3 },
    { id: 'career', name: 'Профориентация', count: 3 },
  ];

  // Mock data for tests
  const allTests: Test[] = [
    {
      id: '1',
      title: 'Тест на уровень тревожности',
      description: 'Определите свой уровень тревожности и узнайте способы управления стрессом',
      duration: '10 мин',
      questions: 25,
      difficulty: 'medium'
    },
    {
      id: '2',
      title: 'Определение типа личности',
      description: 'Узнайте к какому психологическому типу вы относитесь по методике Карла Юнга',
      duration: '15 мин',
      questions: 40,
      difficulty: 'medium'
    },
    {
      id: '3',
      title: 'Эмоциональный интеллект',
      description: 'Проверьте уровень развития вашего эмоционального интеллекта',
      duration: '12 мин',
      questions: 30,
      difficulty: 'hard'
    },
    {
      id: '4',
      title: 'Психологическая устойчивость',
      description: 'Оцените вашу способность справляться с жизненными трудностями',
      duration: '8 мин',
      questions: 20,
      difficulty: 'easy'
    },
    {
      id: '5',
      title: 'Креативное мышление',
      description: 'Проверьте уровень вашего творческого потенциала',
      duration: '20 мин',
      questions: 35,
      difficulty: 'hard'
    },
    {
      id: '6',
      title: 'Социальный интеллект',
      description: 'Оцените свои навыки общения и понимания других людей',
      duration: '10 мин',
      questions: 25,
      difficulty: 'medium'
    }
  ];

  // State management
  const [activeTopic, setActiveTopic] = useState<string>('all');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [filteredTests, setFilteredTests] = useState<Test[]>(allTests);

  // Filter tests based on selected topic
  React.useEffect(() => {
    if (activeTopic === 'all') {
      setFilteredTests(allTests);
    } else if (activeTopic === 'new') {
      // For demo purposes, show first 3 tests as "new"
      setFilteredTests(allTests.slice(0, 3));
    } else if (activeTopic === 'popular') {
      // For demo purposes, show last 3 tests as "popular"
      setFilteredTests(allTests.slice(-3));
    } else {
      // For other topics, show all tests (in a real app, you would filter by topic)
      setFilteredTests(allTests);
    }
  }, [activeTopic]);

  // Handle topic selection
  const handleSelectTopic = (topicId: string) => {
    setActiveTopic(topicId);
    // Reset test selection when changing topics
    setSelectedTest(null);
  };

  // Handle test selection
  const handleSelectTest = (test: Test) => {
    setSelectedTest(test);
  };

  // Handle back to tests list
  const handleBackToList = () => {
    setSelectedTest(null);
  };

  // Handle create test
  const handleCreateTest = () => {
    alert('Функция создания теста будет реализована позже');
  };

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
        <button className={styles.createTestButton} onClick={handleCreateTest}>
          + Создать тест
        </button>
      </div>

      {/* Main content area */}
      <div className={styles.mainContent}>
        {selectedTest ? (
          // Test detail view
          <div className={styles.testDetail}>
            <div className={styles.testDetailHeader}>
              <h1 className={styles.testDetailTitle}>{selectedTest.title}</h1>
              <div className={styles.testMeta}>
                <span>Время: {selectedTest.duration}</span>
                <span>Вопросов: {selectedTest.questions}</span>
                <span>
                  Сложность: {
                    selectedTest.difficulty === 'easy' ? 'Легкий' :
                    selectedTest.difficulty === 'medium' ? 'Средний' : 'Сложный'
                  }
                </span>
              </div>
            </div>
            <p className={styles.testDetailDescription}>{selectedTest.description}</p>
            <div className={styles.testActions}>
              <button className={styles.startTestButton}>Начать тест</button>
              <button className={styles.backButton} onClick={handleBackToList}>Назад</button>
            </div>
          </div>
        ) : (
          // Tests list view
          <div className={styles.testsList}>
            <h2 className={styles.contentTitle}>
              {topics.find(topic => topic.id === activeTopic)?.name || 'Все тесты'}
            </h2>
            <div className={styles.testList}>
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className={styles.testCard}
                  onClick={() => handleSelectTest(test)}
                >
                  <h3 className={styles.testTitle}>{test.title}</h3>
                  <p className={styles.testDescription}>{test.description}</p>
                  <div className={styles.testMeta}>
                    <span>⏱️ {test.duration}</span>
                    <span>❓ {test.questions} вопросов</span>
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

export default TestForm;