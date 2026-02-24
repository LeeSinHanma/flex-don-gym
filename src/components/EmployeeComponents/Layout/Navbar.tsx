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
  addCircleOutline,
  statsChartOutline,
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
            {/* Main Navigation */}
            <IonItem button onClick={() => navigateTo('/employee/dashboard')}>
              <IonIcon icon={speedometerOutline} slot="start" />
              <IonLabel>Dashboard</IonLabel>
            </IonItem>

            {/* Member Management */}
            <div className="menu-section">
              <div className="menu-section-title">Member Management</div>
              
              <IonItem button onClick={() => navigateTo('/employee/members')}>
                <IonIcon icon={peopleOutline} slot="start" />
                <IonLabel>All Members</IonLabel>
              </IonItem>

              <IonItem button onClick={() => navigateTo('/employee/prepaid')}>
                <IonIcon icon={addCircleOutline} slot="start" />
                <IonLabel>Register Prepaid</IonLabel>
              </IonItem>

              <IonItem button onClick={() => navigateTo('/employee/walk-in')}>
                <IonIcon icon={addCircleOutline} slot="start" />
                <IonLabel>Walk-In Entry</IonLabel>
              </IonItem>

              <IonItem button onClick={() => navigateTo('/employee/status-member')}>
                <IonIcon icon={statsChartOutline} slot="start" />
                <IonLabel>Member Status</IonLabel>
              </IonItem>
            </div>

            {/* Transactions */}
            <div className="menu-section">
              <div className="menu-section-title">Transactions</div>
              
              <IonItem button onClick={() => navigateTo('/employee/pos')}>
                <IonIcon icon={cartOutline} slot="start" />
                <IonLabel>Point of Sale</IonLabel>
              </IonItem>
            </div>

            {/* System */}
            <div className="menu-section">
              <IonItem button onClick={handleLogout} lines="none">
                <IonIcon icon={logOutOutline} slot="start" color="danger" />
                <IonLabel color="danger">Logout</IonLabel>
              </IonItem>
            </div>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default EmployeeNavbar;
