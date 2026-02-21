import React from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import EmployeeNavbar from '../../components/EmployeeComponents/Layout/Navbar';
import EmployeeDashboard from '../EmployeePage/EmployeeDashboard';
import Member from '../EmployeePage/Member';
import MemberProfile from '../EmployeePage/MemberProfile';
import QRScanner from '../EmployeePage/QRScanner';
import POS from '../EmployeePage/POS';
import StatusMember from '../EmployeePage/StatusMember';
import Prepaid from '../EmployeePage/Prepaid';
import WalkIn from '../EmployeePage/WalkIn';
import './employeedashboard.css';

const EmployeeDashboardLayout: React.FC = () => {
  return (
    <>
      <EmployeeNavbar />
      <IonRouterOutlet id="employee-content">
        <Route path="/employee/dashboard" exact component={EmployeeDashboard} />
        <Route path="/employee/members" exact component={Member} />
        <Route path="/employee/member/:id" exact component={MemberProfile} />
        <Route path="/employee/qr-scanner" exact component={QRScanner} />
        <Route path="/employee/pos" exact component={POS} />
        <Route path="/employee/status-member" exact component={StatusMember} />
        <Route path="/employee/prepaid" exact component={Prepaid} />
        <Route path="/employee/walk-in" exact component={WalkIn} />
        <Route exact path="/employee">
          <Redirect to="/employee/dashboard" />
        </Route>
      </IonRouterOutlet>
    </>
  );
};

export default EmployeeDashboardLayout;
