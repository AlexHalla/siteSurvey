import React from 'react';

const Home = () => {
  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        Главная страница
      </h1>
      <p style={{
        fontSize: '1.2rem',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        Добро пожаловать на главную страницу нашего сайта!
      </p>
      
      {/* Mobile styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          div {
            padding: '1.5rem';
          }
          
          h1 {
            font-size: '2rem';
          }
          
          p {
            font-size: '1.1rem';
          }
        }
        
        @media (max-width: 480px) {
          div {
            padding: '1rem';
          }
          
          h1 {
            font-size: '1.7rem';
          }
          
          p {
            font-size: '1rem';
          }
        }
      `}</style>
    </div>
  );
};

export default Home;