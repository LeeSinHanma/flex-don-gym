import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
} from '@ionic/react';
import {
  speedometerOutline,
  peopleOutline,
  qrCodeOutline,
  cartOutline,
  logOutOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

const EmployeeNavbar: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const navigateTo = (path: string) => {
    history.push(path);
  };

  return (
    <IonMenu contentId="employee-content" type="overlay" className="employee-menu">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Employee Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonMenuToggle autoHide={false}>
            <IonItem button onClick={() => navigateTo('/employee/dashboard')}>
              <IonIcon icon={speedometerOutline} slot="start" />
              <IonLabel>Dashboard</IonLabel>
            </IonItem>

            <IonItem button onClick={() => navigateTo('/employee/members')}>
              <IonIcon icon={peopleOutline} slot="start" />
              <IonLabel>Members</IonLabel>
            </IonItem>

            <IonItem button onClick={() => navigateTo('/employee/qr-scanner')}>
              <IonIcon icon={qrCodeOutline} slot="start" />
              <IonLabel>Scan QR</IonLabel>
            </IonItem>

            <IonItem button onClick={() => navigateTo('/employee/pos')}>
              <IonIcon icon={cartOutline} slot="start" />
              <IonLabel>POS</IonLabel>
            </IonItem>

            <IonItem button onClick={handleLogout}>
              <IonIcon icon={logOutOutline} slot="start" />
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default EmployeeNavbar;
