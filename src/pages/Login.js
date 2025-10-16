import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm/RegisterForm';
import styles from './Login.module.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.logo}>
          <h2>Мой Сайт</h2>
        </div>
        
        <div className={styles.card}>
          <h1 className={styles.title}>
            {isLogin ? 'Войти' : 'Создать аккаунт'}
          </h1>
          <p className={styles.subtitle}>
            {isLogin ? 'Продолжить работу с Мой Сайт' : 'Зарегистрироваться в Мой Сайт'}
          </p>

          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;