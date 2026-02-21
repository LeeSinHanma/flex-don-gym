import React, { useState } from 'react';
import { IonItem, IonLabel, IonInput, IonIcon, IonButton } from '@ionic/react';
import { lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

interface PasswordProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

const Password: React.FC<PasswordProps> = ({
  value,
  onChange,
  placeholder = 'Enter password',
  label = 'Password',
  required = false,
  disabled = false,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <IonItem className={error ? 'ion-invalid' : ''}>
        <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
        <IonLabel position="floating">{label} {required && '*'}</IonLabel>
        <br></br>
        <IonInput
          type={showPassword ? 'text' : 'password'}
          value={value}
          onIonInput={(e) => onChange(e.detail.value || '')}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autocomplete="current-password"
        />
        <IonButton 
          fill="clear" 
          slot="end" 
          onClick={() => setShowPassword(!showPassword)}
          style={{ marginTop: '20px' }}
        >
          <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} color="medium" />
        </IonButton>
      </IonItem>
      {error && (
        <div style={{ fontSize: '12px', color: 'var(--ion-color-danger)', padding: '4px 16px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Password;
