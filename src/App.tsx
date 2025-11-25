import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Articles from './pages/Articles';
import Tests from './pages/Tests';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Profile from './pages/Profile';
import './App.css';

function AppWrapper() {
  const location = useLocation();

  // Выбираем фон в зависимости от маршрута
  let backgroundClass = '';
  switch (location.pathname) {
    case '/':
      backgroundClass = 'homeBackground';
      break;
    case '/login':
      backgroundClass = 'loginBackground';
      break;
    case '/articles':
      backgroundClass = 'articlesBackground';
      break;
    case '/tests':
    case '/tests/constructor':
      backgroundClass = 'testsBackground';
      break;
    case '/profile':
      backgroundClass = 'profileBackground';
      break;
    default:
      // For routes like /tests/take/:id
      if (location.pathname.startsWith('/tests/take/')) {
        backgroundClass = 'testsBackground';
      } else if (location.pathname.startsWith('/tests/')) {
        backgroundClass = 'testsBackground';
      } else {
        backgroundClass = 'defaultBackground';
      }
  }

  return (
    <div className={`App ${backgroundClass}`}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/articles/*" 
            element={
              <ProtectedRoute>
                <Articles />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tests/*" 
            element={
              <ProtectedRoute>
                <Tests />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;