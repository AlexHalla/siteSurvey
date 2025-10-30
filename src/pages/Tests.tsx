import React from 'react';
import TestForm from '../components/Tests/TestForm';

const Tests: React.FC = () => {
  return (
    <div style={{ 
      padding: '0',
      maxWidth: '100%',
      margin: '0',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <TestForm />
    </div>
  );
};

export default Tests;
