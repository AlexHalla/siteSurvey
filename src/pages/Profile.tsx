import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/Profile/ProfileForm';
import { User } from '../types';

interface BackgroundChangeEvent extends CustomEvent {
  detail: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [background, setBackground] = useState<string | null>(null);

  useEffect(() => {
    // Load saved background from localStorage
    const savedBackground = localStorage.getItem('profileBackground');
    if (savedBackground) {
      setBackground(savedBackground);
    }

    // Listen for background change events
    const handleBackgroundChange = (event: BackgroundChangeEvent) => {
      setBackground(event.detail);
    };

    window.addEventListener('backgroundChange', handleBackgroundChange as EventListener);

    // Cleanup event listener
    return () => {
      window.removeEventListener('backgroundChange', handleBackgroundChange as EventListener);
    };
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundImage: background ? `url(${background})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <ProfileForm user={user as User} />
    </div>
  );
};

export default Profile;