import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Articles from './pages/Articles';
import Tests from './pages/Tests';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';
import Profile from './pages/Profile';
import { ROUTES } from './config/routes';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route 
              path={ROUTES.ARTICLES} 
              element={
                <ProtectedRoute>
                  <Articles />
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.TESTS} 
              element={
                <ProtectedRoute>
                  <Tests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.PROFILE} 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;