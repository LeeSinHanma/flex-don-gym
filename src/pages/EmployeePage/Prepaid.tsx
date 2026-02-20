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
  IonSelect,
  IonSelectOption,
  IonToast,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import EmployeeHeader from '../../components/EmployeeComponents/Layout/Header';

const Prepaid: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: '',
    paymentMethod: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const membershipPlans = [
    { value: 'daily', label: 'Daily - ₱100', price: 100 },
    { value: 'weekly', label: 'Weekly - ₱500', price: 500 },
    { value: 'monthly', label: 'Monthly - ₱1,500', price: 1500 },
    { value: 'quarterly', label: 'Quarterly - ₱4,000', price: 4000 },
    { value: 'yearly', label: 'Yearly - ₱15,000', price: 15000 },
  ];

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
    setFormData({ name: '', email: '', phone: '', membershipType: '', paymentMethod: '' });
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
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Full Name *</IonLabel>
                      <IonInput
                        value={formData.name}
                        onIonChange={(e) => setFormData({ ...formData, name: e.detail.value! })}
                        placeholder="Enter full name"
                        required
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Email *</IonLabel>
                      <IonInput
                        type="email"
                        value={formData.email}
                        onIonChange={(e) => setFormData({ ...formData, email: e.detail.value! })}
                        placeholder="Enter email"
                        required
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Phone Number *</IonLabel>
                      <IonInput
                        type="tel"
                        value={formData.phone}
                        onIonChange={(e) => setFormData({ ...formData, phone: e.detail.value! })}
                        placeholder="+63 917 123 4567"
                        required
                      />
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Membership Plan *</IonLabel>
                      <IonSelect
                        value={formData.membershipType}
                        onIonChange={(e) => setFormData({ ...formData, membershipType: e.detail.value })}
                        placeholder="Select plan"
                      >
                        {membershipPlans.map((plan) => (
                          <IonSelectOption key={plan.value} value={plan.value}>
                            {plan.label}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                  </IonCol>

                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="stacked">Payment Method *</IonLabel>
                      <IonSelect
                        value={formData.paymentMethod}
                        onIonChange={(e) => setFormData({ ...formData, paymentMethod: e.detail.value })}
                        placeholder="Select payment method"
                      >
                        <IonSelectOption value="cash">Cash</IonSelectOption>
                        <IonSelectOption value="card">Credit/Debit Card</IonSelectOption>
                        <IonSelectOption value="gcash">GCash</IonSelectOption>
                        <IonSelectOption value="paymaya">PayMaya</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>

                  <IonCol size="12">
                    <IonButton expand="block" type="submit" style={{ marginTop: '20px' }}>
                      Register Member
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
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
