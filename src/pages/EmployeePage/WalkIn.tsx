import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonToast,
  IonText,
} from '@ionic/react';
import EmployeeHeader from '../../components/EmployeeComponents/Layout/Header';
import { WalkInForm } from '../../components/EmployeeComponents/forms';

const WalkIn: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const dailyRate = 100;

  const handleCheckIn = () => {
    if (!formData.name || !formData.phone) {
      setToastMessage('Please fill in all fields');
      setShowToast(true);
      return;
    }

    // Mock check-in - replace with actual API call
    setToastMessage(`Walk-in registered! ${formData.name} checked in successfully.`);
    setShowToast(true);
    setFormData({ name: '', phone: '' });
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

            <WalkInForm
              formData={formData}
              onChange={setFormData}
              dailyRate={dailyRate}
            />

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
