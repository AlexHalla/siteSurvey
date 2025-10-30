import React from 'react';

const Tests: React.FC = () => {
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
        Тесты
      </h1>
      <p style={{
        fontSize: '1.2rem',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        Здесь будут доступны тесты.
      </p>
      
      {/* Mobile styles */}
      <style>{`
        @media (max-width: 768px) {
          div {
            padding: 1.5rem;
          }
          
          h1 {
            font-size: 2rem;
          }
          
          p {
            font-size: 1.1rem;
          }
        }
        
        @media (max-width: 480px) {
          div {
            padding: 1rem;
          }
          
          h1 {
            font-size: 1.7rem;
          }
          
          p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Tests;