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