import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonToast,
} from '@ionic/react';
import EmployeeHeader from '../../components/EmployeeComponents/Layout/Header';
import { MemberRegistrationForm } from '../../components/EmployeeComponents/forms';

const Prepaid: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: '',
    paymentMethod: '' as string | undefined,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleFormChange = (data: any) => {
    setFormData(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.membershipType || !formData.paymentMethod) {
      setToastMessage('Please fill in all fields');
      setShowToast(true);
      return;
    }

    // Mock registration - replace with actual API call
    setToastMessage(`Member registered successfully! Welcome ${formData.name}`);
    setShowToast(true);
    setFormData({ name: '', email: '', phone: '', membershipType: '', paymentMethod: '' as string | undefined });
  };

  return (
    <IonPage>
      <EmployeeHeader title="Prepaid Registration" />
      <IonContent fullscreen className="ion-padding" style={{ '--background': '#F0F4F8' }}>
        <IonCard>
          <IonCardContent>
            <h2 style={{ color: '#1B2E4B', fontWeight: 'bold', marginBottom: '20px' }}>
              Register New Member
            </h2>

            <form onSubmit={handleSubmit}>
              <MemberRegistrationForm
                formData={formData}
                onChange={handleFormChange}
                showPaymentMethod={true}
              />
              <IonButton expand="block" type="submit" style={{ marginTop: '20px' }}>
                Register Member
              </IonButton>
            </form>
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

export default Prepaid;
