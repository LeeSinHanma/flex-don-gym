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
import AdminMenu from "./pages/AdminPage/Admin";
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
import AdminRoute from "./AdminRoute";
import ProductPage from "./pages/AdminPage/Product";
import MembershipPage from "./pages/AdminPage/Membership";
import EmployeeEdit from "./pages/AdminPage/EmployeeEdit";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            {/* Default Redirect */}
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>

            {/* Employee Routes */}
            <Route exact path="/login" component={LoginRegister} />
            <Route exact path="/menu" component={MenuButtons} />
            <Route exact path="/member" component={MemberMenu} />
            <Route exact path="/walkin" component={WalkInMenu} />
            <Route exact path="/prepaid" component={PrepaidMenu} />
            <PrivateRoute path="/qr" component={QRScannerHome} />
            <Route exact path="/status-member" component={StatusMemberPage} />
            <Route exact path="/pos" component={PosPage} />
            <Route exact path="/pos-item" component={PosItemPage} />
            <Route exact path="/pos-checkout" component={PosCheckout} />
            {/* Admin Routes */}
            <Route exact path="/admin-page" component={StartingPageAdmin} />
            <Route exact path="/employee-page" component={EmployeeMenu} />
            <AdminRoute exact path="/admin-page" component={AdminMenu} />
            <Route exact path="/admin-product" component={ProductPage} />
            <Route exact path="/admin-membership" component={MembershipPage} />
            <Route
              path="/manage-status/:memberId"
              component={ManageStatusMemPage}
            />
            <Route
              path="/admin-edit-membership/:membershipId"
              component={AdminEditMembership}
            />
            <Route path="/employee/edit/:userId" component={EmployeeEdit} exact />
            <Route path="/members/edit/:memberId" component={EditMemberPage} />
            <Route exact path="/admin-dashboard" component={AdminDashboard} />
            <Route exact path="/admin-item-info" component={ItemInfoPage} />
            {/* Folder Route (keep last) */}
            <Route exact path="/folder/:name" component={Page} />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
