import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './TestConstructor.module.css';
import { Test, TestQuestion, TestScale } from '../../types';

const TestConstructor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State for test properties
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scales, setScales] = useState<TestScale[]>([
    {
      id: 's1',
      name: 'Основная шкала',
      min: 0,
      max: 10,
      interpretations: [
        { minScore: 0, maxScore: 3, description: 'Низкий уровень' },
        { minScore: 4, maxScore: 6, description: 'Средний уровень' },
        { minScore: 7, maxScore: 10, description: 'Высокий уровень' }
      ]
    }
  ]);
  const [questions, setQuestions] = useState<TestQuestion[]>([
    {
      id: 'q1',
      text: '',
      type: 'single',
      scaleId: 's1',
      options: [
        { id: 'a', text: '', score: { s1: 1 } },
        { id: 'b', text: '', score: { s1: 2 } }
      ]
    }
  ]);
  
  const [error, setError] = useState<string | null>(null);

  // Handle scale changes
  const handleScaleNameChange = (index: number, name: string) => {
    const updatedScales = [...scales];
    updatedScales[index].name = name;
    setScales(updatedScales);
  };

  const handleScaleRangeChange = (index: number, field: 'min' | 'max', value: string) => {
    const updatedScales = [...scales];
    updatedScales[index][field] = parseInt(value) || 0;
    setScales(updatedScales);
  };

  const handleInterpretationChange = (scaleIndex: number, interpIndex: number, field: 'minScore' | 'maxScore', value: string) => {
    const updatedScales = [...scales];
    updatedScales[scaleIndex].interpretations[interpIndex][field] = parseInt(value) || 0;
    setScales(updatedScales);
  };

  const handleInterpretationDescriptionChange = (scaleIndex: number, interpIndex: number, description: string) => {
    const updatedScales = [...scales];
    updatedScales[scaleIndex].interpretations[interpIndex].description = description;
    setScales(updatedScales);
  };

  const addScale = () => {
    const newScale: TestScale = {
      id: `s${scales.length + 1}`,
      name: '',
      min: 0,
      max: 10,
      interpretations: [
        { minScore: 0, maxScore: 5, description: 'Низкий уровень' },
        { minScore: 6, maxScore: 10, description: 'Высокий уровень' }
      ]
    };
    setScales([...scales, newScale]);
  };

  const removeScale = (index: number) => {
    if (scales.length <= 1) return;
    const updatedScales = [...scales];
    updatedScales.splice(index, 1);
    setScales(updatedScales);
  };

  const addInterpretation = (scaleIndex: number) => {
    const updatedScales = [...scales];
    updatedScales[scaleIndex].interpretations.push({
      minScore: 0,
      maxScore: 0,
      description: ''
    });
    setScales(updatedScales);
  };

  const removeInterpretation = (scaleIndex: number, interpIndex: number) => {
    const updatedScales = [...scales];
    if (updatedScales[scaleIndex].interpretations.length > 1) {
      updatedScales[scaleIndex].interpretations.splice(interpIndex, 1);
      setScales(updatedScales);
    }
  };

  // Handle question text change
  const handleQuestionTextChange = (index: number, text: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = text;
    setQuestions(updatedQuestions);
  };

  // Handle question scale change (single scale selection)
  const handleQuestionScaleChange = (index: number, scaleId: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].scaleId = scaleId;
    
    // Update options to only show score for selected scale
    if (updatedQuestions[index].options) {
      updatedQuestions[index].options = updatedQuestions[index].options!.map(option => ({
        ...option,
        score: option.score ? { [scaleId]: option.score[scaleId] || 0 } : { [scaleId]: 0 }
      }));
    }
    
    setQuestions(updatedQuestions);
  };

  // Handle question type change
  const handleQuestionTypeChange = (index: number, type: 'single' | 'multiple' | 'text') => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = type;
    
    // Reset options when changing to text type
    if (type === 'text') {
      delete updatedQuestions[index].options;
    } else if (!updatedQuestions[index].options) {
      // Add default options when changing from text to choice type
      const scaleId = updatedQuestions[index].scaleId || scales[0]?.id || 's1';
      updatedQuestions[index].options = [
        { id: 'a', text: '', score: { [scaleId]: 1 } },
        { id: 'b', text: '', score: { [scaleId]: 2 } }
      ];
    }
    
    setQuestions(updatedQuestions);
  };

  // Add new question
  const addQuestion = () => {
    const scaleId = scales[0]?.id || 's1';
    const newQuestion: TestQuestion = {
      id: `q${questions.length + 1}`,
      text: '',
      type: 'single',
      scaleId: scaleId,
      options: [
        { id: 'a', text: '', score: { [scaleId]: 1 } },
        { id: 'b', text: '', score: { [scaleId]: 2 } }
      ]
    };
    
    setQuestions([...questions, newQuestion]);
  };

  // Remove question
  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  // Add option to question
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options) {
      const newOptionId = String.fromCharCode(97 + question.options.length);
      const scaleId = question.scaleId || scales[0]?.id || 's1';
      question.options.push({ id: newOptionId, text: '', score: { [scaleId]: 0 } });
      setQuestions(updatedQuestions);
    }
  };

  // Remove option from question
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options && question.options.length > 2) {
      question.options.splice(optionIndex, 1);
      setQuestions(updatedQuestions);
    }
  };

  // Handle option text change
  const handleOptionTextChange = (questionIndex: number, optionIndex: number, text: string) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options) {
      question.options[optionIndex].text = text;
      setQuestions(updatedQuestions);
    }
  };

  // Handle option score change for a specific scale
  const handleOptionScoreChange = (questionIndex: number, optionIndex: number, scaleId: string, score: string) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options) {
      if (!question.options[optionIndex].score) {
        question.options[optionIndex].score = {};
      }
      question.options[optionIndex].score![scaleId] = parseInt(score) || 0;
      setQuestions(updatedQuestions);
    }
  };

  // Save test
  const saveTest = () => {
    // Validate form
    if (!title.trim()) {
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
      
      for (let j = 0; j < scale.interpretations.length; j++) {
        const interp = scale.interpretations[j];
        if (!interp.description.trim()) {
          setError(`Введите описание интерпретации ${j + 1} для шкалы ${scale.name}`);
          return;
        }
      }
    }
    
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.text.trim()) {
        setError(`Введите текст вопроса ${i + 1}`);
        return;
      }
      
      if (!question.scaleId) {
        setError(`Выберите шкалу для вопроса ${i + 1}`);
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
            setError(`Заполните вариант ответа ${String.fromCharCode(97 + j)} для вопроса ${i + 1}`);
            return;
          }
        }
      }
    }
    
    // In a real implementation, you would save to API
    alert(id ? 'Тест успешно обновлен!' : 'Тест успешно создан!');
    navigate('/tests');
  };

  // Cancel and return to tests list
  const cancel = () => {
    if (window.confirm('Вы уверены, что хотите отменить изменения?')) {
      navigate('/tests');
    }
  };

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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            <h3 className={styles.questionTitle}>Шкала {scaleIndex + 1}</h3>
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
          
          <div className={styles.formGroup} style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>Минимальное значение</label>
              <input
                type="number"
                className={styles.input}
                value={scale.min}
                onChange={(e) => handleScaleRangeChange(scaleIndex, 'min', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>Максимальное значение</label>
              <input
                type="number"
                className={styles.input}
                value={scale.max}
                onChange={(e) => handleScaleRangeChange(scaleIndex, 'max', e.target.value)}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Интерпретации</label>
            {scale.interpretations.map((interp, interpIndex) => (
              <div key={interpIndex} className={styles.optionItem} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label className={styles.label}>От</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={interp.minScore}
                      onChange={(e) => handleInterpretationChange(scaleIndex, interpIndex, 'minScore', e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className={styles.label}>До</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={interp.maxScore}
                      onChange={(e) => handleInterpretationChange(scaleIndex, interpIndex, 'maxScore', e.target.value)}
                    />
                  </div>
                  {scale.interpretations.length > 1 && (
                    <button 
                      className={styles.removeQuestionButton}
                      onClick={() => removeInterpretation(scaleIndex, interpIndex)}
                      style={{ alignSelf: 'flex-end' }}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div>
                  <label className={styles.label}>Описание</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={interp.description}
                    onChange={(e) => handleInterpretationDescriptionChange(scaleIndex, interpIndex, e.target.value)}
                    placeholder="Введите описание интерпретации"
                  />
                </div>
              </div>
            ))}
            <button 
              className={styles.addButton} 
              onClick={() => addInterpretation(scaleIndex)}
              style={{ marginTop: '0.5rem' }}
            >
              + Добавить интерпретацию
            </button>
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
            <h3 className={styles.questionTitle}>Вопрос {questionIndex + 1}</h3>
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
            <label className={styles.label}>Шкала оценивания</label>
            <select
              className={styles.select}
              value={question.scaleId || ''}
              onChange={(e) => handleQuestionScaleChange(questionIndex, e.target.value)}
            >
              <option value="">Выберите шкалу</option>
              {scales.map(scale => (
                <option key={scale.id} value={scale.id}>{scale.name}</option>
              ))}
            </select>
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
          
          {question.type !== 'text' && question.options && question.scaleId && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Варианты ответов</label>
              {question.options.map((option, optionIndex) => (
                <div key={option.id} className={styles.optionItem}>
                  <input
                    type="text"
                    className={styles.optionInput}
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(questionIndex, optionIndex, e.target.value)}
                    placeholder={`Вариант ${String.fromCharCode(97 + optionIndex)}`}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ minWidth: '100px' }}>{scales.find(s => s.id === question.scaleId)?.name || 'Шкала'}:</span>
                    <input
                      type="number"
                      className={styles.input}
                      value={option.score?.[question.scaleId!] || 0}
                      onChange={(e) => handleOptionScoreChange(questionIndex, optionIndex, question.scaleId!, e.target.value)}
                      style={{ width: '80px' }}
                    />
                    <span>баллов</span>
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
        >
          {id ? 'Обновить тест' : 'Создать тест'}
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