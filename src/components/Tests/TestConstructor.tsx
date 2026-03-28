import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './TestConstructor.module.css';
import { TestQuestion, TestScale, TestResultInterpretation } from '../../types';
import apiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const TestConstructor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State for test properties
  const [name, setName] = useState('');  // Changed from title to name
  const [description, setDescription] = useState('');
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [scales, setScales] = useState<TestScale[]>([
    {
      id: 0,
      name: 'Основная шкала'
    }
  ]);
  const [results, setResults] = useState<TestResultInterpretation[]>([
    { scale_id: 0, min_score: 0, max_score: 3, text: 'Низкий уровень' },
    { scale_id: 0, min_score: 4, max_score: 6, text: 'Средний уровень' },
    { scale_id: 0, min_score: 7, max_score: 10, text: 'Высокий уровень' }
  ]);
  const [questions, setQuestions] = useState<TestQuestion[]>([
    {
      id: 0,
      order: 0,
      text: '',
      type: 'single',
      scales: [0],
      options: [
        { id: 0, order: 0, text: '', scores: 1 },
        { id: 1, order: 1, text: '', scores: 2 }
      ]
    }
  ]);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();

  // Load existing survey if editing
  useEffect(() => {
    if (id) {
      const loadSurvey = async () => {
        try {
          setLoading(true);
          const survey = await apiService.getSurveyById(id);
          
          setName(survey.name || '');
          setDescription(survey.description || '');
          setShuffle(Boolean(survey.shuffle));
          
          if (survey.scales) {
            setScales(survey.scales);
          }
          
          if (survey.results) {
            setResults(survey.results);
          }
          
          if (survey.questions) {
            setQuestions(survey.questions);
          }
        } catch (err) {
          setError('Не удалось загрузить тест для редактирования');
          console.error('Error loading survey:', err);
        } finally {
          setLoading(false);
        }
      };
      
      loadSurvey();
    }
  }, [id]);

  const handleScaleNameChange = (index: number, name: string) => {
    const updatedScales = [...scales];
    updatedScales[index].name = name;
    setScales(updatedScales);
  };

  const addScale = () => {
    const newScale: TestScale = {
      id: scales.length,
      name: ''
    };
    setScales([...scales, newScale]);
  };

  const removeScale = (index: number) => {
    if (scales.length <= 1) return;
    const updatedScales = [...scales];
    updatedScales.splice(index, 1);
    setScales(updatedScales);
  };

  // Result interpretation handlers
  const handleResultChange = (index: number, field: keyof TestResultInterpretation, value: string | number) => {
    const updatedResults = [...results];
    updatedResults[index] = {
      ...updatedResults[index],
      [field]: value
    };
    setResults(updatedResults);
  };

  const addResult = () => {
    const newResult: TestResultInterpretation = {
      scale_id: 0,
      min_score: 0,
      max_score: 0,
      text: ''
    };
    setResults([...results, newResult]);
  };

  const removeResult = (index: number) => {
    if (results.length <= 1) return;
    const updatedResults = [...results];
    updatedResults.splice(index, 1);
    setResults(updatedResults);
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = text;
    setQuestions(updatedQuestions);
  };

  const handleQuestionScaleToggle = (questionIndex: number, scaleId: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.scales.includes(scaleId)) {
      // Remove scale from question
      question.scales = question.scales.filter(id => id !== scaleId);
    } else {
      // Add scale to question
      question.scales = [...question.scales, scaleId];
    }
    
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (index: number, type: 'single' | 'multiple' | 'text') => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = type;
    
    // Reset options when changing to text type
    if (type === 'text') {
      delete updatedQuestions[index].options;
    } else if (!updatedQuestions[index].options) {
      // Add default options when changing from text to choice type
      updatedQuestions[index].options = [
        { id: 0, order: 0, text: '', scores: 1 },
        { id: 1, order: 1, text: '', scores: 2 }
      ];
    }
    
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    const newQuestion: TestQuestion = {
      id: questions.length,
      order: questions.length,
      text: '',
      type: 'single',
      scales: [0],
      options: [
        { id: 0, order: 0, text: '', scores: 1 },
        { id: 1, order: 1, text: '', scores: 2 }
      ]
    };
    
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options) {
      const newOptionId = question.options.length;
      question.options.push({ 
        id: newOptionId, 
        order: newOptionId, 
        text: '', 
        scores: 0 
      });
      setQuestions(updatedQuestions);
    }
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options && question.options.length > 2) {
      question.options.splice(optionIndex, 1);
      // Re-index remaining options
      question.options = question.options.map((option, idx) => ({
        ...option,
        id: idx,
        order: idx
      }));
      setQuestions(updatedQuestions);
    }
  };

  const handleOptionTextChange = (questionIndex: number, optionIndex: number, text: string) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options) {
      question.options[optionIndex].text = text;
      setQuestions(updatedQuestions);
    }
  };

  const handleOptionScoreChange = (questionIndex: number, optionIndex: number, score: string) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options) {
      question.options[optionIndex].scores = parseInt(score) || 0;
      setQuestions(updatedQuestions);
    }
  };

  // Save test
  const saveTest = async () => {
    // Validate form
    if (!name.trim()) {
      setError('Введите название теста');
      return;
    }
    
    if (!description.trim()) {
      setError('Введите описание теста');
      return;
    }
    
    // Validate scales
    for (let i = 0; i < scales.length; i++) {
      const scale = scales[i];
      if (!scale.name.trim()) {
        setError(`Введите название шкалы ${i + 1}`);
        return;
      }
    }
    
    // Validate results
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (!result.text.trim()) {
        setError(`Введите текст интерпретации ${i + 1}`);
        return;
      }
    }
    
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.text.trim()) {
        setError(`Введите текст вопроса ${i + 1}`);
        return;
      }
      
      if (question.scales.length === 0) {
        setError(`Выберите хотя бы одну шкалу для вопроса ${i + 1}`);
        return;
      }
      
      if (question.type !== 'text') {
        if (!question.options || question.options.length < 2) {
          setError(`Добавьте как минимум 2 варианта ответа для вопроса ${i + 1}`);
          return;
        }
        
        for (let j = 0; j < (question.options?.length || 0); j++) {
          const option = question.options![j];
          if (!option.text.trim()) {
            setError(`Заполните вариант ответа ${j} для вопроса ${i + 1}`);
            return;
          }
        }
      }
    }
    
    try {
      setLoading(true);
      
      // Prepare survey data
      const surveyData = {
        name,
        description,
        author_id: user?.id,
        author: user?.username,
        shuffle,
        scales,
        results,
        questions
      };
      
      if (id) {
        // Update existing survey
        await apiService.updateSurvey(id, surveyData);
        alert('Тест успешно обновлен!');
      } else {
        // Create new survey
        await apiService.createSurvey(surveyData);
        alert('Тест успешно создан!');
      }
      
      navigate('/tests');
    } catch (err) {
      setError('Не удалось сохранить тест. Попробуйте еще раз.');
      console.error('Error saving survey:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel and return to tests list
  const cancel = () => {
    if (window.confirm('Вы уверены, что хотите отменить изменения?')) {
      navigate('/tests');
    }
  };

  if (loading && id) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Загрузка теста...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{id ? 'Редактирование теста' : 'Создание нового теста'}</h1>
      </div>
      
      {error && (
        <div className={styles.header} style={{ backgroundColor: 'rgba(255, 100, 100, 0.2)' }}>
          <p style={{ color: '#ff9999', textAlign: 'center' }}>{error}</p>
        </div>
      )}
      
      <div className={styles.header}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Название теста</label>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите название теста"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Описание</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Введите описание теста"
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={shuffle}
              onChange={(e) => setShuffle(e.target.checked)}
            />
            Перемешивать вопросы
          </label>
        </div>
      </div>
      
      {/* Scales section */}
      <div className={styles.header}>
        <h2 className={styles.title}>Шкалы оценивания</h2>
        <button className={styles.addButton} onClick={addScale}>
          + Добавить шкалу
        </button>
      </div>
      
      {scales.map((scale, scaleIndex) => (
        <div key={scale.id} className={styles.questionSection}>
          <div className={styles.questionHeader}>
            <h3 className={styles.questionTitle}>Шкала {scaleIndex}</h3>
            {scales.length > 1 && (
              <button 
                className={styles.removeQuestionButton}
                onClick={() => removeScale(scaleIndex)}
              >
                Удалить
              </button>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Название шкалы</label>
            <input
              type="text"
              className={styles.input}
              value={scale.name}
              onChange={(e) => handleScaleNameChange(scaleIndex, e.target.value)}
              placeholder="Введите название шкалы"
            />
          </div>
        </div>
      ))}
      
      {/* Results section */}
      <div className={styles.header}>
        <h2 className={styles.title}>Интерпретации результатов</h2>
        <button className={styles.addButton} onClick={addResult}>
          + Добавить интерпретацию
        </button>
      </div>
      
      {results.map((result, resultIndex) => (
        <div key={resultIndex} className={styles.questionSection}>
          <div className={styles.questionHeader}>
            <h3 className={styles.questionTitle}>Интерпретация {resultIndex}</h3>
            {results.length > 1 && (
              <button 
                className={styles.removeQuestionButton}
                onClick={() => removeResult(resultIndex)}
              >
                Удалить
              </button>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Шкала</label>
            <select
              className={styles.select}
              value={result.scale_id}
              onChange={(e) => handleResultChange(resultIndex, 'scale_id', parseInt(e.target.value))}
            >
              <option value="">Выберите шкалу</option>
              {scales.map((scale) => (
                <option key={scale.id} value={scale.id}>{scale.name}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup} style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>Минимальное значение</label>
              <input
                type="number"
                className={styles.input}
                value={result.min_score}
                onChange={(e) => handleResultChange(resultIndex, 'min_score', parseInt(e.target.value) || 0)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>Максимальное значение</label>
              <input
                type="number"
                className={styles.input}
                value={result.max_score}
                onChange={(e) => handleResultChange(resultIndex, 'max_score', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Текст интерпретации</label>
            <input
              type="text"
              className={styles.input}
              value={result.text}
              onChange={(e) => handleResultChange(resultIndex, 'text', e.target.value)}
              placeholder="Введите текст интерпретации"
            />
          </div>
        </div>
      ))}
      
      <div className={styles.header}>
        <h2 className={styles.title}>Вопросы</h2>
        <button className={styles.addButton} onClick={addQuestion}>
          + Добавить вопрос
        </button>
      </div>
      
      {questions.map((question, questionIndex) => (
        <div key={question.id} className={styles.questionSection}>
          <div className={styles.questionHeader}>
            <h3 className={styles.questionTitle}>Вопрос {questionIndex}</h3>
            {questions.length > 1 && (
              <button 
                className={styles.removeQuestionButton}
                onClick={() => removeQuestion(questionIndex)}
              >
                Удалить
              </button>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Текст вопроса</label>
            <textarea
              className={styles.textarea}
              value={question.text}
              onChange={(e) => handleQuestionTextChange(questionIndex, e.target.value)}
              placeholder="Введите текст вопроса"
              rows={2}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Шкалы оценивания</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {scales.map((scale) => (
                <label key={scale.id} style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={question.scales.includes(scale.id)}
                    onChange={() => handleQuestionScaleToggle(questionIndex, scale.id)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {scale.name}
                </label>
              ))}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Тип вопроса</label>
            <select
              className={styles.select}
              value={question.type}
              onChange={(e) => handleQuestionTypeChange(questionIndex, e.target.value as any)}
            >
              <option value="single">Один правильный ответ</option>
              <option value="multiple">Несколько правильных ответов</option>
              <option value="text">Ответ текстом</option>
            </select>
          </div>
          
          {question.type !== 'text' && question.options && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Варианты ответов</label>
              {question.options.map((option, optionIndex) => (
                <div key={option.id} className={styles.optionItem}>
                  <input
                    type="text"
                    className={styles.optionInput}
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(questionIndex, optionIndex, e.target.value)}
                    placeholder={`Вариант ${optionIndex}`}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span>Баллы:</span>
                    <input
                      type="number"
                      className={styles.input}
                      value={option.scores}
                      onChange={(e) => handleOptionScoreChange(questionIndex, optionIndex, e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </div>
                  {question.options && question.options.length > 2 && (
                    <button 
                      className={styles.removeQuestionButton}
                      onClick={() => removeOption(questionIndex, optionIndex)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button 
                className={styles.addButton} 
                onClick={() => addOption(questionIndex)}
                style={{ marginTop: '1rem' }}
              >
                + Добавить вариант
              </button>
            </div>
          )}
        </div>
      ))}
      
      <div className={styles.actions}>
        <button 
          className={styles.saveButton} 
          onClick={saveTest}
          disabled={loading}
        >
          {loading ? 'Сохранение...' : (id ? 'Обновить тест' : 'Создать тест')}
        </button>
        <button 
          className={styles.cancelButton} 
          onClick={cancel}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default TestConstructor;
