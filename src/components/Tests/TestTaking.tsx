import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './TestTaking.module.css';
import { Test, TestQuestion, TestScale } from '../../types';
import apiService from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const TestTaking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number | number[] | string }>({});
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<[] | null>(null); // New state for backend results
  
  const { user } = useAuth();

  // Load test data
  useEffect(() => {
    if (!id) {
      setError('Не указан ID теста');
      setLoading(false);
      return;
    }
    
    const loadTest = async () => {
      try {
        setLoading(true);
        const testData = await apiService.getSurveyById(id);
        setTest(testData);
      } catch (err) {
        setError('Не удалось загрузить тест');
        //console.error('Error loading test:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTest();
  }, [id]);

  // Handle answer selection
  const handleAnswerSelect = (questionId: number, optionId: number, isMultiple: boolean = false) => {
    if (isMultiple) {
      // Handle multiple selection
      const currentAnswers = (answers[questionId] as number[]) || [];
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter(id => id !== optionId)
        : [...currentAnswers, optionId];
      
      setAnswers(prev => ({
        ...prev,
        [questionId]: newAnswers
      }));
    } else {
      // Handle single selection
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }));
    }
  };

  // Handle text answer
  const handleTextAnswer = (questionId: number, text: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: text
    }));
  };

  // Navigation
  const goToNextQuestion = () => {
    if (!test) return;
    
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit test
  const submitTest = async () => {
    if (!test || !id) return;
    
    try {
      // Prepare result data in the new format
      const resultData = {
        user_id: user?.id?.toString() || 'anonymous',
        questions: Object.entries(answers)
          .filter(([_, answer]) => typeof answer === 'number' || Array.isArray(answer))
          .map(([questionId, answer]) => {
            if (Array.isArray(answer)) {
              // For multiple choice, we'll send the first selected option
              return {
                question_id: parseInt(questionId),
                option_id: answer[0] || 0
              };
            } else if (typeof answer === 'number') {
              return {
                question_id: parseInt(questionId),
                option_id: answer
              };
            }
            return null;
          })
          .filter(item => item !== null) as { question_id: number; option_id: number }[]
      };
      
      // Save result to backend and get processed results
      const response = await apiService.saveSurveyResult(id, resultData);
      
      // Set the results from backend response
      if (response.results) {
        setTestResults(response.results);
      }
      
      setTestCompleted(true);
    } catch (err) {
      setError('Не удалось отправить результаты теста');
      console.error('Error submitting test:', err);
    }
  };

  // Finish test and return to tests list
  const finishTest = () => {
    navigate('/tests');
  };

  // Check if current question has an answer
  const hasCurrentQuestionAnswer = () => {
    if (!test) return false;
    const currentQuestion = test.questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id];
    
    // For text questions, check if there's a non-empty string
    if (currentQuestion.type === 'text') {
      return typeof answer === 'string' && answer.trim() !== '';
    }
    
    // For choice questions, check if there's a valid answer
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    } else {
      // For single choice, check if answer exists (including 0)
      return answer !== undefined && answer !== null;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.resultContainer}>
          <h1 className={styles.resultTitle}>Загрузка теста...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.resultContainer}>
          <h1 className={styles.resultTitle}>Ошибка</h1>
          <p className={styles.resultMessage}>{error}</p>
          <button className={styles.navButton} onClick={() => navigate('/tests')}>
            Вернуться к списку тестов
          </button>
        </div>
      </div>
    );
  }

  if (testCompleted && test) {
    return (
      <div className={styles.container}>
        <div className={styles.resultContainer}>
          <h1 className={styles.resultTitle}>Тест завершен!</h1>
          <p className={styles.resultMessage}>
            Спасибо за прохождение теста "{test.name}"
          </p>
          
          {testResults ? (
            // Display results from backend
            testResults.map((result, index) => {
              console.log('Processing result:', result);
              // Find the scale name for this result
              const scale = test.scales.find(s => s.id === index);
              return (
                <div key={index} className={styles.resultScoreContainer}>
                  <h3 className={styles.resultScaleTitle}>{scale ? scale.name : `Шкала ${index}`}</h3>
                  <p className={styles.resultMessage}>
                    {result}
                  </p>
                </div>
              );
            })
          ) : (
            // Fallback if no results from backend
            test.scales.map(scale => (
              <div key={scale.id} className={styles.resultScoreContainer}>
                <h3 className={styles.resultScaleTitle}>{scale.name}</h3>
                <p className={styles.resultMessage}>
                  Результаты будут доступны после обработки.
                </p>
              </div>
            ))
          )}
          
          <button className={styles.navButton} onClick={finishTest}>
            Вернуться к списку тестов
          </button>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className={styles.container}>
        <div className={styles.resultContainer}>
          <h1 className={styles.resultTitle}>Тест не найден</h1>
          <button className={styles.navButton} onClick={() => navigate('/tests')}>
            Вернуться к списку тестов
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <div className={styles.container}>
        <div className={styles.resultContainer}>
          <h1 className={styles.resultTitle}>Вопрос не найден</h1>
          <button className={styles.navButton} onClick={() => navigate('/tests')}>
            Вернуться к списку тестов
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.testHeader}>
        <h1 className={styles.testTitle}>{test.name}</h1>
        <p className={styles.testDescription}>{test.description}</p>
      </div>

      {/* Enhanced progress indicator */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}
          ></div>
        </div>
        <div className={styles.progressText}>
          <span className={styles.currentQuestion}>
            Вопрос {currentQuestionIndex + 1}
          </span>
          <span className={styles.totalQuestions}>
            из {test.questions.length}
          </span>
        </div>
      </div>

      <div className={styles.questionContainer}>
        <h2 className={styles.questionText}>{currentQuestion.text}</h2>
        
        {currentQuestion.type === 'text' ? (
          <div className={styles.textAnswerContainer}>
            <textarea
              className={styles.textArea}
              placeholder="Введите ваш ответ здесь..."
              value={typeof answers[currentQuestion.id] === 'string' ? answers[currentQuestion.id] as string : ''}
              onChange={(e) => handleTextAnswer(currentQuestion.id, e.target.value)}
            />
          </div>
        ) : (
          <div className={styles.optionsContainer}>
            {currentQuestion.options?.map((option) => {
              const isSelected = currentQuestion.type === 'multiple' 
                ? Array.isArray(answers[currentQuestion.id]) && (answers[currentQuestion.id] as number[]).includes(option.id)
                : answers[currentQuestion.id] === option.id;
              
              return (
                <div 
                  key={option.id} 
                  className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleAnswerSelect(
                    currentQuestion.id, 
                    option.id, 
                    currentQuestion.type === 'multiple'
                  )}
                >
                  <div className={styles.optionText}>{option.text}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.navigation}>
        <button 
          className={styles.navButton}
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Назад
        </button>
        
        {currentQuestionIndex < test.questions.length - 1 ? (
          <button 
            className={styles.navButton}
            onClick={goToNextQuestion}
            disabled={!hasCurrentQuestionAnswer()}
          >
            Далее
          </button>
        ) : (
          <button 
            className={styles.submitButton}
            onClick={submitTest}
            disabled={!hasCurrentQuestionAnswer()}
          >
            Завершить тест
          </button>
        )}
      </div>
    </div>
  );
};

export default TestTaking;