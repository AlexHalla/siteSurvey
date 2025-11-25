import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TestForm from '../components/Tests/TestForm';
import TestTakingPage from './TestTaking';
import TestConstructorPage from './TestConstructor';

const Tests: React.FC = () => {
  return (
    <div style={{ 
      padding: '0',
      maxWidth: '100%',
      margin: '0',
      minHeight: 'calc(100vh - 100px)',
      overflowY: 'auto'
    }}>
      <Routes>
        <Route path="/" element={<TestForm />} />
        <Route path="/take" element={<Navigate to="/" replace />} />
        <Route path="/take/:id" element={<TestTakingPage />} />
        <Route path="/constructor" element={<TestConstructorPage />} />
        <Route path="/constructor/:id" element={<TestConstructorPage />} />
      </Routes>
    </div>
  );
};

export default Tests;