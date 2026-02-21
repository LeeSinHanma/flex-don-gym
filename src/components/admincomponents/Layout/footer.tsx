import React from 'react';
import { IonFooter, IonToolbar } from '@ionic/react';
import './footer.css';

const AdminFooter: React.FC = () => {
  return (
    <IonFooter className="admin-footer">
      <IonToolbar>
        <div className="footer-content">
          <p>© 2024 Flex Don Gym - Admin Portal</p>
        </div>
      </IonToolbar>
    </IonFooter>
  );
};

export default AdminFooter;
