import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonIcon } from '@ionic/react';
import { checkmarkCircle, closeCircle, warningOutline } from 'ionicons/icons';
import './MemberStatus.css';

export type MembershipStatus = 'active' | 'expired' | 'expiring-soon';

interface MemberStatusCardProps {
  memberName: string;
  memberId: string;
  membershipType: string;
  expiryDate: string;
  status: MembershipStatus;
  className?: string;
}

const MemberStatusCard: React.FC<MemberStatusCardProps> = ({
  memberName,
  memberId,
  membershipType,
  expiryDate,
  status,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          color: 'success',
          icon: checkmarkCircle,
          text: 'Active',
          cardClass: 'status-card-active',
        };
      case 'expired':
        return {
          color: 'danger',
          icon: closeCircle,
          text: 'Expired',
          cardClass: 'status-card-expired',
        };
      case 'expiring-soon':
        return {
          color: 'warning',
          icon: warningOutline,
          text: 'Expiring Soon',
          cardClass: 'status-card-warning',
        };
      default:
        return {
          color: 'medium',
          icon: closeCircle,
          text: 'Unknown',
          cardClass: '',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <IonCard className={`member-status-card ${statusConfig.cardClass} ${className}`}>
      <IonCardHeader>
        <div className="status-header">
          <IonCardTitle>{memberName}</IonCardTitle>
          <IonBadge color={statusConfig.color} className="status-badge">
            <IonIcon icon={statusConfig.icon} />
            <span>{statusConfig.text}</span>
          </IonBadge>
        </div>
        <p className="member-id">ID: {memberId}</p>
      </IonCardHeader>
      <IonCardContent>
        <div className="status-details">
          <div className="detail-item">
            <span className="detail-label">Membership:</span>
            <span className="detail-value">{membershipType}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Expires:</span>
            <span className="detail-value">{expiryDate}</span>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default MemberStatusCard;
