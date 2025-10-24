import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email или телефон';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      console.log('📨 Отправляем данные для входа:', formData);

      const result = await login(formData.identifier, formData.password);
      
      if (result.success) {
        // ✅ УСПЕШНЫЙ ВХОД
        console.log('✅ Вход успешен:', result);
        
        setSuccessMessage('Добро пожаловать!'); // Упрощенное сообщение
        
        // 🎯 ПЕРЕНАПРАВЛЕНИЕ НА ГЛАВНУЮ
        setTimeout(() => {
          console.log('🔄 Перенаправляем на главную страницу...');
          window.location.href = '/';
        }, 1500);

      } else {
        setErrors({ submit: result.error || 'Неверные учетные данные' });
      }

    } catch (error) {
      console.error('🚫 Ошибка:', error);
      setErrors({ submit: 'Ошибка соединения с сервером' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {successMessage && (
        <div className={styles.successMessage}>
          ✅ {successMessage}
        </div>
      )}

      <div className={styles.inputGroup}>
        <label className={styles.label}>Email, телефон или имя пользователя</label>
        <input
          type="text"
          name="identifier"
          className={`${styles.input} ${errors.identifier ? styles.error : ''}`}
          value={formData.identifier}
          onChange={handleChange}
          placeholder="Введите email или телефон"
          required
          disabled={isLoading}
        />
        {errors.identifier && <span className={styles.errorText}>{errors.identifier}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Пароль</label>
        <input
          type="password"
          name="password"
          className={`${styles.input} ${errors.password ? styles.error : ''}`}
          value={formData.password}
          onChange={handleChange}
          placeholder="Введите ваш пароль"
          required
          disabled={isLoading}
        />
        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
      </div>

      <div className={styles.options}>
        <button type="button" className={styles.link}>
          Забыли пароль?
        </button>
      </div>

      {errors.submit && (
        <div className={styles.submitError}>❌ {errors.submit}</div>
      )}

      <div className={styles.buttons}>
        <button 
          type="button" 
          className={styles.createAccount}
          onClick={onSwitchToRegister}
          disabled={isLoading}
        >
          Создать аккаунт
        </button>
        
        <button 
          type="submit" 
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Вход...' : 'Войти'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;