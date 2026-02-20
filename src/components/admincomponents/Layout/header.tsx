import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonMenuButton } from '@ionic/react';
import { personCircleOutline, notificationsOutline } from 'ionicons/icons';
import './header.css';

interface AdminHeaderProps {
  title: string;
  showMenuButton?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, showMenuButton = true }) => {
  return (
    <IonHeader className="admin-header">
      <IonToolbar color="primary">
        {showMenuButton && (
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        )}
        <IonTitle className="admin-header-title">{title}</IonTitle>
        <IonButtons slot="end">
          <IonButton>
            <IonIcon slot="icon-only" icon={notificationsOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default AdminHeader;
