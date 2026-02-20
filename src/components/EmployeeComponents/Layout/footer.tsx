import React from 'react';
import { IonFooter, IonToolbar } from '@ionic/react';
import './footer.css';

const EmployeeFooter: React.FC = () => {
  return (
    <IonFooter className="employee-footer">
      <IonToolbar>
        <div className="footer-content">
          <p>© 2024 Flex Don Gym - Employee Portal</p>
        </div>
      </IonToolbar>
    </IonFooter>
  );
};

export default EmployeeFooter;
