import React from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import './MemberRegistrationForm.css';

interface MemberRegistrationFormData {
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  paymentMethod?: string;
}

interface MemberRegistrationFormProps {
  formData: MemberRegistrationFormData;
  onChange: (data: MemberRegistrationFormData) => void;
  showPaymentMethod?: boolean;
}

const MemberRegistrationForm: React.FC<MemberRegistrationFormProps> = ({
  formData,
  onChange,
  showPaymentMethod = false,
}) => {
  const handleInputChange = (field: keyof MemberRegistrationFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  const membershipPlans = [
    { value: 'daily', label: 'Daily - ₱100', price: 100 },
    { value: 'weekly', label: 'Weekly - ₱500', price: 500 },
    { value: 'monthly', label: 'Monthly - ₱1,500', price: 1500 },
    { value: 'quarterly', label: 'Quarterly - ₱4,000', price: 4000 },
    { value: 'yearly', label: 'Yearly - ₱15,000', price: 15000 },
  ];

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" sizeMd="6">
          <IonItem>
            <IonLabel position="stacked">Full Name *</IonLabel>
            <IonInput
              value={formData.name}
              onIonChange={(e) => handleInputChange('name', e.detail.value!)}
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
              onIonChange={(e) => handleInputChange('email', e.detail.value!)}
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
              onIonChange={(e) => handleInputChange('phone', e.detail.value!)}
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
              onIonChange={(e) => handleInputChange('membershipType', e.detail.value)}
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

        {showPaymentMethod && (
          <IonCol size="12">
            <IonItem>
              <IonLabel position="stacked">Payment Method *</IonLabel>
              <IonSelect
                value={formData.paymentMethod}
                onIonChange={(e) => handleInputChange('paymentMethod', e.detail.value)}
                placeholder="Select payment method"
              >
                <IonSelectOption value="cash">Cash</IonSelectOption>
                <IonSelectOption value="card">Credit/Debit Card</IonSelectOption>
                <IonSelectOption value="gcash">GCash</IonSelectOption>
                <IonSelectOption value="paymaya">PayMaya</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonCol>
        )}
      </IonRow>
    </IonGrid>
  );
};

export default MemberRegistrationForm;
