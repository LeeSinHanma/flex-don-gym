import React from 'react';
import { IonCard, IonCardContent, IonIcon, IonText } from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import './CheckInCountCard.css';

interface CheckInCountCardProps {
  count: number;
  className?: string;
}

const CheckInCountCard: React.FC<CheckInCountCardProps> = ({ count, className = '' }) => {
  return (
    <IonCard className={`checkin-count-card ${className}`}>
      <IonCardContent>
        <div className="count-display">
          <IonIcon icon={timeOutline} className="count-icon" />
          <div className="count-info">
            <IonText className="count-label">Today's Check-ins</IonText>
            <IonText className="count-number">{count}</IonText>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default CheckInCountCard;
