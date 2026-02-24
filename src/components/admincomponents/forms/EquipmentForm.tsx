import React from 'react';
import { IonItem, IonLabel, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import './EquipmentForm.css';

interface EquipmentFormData {
  name: string;
  status: "working" | "maintenance" | "broken";
  lastMaintenance: string;
  notes: string;
}

interface EquipmentFormProps {
  formData: EquipmentFormData;
  onChange: (data: EquipmentFormData) => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ formData, onChange }) => {
  const handleChange = (field: keyof EquipmentFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="equipment-form">
      <IonItem>
        <IonLabel position="stacked">Equipment Name *</IonLabel>
        <IonInput
          value={formData.name}
          onIonChange={(e) => handleChange('name', e.detail.value!)}
          placeholder="Enter equipment name"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Status *</IonLabel>
        <IonSelect
          value={formData.status}
          onIonChange={(e) => handleChange('status', e.detail.value)}
        >
          <IonSelectOption value="working">Working</IonSelectOption>
          <IonSelectOption value="maintenance">Maintenance</IonSelectOption>
          <IonSelectOption value="broken">Broken</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Last Maintenance Date *</IonLabel>
        <IonInput
          type="date"
          value={formData.lastMaintenance}
          onIonChange={(e) => handleChange('lastMaintenance', e.detail.value!)}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Notes</IonLabel>
        <IonInput
          value={formData.notes}
          onIonChange={(e) => handleChange('notes', e.detail.value!)}
          placeholder="Additional notes"
        />
      </IonItem>
    </div>
  );
};

export default EquipmentForm;
