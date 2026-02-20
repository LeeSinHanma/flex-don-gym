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
  IonFooter,
  IonButton,
} from '@ionic/react';
import {
  speedometerOutline,
  peopleOutline,
  personOutline,
  cashOutline,
  barbellOutline,
  cartOutline,
  settingsOutline,
  logOutOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

const AdminNavbar: React.FC = () => {
  const history = useHistory();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const menuItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: speedometerOutline },
    { title: 'Members', path: '/admin/customers', icon: peopleOutline },
    { title: 'Employees', path: '/admin/employees', icon: personOutline },
    { title: 'Products', path: '/admin/products', icon: cartOutline },
    { title: 'Equipment', path: '/admin/equipment', icon: barbellOutline },
    { title: 'Pricing', path: '/admin/price-edit', icon: cashOutline },
    { title: 'Profile', path: '/admin/profile', icon: settingsOutline },
  ];

  const handleNavigate = (path: string) => {
    history.push(path);
  };

  return (
    <IonMenu contentId="admin-content" type="overlay" className="admin-menu">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Flex Don Gym</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="menu-user-info">
          <IonIcon icon={personOutline} className="user-avatar" />
          <div className="user-details">
            <h3>{user?.fullName || user?.username}</h3>
            <p>Administrator</p>
          </div>
        </div>
        <IonList className="menu-list">
          {menuItems.map((item, index) => (
            <IonMenuToggle key={index} autoHide={false}>
              <IonItem
                button
                onClick={() => handleNavigate(item.path)}
                detail={false}
                className="menu-item"
              >
                <IonIcon slot="start" icon={item.icon} />
                <IonLabel>{item.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
      <IonFooter className="menu-footer">
        <IonButton
          expand="block"
          fill="clear"
          color="danger"
          onClick={handleLogout}
          className="logout-button"
        >
          <IonIcon slot="start" icon={logOutOutline} />
          Logout
        </IonButton>
      </IonFooter>
    </IonMenu>
  );
};

export default AdminNavbar;
