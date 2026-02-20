import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface BackButtonProps {
  text?: string;
  defaultHref?: string;
  color?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  text = 'Back', 
  defaultHref,
  color = 'primary',
  className = ''
}) => {
  const history = useHistory();

  const handleBack = () => {
    if (defaultHref) {
      history.push(defaultHref);
    } else {
      history.goBack();
    }
  };

  return (
    <IonButton 
      fill="clear" 
      color={color}
      onClick={handleBack}
      className={className}
    >
      <IonIcon slot="start" icon={arrowBack} />
      {text}
    </IonButton>
  );
};

export default BackButton;
