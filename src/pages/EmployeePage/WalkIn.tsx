import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonToast,
  IonText,
} from '@ionic/react';
import EmployeeHeader from '../../components/EmployeeComponents/Layout/Header';

const WalkIn: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const dailyRate = 100;

  const handleCheckIn = () => {
    if (!name || !phone) {
      setToastMessage('Please fill in all fields');
      setShowToast(true);
      return;
    }

    // Mock check-in - replace with actual API call
    setToastMessage(`Walk-in registered! ${name} checked in successfully.`);
    setShowToast(true);
    setName('');
    setPhone('');
  };

  return (
    <IonPage>
      <EmployeeHeader title="Walk-In Registration" />
      <IonContent fullscreen className="ion-padding" style={{ '--background': '#F0F4F8' }}>
        <IonCard>
          <IonCardContent>
            <h2 style={{ color: '#1B2E4B', fontWeight: 'bold', marginBottom: '20px' }}>
              Daily Walk-In Entry
            </h2>

            <div style={{ 
              background: 'linear-gradient(135deg, #2E86DE 0%, #1B2E4B 100%)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              textAlign: 'center',
              color: 'white'
            }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Daily Rate</p>
              <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>₱{dailyRate}</h1>
            </div>

            <IonItem>
              <IonLabel position="stacked">Full Name *</IonLabel>
              <IonInput
                value={name}
                onIonChange={(e) => setName(e.detail.value!)}
                placeholder="Enter guest name"
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Phone Number *</IonLabel>
              <IonInput
                type="tel"
                value={phone}
                onIonChange={(e) => setPhone(e.detail.value!)}
                placeholder="+63 917 123 4567"
                required
              />
            </IonItem>

            <IonButton expand="block" onClick={handleCheckIn} style={{ marginTop: '24px' }}>
              Check In & Collect Payment
            </IonButton>

            <IonText color="medium">
              <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
                Walk-in members have access for today only. No QR code will be generated.
              </p>
            </IonText>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default WalkIn;
