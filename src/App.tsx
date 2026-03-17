import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from "react-router-dom";

import "./App.css";

import Page from "./pages/Page";

import LoginRegister from "./pages/EmployeePage/LoginRegister";
import MenuButtons from "./pages/EmployeePage/Menu";
import MemberMenu from "./pages/EmployeePage/Member";
import WalkInMenu from "./pages/EmployeePage/WalkIn";
import PrepaidMenu from "./pages/EmployeePage/Prepaid";
import QRScannerHome from "./pages/EmployeePage/QRScanner";

import StartingPageAdmin from "./pages/AdminPage/StartingPage";
import EmployeeMenu from "./pages/AdminPage/Employee";
import AdminDashboard from "./pages/AdminPage/AdminDashboard";
import ItemInfoPage from "./pages/AdminPage/ItemInfo";
import AdminEditMembership from "./pages/AdminPage/AdminEditMembership";

import StatusMemberPage from "./pages/EmployeePage/StatusMember";
import ManageStatusMemPage from "./pages/AdminPage/ManageStatusMem";
import EditMemberPage from "./pages/AdminPage/EditMemberPage";

import PosPage from "./pages/EmployeePage/Pos";
import PosItemPage from "./pages/EmployeePage/PosItem";
import PosCheckout from "./pages/EmployeePage/PosCheckout";

/* Ionic Core CSS */
import "@ionic/react/css/core.css";

/* Basic CSS */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Dark Mode */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme */
import "./theme/variables.css";
import PrivateRoute from "./PrivateRoute";
import ProductPage from "./pages/AdminPage/Product";
import MembershipPage from "./pages/AdminPage/Membership";
import EmployeeEdit from "./pages/AdminPage/EmployeeEdit";
import GetStarted from "./pages/EmployeePage/GetStarted";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            {/* Default Redirect */}
            <Route exact path="/">
              <Redirect to="/get-started" />
            </Route>

            {/* Public routes */}
            <Route exact path="/get-started" component={GetStarted} />
            <Route exact path="/login" component={LoginRegister} />

            {/* Employee Routes */}
            <PrivateRoute exact path="/menu" component={MenuButtons} />
            <PrivateRoute exact path="/member" component={MemberMenu} />
            <PrivateRoute exact path="/walkin" component={WalkInMenu} />
            <PrivateRoute exact path="/prepaid" component={PrepaidMenu} />
            <PrivateRoute path="/qr" component={QRScannerHome} />
            <PrivateRoute exact path="/status-member" component={StatusMemberPage} />
            <PrivateRoute exact path="/pos" component={PosPage} />
            <PrivateRoute exact path="/pos-item" component={PosItemPage} />
            <PrivateRoute exact path="/pos-checkout" component={PosCheckout} />
            <PrivateRoute exact path="/get-started" component={GetStarted} />
            {/* Admin Routes */}
            <PrivateRoute exact path="/admin-page" component={StartingPageAdmin} />
            <PrivateRoute exact path="/employee-page" component={EmployeeMenu} />
            <PrivateRoute exact path="/admin-product" component={ProductPage} />
            <PrivateRoute exact path="/admin-membership" component={MembershipPage} />
            <PrivateRoute path="/manage-status/:memberId" component={ManageStatusMemPage}/>
            <PrivateRoute path="/admin-edit-membership/:membershipId" component={AdminEditMembership}/>
            <PrivateRoute path="/employee/edit/:userId" component={EmployeeEdit} exact />
            <PrivateRoute path="/members/edit/:memberId" component={EditMemberPage} />
            <PrivateRoute exact path="/admin-dashboard" component={AdminDashboard} />
            <PrivateRoute exact path="/admin-item-info" component={ItemInfoPage} />
            {/* Folder Route (keep last) */}
            <Route exact path="/folder/:name" component={Page} />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
