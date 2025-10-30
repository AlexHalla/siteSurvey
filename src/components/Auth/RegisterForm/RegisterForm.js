import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import { useAuth } from '../../../hooks/useAuth';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    consent: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
    
    // Очищаем сообщение об успехе при новом вводе
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    }

    // Either email or phone must be provided
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.contact = 'Необходимо указать email или номер телефона';
    }

    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (formData.phone.trim() && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен быть не менее 8 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.consent) {
      newErrors.consent = 'Необходимо согласиться с пользовательским соглашением';
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
      console.log('📨 Отправляем данные:', { 
        username: formData.username, 
        email: formData.email || null, 
        phone: formData.phone || null, 
        password: formData.password 
      });

      const result = await register(
        formData.username, 
        formData.password, 
        formData.email || null, 
        formData.phone || null
      );

      if (result.success) {
        // ✅ УСПЕШНАЯ РЕГИСТРАЦИЯ
        console.log('✅ Регистрация успешна:', result);
        
        if (result.requiresVerification) {
          setSuccessMessage('Регистрация успешна! Проверьте ваш email для подтверждения.');
        } else {
          setSuccessMessage('Регистрация успешна! Добро пожаловать!');
          
          // Сброс формы
          setFormData({
            username: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
          
          // РЕДИРЕКТ
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }

      } else {
        // ❌ ОШИБКА ОТ СЕРВЕРА
        console.log('❌ Ошибка регистрации:', result);
        
        // Обработка разных типов ошибок
        if (result.error && result.error.toLowerCase().includes('email')) {
          setErrors({ 
            email: result.error,
            submit: result.error 
          });
        } else if (result.error && result.error.toLowerCase().includes('пароль')) {
          setErrors({ 
            password: result.error,
            submit: result.error 
          });
        } else {
          setErrors({ 
            submit: result.error || 'Произошла ошибка при регистрации' 
          });
        }
      }

    } catch (error) {
      // ❌ ОШИБКА СЕТЯ ИЛИ ПАРСИНГА
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

      <div className={styles.inputGroup}>
        <label className={styles.label}>Имя пользователя</label>
        <input
          type="text"
          name="username"
          className={`${styles.input} ${errors.username ? styles.error : ''}`}
          value={formData.username}
          onChange={handleChange}
          placeholder="Введите имя пользователя"
          required
          disabled={isLoading}
        />
        {errors.username && <span className={styles.errorText}>{errors.username}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Email (опционально)</label>
        <input
          type="email"
          name="email"
          className={`${styles.input} ${errors.email ? styles.error : ''}`}
          value={formData.email}
          onChange={handleChange}
          placeholder="Введите ваш email"
          disabled={isLoading}
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Телефон (опционально)</label>
        <input
          type="tel"
          name="phone"
          className={`${styles.input} ${errors.phone ? styles.error : ''}`}
          value={formData.phone}
          onChange={handleChange}
          placeholder="Введите номер телефона"
          disabled={isLoading}
        />
        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
      </div>

      {(errors.contact) && <span className={styles.errorText}>{errors.contact}</span>}

      <div className={styles.inputGroup}>
        <label className={styles.label}>Пароль</label>
        <input
          type="password"
          name="password"
          className={`${styles.input} ${errors.password ? styles.error : ''}`}
          value={formData.password}
          onChange={handleChange}
          placeholder="Создайте пароль (минимум 8 символов)"
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
        <div className={styles.inputGroup}>
          <label className={styles.consentLabel}>
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={(e) => {
                setFormData(prevData => ({
                  ...prevData,
                  consent: e.target.checked
                }));
                // Очищаем ошибку при изменении поля
                if (errors.consent) {
                  setErrors(prevErrors => ({
                    ...prevErrors,
                    consent: ''
                  }));
                }
              }}
              className={styles.consentCheckbox}
            />
            Я согласен с <a href="#" className={styles.consentLink}>пользовательским соглашением</a>
          </label>
          {errors.consent && <span className={styles.consentError}>{errors.consent}</span>}
        </div>
        
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