import React from 'react';
import { IonItem, IonLabel, IonInput, IonIcon } from '@ionic/react';
import { personOutline } from 'ionicons/icons';

interface UsernameProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

const Username: React.FC<UsernameProps> = ({
  value,
  onChange,
  placeholder = 'Enter username',
  required = false,
  disabled = false,
  error,
}) => {
  return (
    <div>
      <IonItem className={error ? 'ion-invalid' : ''}>
        <IonIcon icon={personOutline} slot="start" color="medium" />
        <IonLabel position="floating">Username {required && '*'}</IonLabel>
        <br></br>
        <IonInput
          type="text"
          value={value}
          onIonInput={(e) => onChange(e.detail.value || '')}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autocomplete="username"
        />
      </IonItem>
      {error && (
        <div style={{ fontSize: '12px', color: 'var(--ion-color-danger)', padding: '4px 16px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Username;
