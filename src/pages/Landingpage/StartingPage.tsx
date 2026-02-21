import React, { useEffect } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './StartingPage.css';

const StartingPage: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      if (role === 'admin') {
        history.push('/admin/dashboard');
      } else if (role === 'employee') {
        history.push('/employee/dashboard');
      }
    }
  }, [isAuthenticated, role, history]);

  const handleGetStarted = () => {
    history.push('/menu-admin');
  };

  return (
    <IonPage>
      <IonContent className="starting-page" fullscreen>
        <div className="splash-container">
          <div className="logo-section">
            <img src="/logo.png" alt="Flex Don Gym Logo" className="app-logo" />
            <h1 className="app-title">Flex Don Gym</h1>
            <p className="app-tagline">Your Fitness, Our Priority</p>
          </div>
          
          <div className="cta-section">
            <IonButton
              expand="block"
              size="large"
              onClick={handleGetStarted}
              className="get-started-btn"
            >
              Get Started
            </IonButton>
            <p className="version-text">Version 1.0.0</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StartingPage;
