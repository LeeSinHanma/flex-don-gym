import React from 'react';
import { IonLabel, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import './EmployeeForm.css';

interface EmployeeFormData {
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive' | 'on-leave';
  phone: string;
  hireDate: string;
}

interface EmployeeFormProps {
  formData: EmployeeFormData;
  onChange: (data: EmployeeFormData) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ formData, onChange }) => {
  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="form-container">
      <div className="form-group">
        <IonLabel className="form-label">Full Name *</IonLabel>
        <IonInput
          value={formData.name}
          onIonInput={(e) => handleInputChange('name', e.detail.value!)}
          placeholder="Enter employee name"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <IonLabel className="form-label">Role *</IonLabel>
        <IonInput
          value={formData.role}
          onIonInput={(e) => handleInputChange('role', e.detail.value!)}
          placeholder="e.g., Manager, Trainer, Receptionist"
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
        <IonLabel className="form-label">Phone Number</IonLabel>
        <IonInput
          type="tel"
          value={formData.phone}
          onIonInput={(e) => handleInputChange('phone', e.detail.value!)}
          placeholder="Enter phone number"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <IonLabel className="form-label">Status *</IonLabel>
        <IonSelect
          value={formData.status}
          onIonChange={(e) => handleInputChange('status', e.detail.value)}
          className="form-select"
        >
          <IonSelectOption value="active">Active</IonSelectOption>
          <IonSelectOption value="inactive">Inactive</IonSelectOption>
          <IonSelectOption value="on-leave">On Leave</IonSelectOption>
        </IonSelect>
      </div>

      <div className="form-group">
        <IonLabel className="form-label">Hire Date</IonLabel>
        <IonInput
          type="date"
          value={formData.hireDate}
          onIonInput={(e) => handleInputChange('hireDate', e.detail.value!)}
          className="form-input"
        />
      </div>
    </div>
  );
};

export default EmployeeForm;
