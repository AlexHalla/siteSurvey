import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import TestTakingForm from '../components/Tests/TestTaking';

const TestTakingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // If no ID is provided, redirect to tests list
  if (!id) {
    return <Navigate to="/tests" replace />;
  }
  
  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 100px)',
      overflowY: 'auto'
    }}>
      <TestTakingForm />
    </div>
  );
};

export default TestTakingPage;