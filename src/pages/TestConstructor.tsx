import React from 'react';
import TestConstructorForm from '../components/Tests/TestConstructor';

const TestConstructorPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 100px)',
      overflowY: 'auto'
    }}>
      <TestConstructorForm />
    </div>
  );
};

export default TestConstructorPage;