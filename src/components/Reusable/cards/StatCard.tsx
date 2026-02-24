import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import './StatCard.css';

type StatType = 'primary' | 'success' | 'warning' | 'revenue';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  type?: StatType;
  iconColor?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  type = 'primary',
  iconColor,
  className = '',
}) => {
  const getDefaultIconColor = () => {
    switch (type) {
      case 'primary':
        return '#1B2E4B';
      case 'success':
        return '#2ECC71';
      case 'warning':
        return '#F39C12';
      case 'revenue':
        return '#2ECC71';
      default:
        return '#1B2E4B';
    }
  };

  return (
    <IonCard className={`stat-card ${className}`}>
      <IonCardContent>
        <div className={`stat-icon-wrapper ${type}`}>
          <IonIcon
            icon={icon}
            style={{
              fontSize: '32px',
              color: iconColor || getDefaultIconColor(),
              display: 'block',
            }}
          />
        </div>
        <div className="stat-content">
          <h3 className="stat-value">{value}</h3>
          <p className="stat-label">{label}</p>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default StatCard;
