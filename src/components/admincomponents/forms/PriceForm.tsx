import React from 'react';
import { IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonToggle } from '@ionic/react';
import './PriceForm.css';

interface PriceFormData {
  type: string;
  price: string;
  description: string;
  duration: string;
  tierType: string;
  promoExpiry: string;
  isActive: boolean;
}

interface PriceFormProps {
  formData: PriceFormData;
  onChange: (data: PriceFormData) => void;
}

const PriceForm: React.FC<PriceFormProps> = ({ formData, onChange }) => {
  const handleChange = (field: keyof PriceFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="price-form">
      <IonItem>
        <IonLabel position="stacked">Membership Type *</IonLabel>
        <IonInput
          value={formData.type}
          onIonChange={(e) => handleChange('type', e.detail.value!)}
          placeholder="e.g., Daily, Weekly, Monthly"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Price (₱) *</IonLabel>
        <IonInput
          type="number"
          value={formData.price}
          onIonChange={(e) => handleChange('price', e.detail.value!)}
          placeholder="0.00"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Description *</IonLabel>
        <IonInput
          value={formData.description}
          onIonChange={(e) => handleChange('description', e.detail.value!)}
          placeholder="Brief description"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Duration *</IonLabel>
        <IonInput
          value={formData.duration}
          onIonChange={(e) => handleChange('duration', e.detail.value!)}
          placeholder="e.g., 1 day, 1 week, 1 month"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Tier Type *</IonLabel>
        <IonSelect
          value={formData.tierType}
          onIonChange={(e) => handleChange('tierType', e.detail.value)}
        >
          <IonSelectOption value="standard">Standard</IonSelectOption>
          <IonSelectOption value="promo">Promo</IonSelectOption>
        </IonSelect>
      </IonItem>

      {formData.tierType === 'promo' && (
        <IonItem>
          <IonLabel position="stacked">Promo Expiry Date *</IonLabel>
          <IonInput
            type="date"
            value={formData.promoExpiry}
            onIonChange={(e) => handleChange('promoExpiry', e.detail.value!)}
          />
        </IonItem>
      )}

      <IonItem>
        <IonLabel>Active</IonLabel>
        <IonToggle
          checked={formData.isActive}
          onIonChange={(e) => handleChange('isActive', e.detail.checked)}
        />
      </IonItem>
    </div>
  );
};

export default PriceForm;
