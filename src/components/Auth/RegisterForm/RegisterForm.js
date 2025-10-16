import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import { useAuth } from '../../../hooks/useAuth'; // 🔥 ДОБАВИЛИ ИМПОРТ ХУКА

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth(); // 🔥 ИСПОЛЬЗУЕМ ХУК АВТОРИЗАЦИИ

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Очищаем ошибку при изменении поля
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    // Очищаем сообщение об успехе при новом вводе
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    return newErrors;
  };

  // 🟢 ФУНКЦИЯ-ЗАГЛУШКА ДЛЯ ТЕСТИРОВАНИЯ (если бэкенд не готов)
  const mockRegisterAPI = (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Имитация успешной регистрации
        resolve({
          success: true,
          message: `Регистрация успешна! Добро пожаловать, ${userData.firstName}!`,
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: Date.now(),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName
          }
        });
      }, 1000);
    });
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
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password
      };

      console.log('📨 Отправляем данные:', userData);

      // 🟢 ВРЕМЕННО ИСПОЛЬЗУЕМ ЗАГЛУШКУ (когда бэкенд готов - закомментируйте эту строку)
      const result = await mockRegisterAPI(userData);

      // 🔥 КОГДА БЭКЕНД ГОТОВ - РАСКОММЕНТИРУЙТЕ ЭТОТ БЛОК:
      /*
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      console.log('📩 Ответ сервера:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      const result = await response.json();
      console.log('📊 Данные ответа:', result);
      */

      // ОБРАБОТКА ОТВЕТА ОТ СЕРВЕРА
      if (result.success) { // 🔥 ИЗМЕНИЛИ УСЛОВИЕ (response.ok && result.success → result.success)
        // ✅ УСПЕШНАЯ РЕГИСТРАЦИЯ
        console.log('✅ Регистрация успешна:', result);
        
        // 🔐 СОХРАНЯЕМ ТОКЕН И ВХОДИМ ЧЕРЕЗ ХУК
        if (result.token) {
          login(result.token, result.user); // 🔥 ВХОДИМ В СИСТЕМУ
        }
        
        setSuccessMessage(result.message || 'Регистрация успешна!');
        
        // Сброс формы
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // РЕДИРЕКТ
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);

      } else {
        // ❌ ОШИБКА ОТ СЕРВЕРА
        console.log('❌ Ошибка регистрации:', result);
        
        // Обработка разных типов ошибок
        if (result.message && result.message.toLowerCase().includes('email')) {
          setErrors({ 
            email: result.message,
            submit: result.message 
          });
        } else if (result.message && result.message.toLowerCase().includes('пароль')) {
          setErrors({ 
            password: result.message,
            submit: result.message 
          });
        } else {
          setErrors({ 
            submit: result.message || 'Произошла ошибка при регистрации' 
          });
        }
      }

    } catch (error) {
      // ❌ ОШИБКА СЕТИ ИЛИ ПАРСИНГА
      console.error('🚫 Сетевая ошибка:', error);
      setErrors({ 
        submit: 'Ошибка соединения с сервером. Проверьте интернет и попробуйте снова.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Сообщение об успехе */}
      {successMessage && (
        <div className={styles.successMessage}>
          ✅ {successMessage}
        </div>
      )}

      <div className={styles.nameFields}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Имя</label>
          <input
            type="text"
            name="firstName"
            className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Имя"
            required
            disabled={isLoading}
          />
          {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Фамилия</label>
          <input
            type="text"
            name="lastName"
            className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Фамилия"
            required
            disabled={isLoading}
          />
          {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
        </div>
      </div>

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
          placeholder="Создайте пароль"
          required
          disabled={isLoading}
        />
        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Подтвердите пароль</label>
        <input
          type="password"
          name="confirmPassword"
          className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Повторите пароль"
          required
          disabled={isLoading}
        />
        {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
      </div>

      {/* Общая ошибка формы */}
      {errors.submit && (
        <div className={styles.submitError}>❌ {errors.submit}</div>
      )}

      <div className={styles.options}>
        <button 
          type="button" 
          className={styles.link} 
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Уже есть аккаунт? Войти
        </button>
      </div>

      <div className={styles.buttons}>
        <button 
          type="submit" 
          className={styles.registerButton}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Регистрация...' : 'Создать аккаунт'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;