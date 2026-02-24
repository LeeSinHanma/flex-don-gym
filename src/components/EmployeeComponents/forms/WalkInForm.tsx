import React from 'react';
import { IonItem, IonLabel, IonInput } from '@ionic/react';
import './WalkInForm.css';

interface WalkInFormData {
  name: string;
  phone: string;
}

interface WalkInFormProps {
  formData: WalkInFormData;
  onChange: (data: WalkInFormData) => void;
  dailyRate?: number;
}

const WalkInForm: React.FC<WalkInFormProps> = ({
  formData,
  onChange,
  dailyRate = 100,
}) => {
  const handleInputChange = (field: keyof WalkInFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="walkin-form">
      <div
        style={{
          background: 'linear-gradient(135deg, #2E86DE 0%, #1B2E4B 100%)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Daily Rate</p>
        <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
          ₱{dailyRate}
        </h1>
      </div>

      <IonItem>
        <IonLabel position="stacked">Full Name *</IonLabel>
        <IonInput
          value={formData.name}
          onIonChange={(e) => handleInputChange('name', e.detail.value!)}
          placeholder="Enter guest name"
          required
        />
      </IonItem>

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
    </div>
  );
};

export default WalkInForm;
