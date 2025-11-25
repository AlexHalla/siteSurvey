import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TestTaking.module.css';
import { Test, TestQuestion, TestScale } from '../../types';

const TestTaking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Mock test data with scoring system
  const mockTest: Test = {
    id: id || '1',
    title: 'Тест на уровень тревожности',
    description: 'Определите свой уровень тревожности и узнайте способы управления стрессом',
    questions: 5,
    scales: [
      {
        id: 'anxiety',
        name: 'Уровень тревожности',
        min: 0,
        max: 20,
        interpretations: [
          { minScore: 0, maxScore: 5, description: 'Низкий уровень тревожности' },
          { minScore: 6, maxScore: 12, description: 'Средний уровень тревожности' },
          { minScore: 13, maxScore: 20, description: 'Высокий уровень тревожности' }
        ]
      }
    ],
    questionsList: [
      {
        id: 'q1',
        text: 'Часто ли вы испытываете чувство беспокойства?',
        type: 'single',
        scaleId: 'anxiety',
        options: [
          { id: 'a', text: 'Никогда', score: { anxiety: 0 } },
          { id: 'b', text: 'Редко', score: { anxiety: 1 } },
          { id: 'c', text: 'Иногда', score: { anxiety: 2 } },
          { id: 'd', text: 'Часто', score: { anxiety: 3 } },
          { id: 'e', text: 'Постоянно', score: { anxiety: 4 } }
        ]
      },
      {
        id: 'q2',
        text: 'Какие из следующих симптомов вы испытываете? (Выберите все подходящие)',
        type: 'multiple',
        scaleId: 'anxiety',
        options: [
          { id: 'a', text: 'Учащенное сердцебиение', score: { anxiety: 1 } },
          { id: 'b', text: 'Потливость', score: { anxiety: 1 } },
          { id: 'c', text: 'Дрожь в руках', score: { anxiety: 1 } },
          { id: 'd', text: 'Головокружение', score: { anxiety: 1 } },
          { id: 'e', text: 'Ощущение нехватки воздуха', score: { anxiety: 1 } }
        ]
      },
      {
        id: 'q3',
        text: 'Опишите ситуацию, в которой вы чувствуете наибольшую тревожность:',
        type: 'text',
        scaleId: 'anxiety'
      }
    ]
  };
  
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string | string[]}>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [scaleScores, setScaleScores] = useState<{[scaleId: string]: number}>({});

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Handle text answer change
  const handleTextAnswerChange = (questionId: string, text: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: text
    }));
  };

  // Navigate to next question
  const goToNextQuestion = () => {
    if (mockTest.questionsList && currentQuestionIndex < mockTest.questionsList.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Calculate scores for all scales
  const calculateScores = () => {
    const scores: {[scaleId: string]: number} = {};
    
    // Initialize scores for all scales
    mockTest.scales?.forEach(scale => {
      scores[scale.id] = 0;
    });
    
    // Calculate scores based on answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = mockTest.questionsList?.find(q => q.id === questionId);
      if (!question || !question.scaleId) return;
      
      const scaleId = question.scaleId;
      
      if (question.type === 'single' && typeof answer === 'string') {
        // Single choice question
        const option = question.options?.find(opt => opt.id === answer);
        if (option && option.score) {
          Object.entries(option.score).forEach(([scaleId, score]) => {
            scores[scaleId] = (scores[scaleId] || 0) + score;
          });
        }
      } else if (question.type === 'multiple' && Array.isArray(answer)) {
        // Multiple choice question
        answer.forEach(selectedOptionId => {
          const option = question.options?.find(opt => opt.id === selectedOptionId);
          if (option && option.score) {
            Object.entries(option.score).forEach(([scaleId, score]) => {
              scores[scaleId] = (scores[scaleId] || 0) + score;
            });
          }
        });
      }
      // For text answers, no scoring is applied in this mock implementation
    });
    
    return scores;
  };

  // Submit test
  const submitTest = () => {
    const scores = calculateScores();
    setScaleScores(scores);
    setTestCompleted(true);
  };

  // Finish test and return to tests list
  const finishTest = () => {
    navigate('/tests');
  };

  // Get interpretation for a scale score
  const getInterpretation = (scale: TestScale, score: number) => {
    return scale.interpretations.find(interp => 
      score >= interp.minScore && score <= interp.maxScore
    )?.description || 'Не определено';
  };

  if (testCompleted) {
    return (
      <div className={styles.container}>
        <div className={styles.resultContainer}>
          <h1 className={styles.resultTitle}>Тест завершен!</h1>
          <p className={styles.resultMessage}>
            Спасибо за прохождение теста "{mockTest.title}"
          </p>
          
          {mockTest.scales?.map(scale => {
            const score = scaleScores[scale.id] || 0;
            return (
              <div key={scale.id} className={styles.resultScoreContainer}>
                <h3 className={styles.resultScaleTitle}>{scale.name}</h3>
                <div className={styles.resultScore}>
                  Ваш результат: {score} из {scale.max}
                </div>
                <p className={styles.resultMessage}>
                  {getInterpretation(scale, score)}
                </p>
              </div>
            );
          })}
          
          <button className={styles.navButton} onClick={finishTest}>
            Вернуться к списку тестов
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = mockTest.questionsList?.[currentQuestionIndex];
  const progress = mockTest.questionsList 
    ? Math.round(((currentQuestionIndex + 1) / mockTest.questionsList.length) * 100) 
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.testTitle}>{mockTest.title}</h1>
        <div className={styles.testMeta}>
          <span>Вопрос {currentQuestionIndex + 1} из {mockTest.questionsList?.length}</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {currentQuestion && (
        <div className={styles.questionContainer}>
          <div className={styles.questionNumber}>
            Вопрос {currentQuestionIndex + 1}
          </div>
          <div className={styles.questionText}>
            {currentQuestion.text}
          </div>

          {currentQuestion.type === 'text' ? (
            <textarea
              className={styles.textAnswer}
              placeholder="Введите ваш ответ здесь..."
              value={answers[currentQuestion.id] as string || ''}
              onChange={(e) => handleTextAnswerChange(currentQuestion.id, e.target.value)}
            />
          ) : (
            <div className={styles.optionsContainer}>
              {currentQuestion.options?.map((option) => {
                const isSelected = currentQuestion.type === 'single'
                  ? answers[currentQuestion.id] === option.id
                  : Array.isArray(answers[currentQuestion.id]) 
                    ? (answers[currentQuestion.id] as string[]).includes(option.id)
                    : false;

                return (
                  <div
                    key={option.id}
                    className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                    onClick={() => {
                      if (currentQuestion.type === 'single') {
                        handleAnswerSelect(currentQuestion.id, option.id);
                      } else {
                        const currentAnswers = Array.isArray(answers[currentQuestion.id]) 
                          ? [...answers[currentQuestion.id] as string[]] 
                          : [];
                        
                        if (isSelected) {
                          // Remove option
                          const newAnswers = currentAnswers.filter(id => id !== option.id);
                          handleAnswerSelect(currentQuestion.id, newAnswers);
                        } else {
                          // Add option
                          handleAnswerSelect(currentQuestion.id, [...currentAnswers, option.id]);
                        }
                      }
                    }}
                  >
                    {option.text}
                  </div>
                );
              })}
            </div>
          )}

          <div className={styles.navigation}>
            <button 
              className={styles.navButton}
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Назад
            </button>
            
            {currentQuestionIndex === (mockTest.questionsList?.length || 0) - 1 ? (
              <button 
                className={styles.navButton}
                onClick={submitTest}
                disabled={!answers[currentQuestion.id]}
              >
                Завершить тест
              </button>
            ) : (
              <button 
                className={styles.navButton}
                onClick={goToNextQuestion}
                disabled={!answers[currentQuestion.id]}
              >
                Далее
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestTaking;