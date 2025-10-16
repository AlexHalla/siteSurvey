import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // 🔥 ДОБАВИЛИ ЭТУ СТРОКУ
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
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
    setSuccessMessage(''); // 🔥 Очищаем сообщение

    try {
      const loginData = {
        email: formData.email.trim(),
        password: formData.password
      };

      console.log('📨 Отправляем данные для входа:', loginData);

      const mockResponse = await mockLoginAPI(loginData);
      
      if (mockResponse.success) {
        // ✅ УСПЕШНЫЙ ВХОД
        console.log('✅ Вход успешен:', mockResponse);
        
        // 🔐 СОХРАНЯЕМ ТОКЕН И ВХОДИМ ЧЕРЕЗ ХУК
        login(mockResponse.token, mockResponse.user);
        
        setSuccessMessage(mockResponse.message); // 🔥 Устанавливаем сообщение
        
        // 🎯 ПЕРЕНАПРАВЛЕНИЕ НА ГЛАВНУЮ
        setTimeout(() => {
          console.log('🔄 Перенаправляем на главную страницу...');
          window.location.href = '/';
        }, 1500);

      } else {
        setErrors({ submit: mockResponse.message });
      }

    } catch (error) {
      console.error('🚫 Ошибка:', error);
      setErrors({ submit: 'Ошибка соединения с сервером' });
    } finally {
      setIsLoading(false);
    }
  };

  // 🟢 ФУНКЦИЯ-ЗАГЛУШКА ДЛЯ ТЕСТИРОВАНИЯ ВХОДА
  const mockLoginAPI = (loginData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Тестовые данные для демонстрации
        const testUsers = [
          { email: 'test@mail.ru', password: '123456' },
          { email: 'user@example.com', password: 'password' }
        ];

        const foundUser = testUsers.find(
          user => user.email === loginData.email && user.password === loginData.password
        );

        if (foundUser) {
          // Успешный вход
          resolve({
            success: true,
            message: `Добро пожаловать, ${loginData.email}!`,
            token: 'mock_jwt_token_' + Date.now(), // Заглушка токена
            user: {
              id: 1,
              email: loginData.email,
              firstName: 'Тестовый',
              lastName: 'Пользователь'
            }
          });
        } else {
          // Неверные данные
          resolve({
            success: false,
            message: 'Неверный email или пароль'
          });
        }
      }, 1000); // Имитация задержки сети
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {successMessage && ( // 🔥 Теперь переменная определена
        <div className={styles.successMessage}>
          ✅ {successMessage}
        </div>
      )}

      <div className={styles.inputGroup}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          className={`${styles.input} ${errors.email ? styles.error : ''}`}
          value={formData.email}
          onChange={handleChange}
          placeholder="Введите ваш email"
          required
          disabled={isLoading}
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
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