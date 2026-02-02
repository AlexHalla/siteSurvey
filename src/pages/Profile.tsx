import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileForm from '../components/Profile/ProfileForm';
import { User } from '../types';

interface BackgroundChangeEvent extends CustomEvent {
  detail: string;
}

const Profile: React.FC = () => {
  const { user, getProfile, isLoading } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(user || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [background, setBackground] = useState<string | null>(null);

  useEffect(() => {
    // Load saved background from localStorage
    const savedBackground = localStorage.getItem('profileBackground');
    if (savedBackground) {
      setBackground(savedBackground);
    }

    // Listen for background change events
    const handleBackgroundChange = (event: BackgroundChangeEvent) => {
      setBackground(event.detail as string);
    };

    window.addEventListener('backgroundChange', handleBackgroundChange as EventListener);

    // Cleanup event listener
    return () => {
      window.removeEventListener('backgroundChange', handleBackgroundChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfileUser(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
        if (user) {
          setProfileUser(user);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) {
      loadProfile();
    }
  }, [isLoading]); 

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(60, 30, 100, 0.8)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Загрузка профиля...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundImage: background ? `url(${background})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <ProfileForm user={profileUser as User} />
    </div>
  );
};

export default Profile;