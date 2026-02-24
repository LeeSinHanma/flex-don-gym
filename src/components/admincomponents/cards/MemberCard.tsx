import React from 'react';
import {
  IonItem,
  IonLabel,
  IonAvatar,
  IonIcon,
  IonBadge,
  IonButton,
} from '@ionic/react';
import {
  personOutline,
  mailOutline,
  callOutline,
  qrCodeOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import './MemberCard.css';

interface MemberCardProps {
  member: {
    id: number;
    name: string;
    email: string;
    phone: string;
    membershipType: string;
    status: 'Active' | 'Inactive' | 'Expired';
    expiryDate: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onGenerateQR: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onEdit,
  onDelete,
  onGenerateQR,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Expired':
        return 'danger';
      case 'Inactive':
        return 'warning';
      default:
        return 'medium';
    }
  };

  return (
    <IonItem className="member-item">
      <IonAvatar slot="start" className="member-avatar">
        <IonIcon icon={personOutline} />
      </IonAvatar>
      <IonLabel>
        <h2 className="member-name">{member.name}</h2>
        <p className="member-info">
          <IonIcon icon={mailOutline} className="info-icon" />
          {member.email}
        </p>
        <p className="member-info">
          <IonIcon icon={callOutline} className="info-icon" />
          {member.phone}
        </p>
        <div className="member-meta">
          <IonBadge color={getStatusColor(member.status)}>
            {member.status}
          </IonBadge>
          <span className="membership-type">{member.membershipType}</span>
          <span className="expiry-date">Expires: {member.expiryDate}</span>
        </div>
      </IonLabel>
      <div className="member-actions" slot="end">
        <IonButton
          fill="clear"
          color="primary"
          onClick={onGenerateQR}
          title="Generate QR Code"
        >
          <IonIcon slot="icon-only" icon={qrCodeOutline} />
        </IonButton>
        <IonButton
          fill="clear"
          color="primary"
          onClick={onEdit}
          title="Edit Member"
        >
          <IonIcon slot="icon-only" icon={createOutline} />
        </IonButton>
        <IonButton
          fill="clear"
          color="danger"
          onClick={onDelete}
          title="Delete Member"
        >
          <IonIcon slot="icon-only" icon={trashOutline} />
        </IonButton>
      </div>
    </IonItem>
  );
};

export default MemberCard;
