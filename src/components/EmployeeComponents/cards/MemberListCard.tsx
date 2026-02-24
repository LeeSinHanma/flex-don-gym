import React from 'react';
import { IonCard, IonItem, IonLabel, IonBadge, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline, timeOutline, closeCircleOutline } from 'ionicons/icons';
import './MemberListCard.css';

interface MemberListCardProps {
  member: {
    id: string;
    name: string;
    membershipType: string;
    status: 'active' | 'expiring-soon' | 'expired';
    expiryDate: string;
  };
  onRenew?: () => void;
  showRenewButton?: boolean;
}

const MemberListCard: React.FC<MemberListCardProps> = ({
  member,
  onRenew,
  showRenewButton = false,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return checkmarkCircleOutline;
      case 'expiring-soon':
        return timeOutline;
      case 'expired':
        return closeCircleOutline;
      default:
        return checkmarkCircleOutline;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expiring-soon':
        return 'warning';
      case 'expired':
        return 'danger';
      default:
        return 'medium';
    }
  };

  return (
    <IonCard className="member-list-card">
      <IonItem lines="none">
        <IonIcon
          icon={getStatusIcon(member.status)}
          slot="start"
          color={getStatusColor(member.status)}
          style={{ fontSize: '32px' }}
        />
        <IonLabel>
          <h2 style={{ fontWeight: 'bold', color: '#1B2E4B' }}>{member.name}</h2>
          <p>ID: {member.id} | {member.membershipType}</p>
          <p>Expires: {member.expiryDate}</p>
        </IonLabel>
        <IonBadge color={getStatusColor(member.status)} slot="end">
          {member.status.replace('-', ' ').toUpperCase()}
        </IonBadge>
      </IonItem>
    </IonCard>
  );
};

export default MemberListCard;
