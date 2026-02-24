import React from 'react';
import { IonCard, IonCardContent, IonText, IonIcon } from '@ionic/react';
import './EmptyStateCard.css';

interface EmptyStateCardProps {
  message: string;
  icon?: string;
  className?: string;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  message,
  icon,
  className = '',
}) => {
  return (
    <IonCard className={`empty-state-card ${className}`}>
      <IonCardContent>
        {icon && (
          <IonIcon
            icon={icon}
            className="empty-state-icon"
          />
        )}
        <IonText className="empty-state-text">
          {message}
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default EmptyStateCard;
