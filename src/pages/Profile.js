import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/Profile/ProfileForm';

const Profile = () => {
  const { user } = useAuth();
  const [background, setBackground] = useState(null);

  useEffect(() => {
    // Load saved background from localStorage
    const savedBackground = localStorage.getItem('profileBackground');
    if (savedBackground) {
      setBackground(savedBackground);
    }

    // Listen for background change events
    const handleBackgroundChange = (event) => {
      setBackground(event.detail);
    };

    window.addEventListener('backgroundChange', handleBackgroundChange);

    // Cleanup event listener
    return () => {
      window.removeEventListener('backgroundChange', handleBackgroundChange);
    };
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundImage: background ? `url(/assets/${background})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <ProfileForm user={user} />
    </div>
  );
};

export default Profile;