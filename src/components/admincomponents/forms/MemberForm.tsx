import React from 'react';
import { IonLabel, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import './MemberForm.css';

interface MemberFormData {
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  joinDate: string;
}

interface MemberFormProps {
  formData: MemberFormData;
  onChange: (data: MemberFormData) => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ formData, onChange }) => {
  const handleInputChange = (field: keyof MemberFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="form-container">
      <div className="form-group">
        <IonLabel className="form-label">Full Name *</IonLabel>
        <IonInput
          value={formData.name}
          onIonInput={(e) => handleInputChange('name', e.detail.value!)}
          placeholder="Enter full name"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <IonLabel className="form-label">Email *</IonLabel>
        <IonInput
          type="email"
          value={formData.email}
          onIonInput={(e) => handleInputChange('email', e.detail.value!)}
          placeholder="Enter email address"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <IonLabel className="form-label">Phone Number *</IonLabel>
        <IonInput
          type="tel"
          value={formData.phone}
          onIonInput={(e) => handleInputChange('phone', e.detail.value!)}
          placeholder="Enter phone number"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <IonLabel className="form-label">Membership Type *</IonLabel>
        <IonSelect
          value={formData.membershipType}
          onIonChange={(e) => handleInputChange('membershipType', e.detail.value)}
          className="form-select"
        >
          <IonSelectOption value="monthly">Monthly</IonSelectOption>
          <IonSelectOption value="quarterly">Quarterly</IonSelectOption>
          <IonSelectOption value="annual">Annual</IonSelectOption>
          <IonSelectOption value="weekly">Weekly</IonSelectOption>
        </IonSelect>
      </div>

      <div className="form-group">
        <IonLabel className="form-label">Join Date *</IonLabel>
        <IonInput
          type="date"
          value={formData.joinDate}
          onIonInput={(e) => handleInputChange('joinDate', e.detail.value!)}
          className="form-input"
        />
      </div>
    </div>
  );
};

export default MemberForm;
