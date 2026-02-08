import React from "react";
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from "react-router-dom";

import Menu from "./components/Menu";
import Page from "./pages/Page";
import App from "./App"; // QR Generator
import LoginRegister from "./pages/EmployeePage/LoginRegister";
import MenuButtons from "./pages/EmployeePage/Menu";
import MemberMenu from "./pages/EmployeePage/Member";
import WalkInMenu from "./pages/EmployeePage/WalkIn";
import PrepaidMenu from "./pages/EmployeePage/Prepaid";
import QRScannerHome from "./pages/EmployeePage/QRScanner";
import StartingPageAdmin from "./pages/AdminPage/StartingPage";
import EmployeeMenu from "./pages/AdminPage/Employee";
import AdminMenu from "./pages/AdminPage/Admin";
import MenuAdminButtons from "./pages/AdminPage/MenuAdmin";
import StatusMemberPage from "./pages/EmployeePage/StatusMember";
import ManageStatusMemPage from "./pages/AdminPage/ManageStatusMem";

const MainApp: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonSplitPane contentId="main">
        <Menu />

        <IonRouterOutlet id="main">
          <Switch>
            {/* Default redirect */}
            <Route exact path="/">
              <Redirect to="/folder/Inbox" />
            </Route>

            {/* Employee Routes */}
            <Route exact path="/login" component={LoginRegister} />
            <Route exact path="/menu" component={MenuButtons} />
            <Route exact path="/member" component={MemberMenu} />
            <Route exact path="/walkin" component={WalkInMenu} />
            <Route exact path="/prepaid" component={PrepaidMenu} />
            <Route exact path="/qr" component={QRScannerHome} />
            <Route exact path="/admin-page" component={StartingPageAdmin} />
            <Route exact path="/employee" component={EmployeeMenu} />
            <Route exact path="/admin" component={AdminMenu} />
            <Route exact path="/menu-admin" component={MenuAdminButtons} />
            <Route exact path="/status-member" component={StatusMemberPage} />
            <Route
              exact
              path="/manage-status"
              component={ManageStatusMemPage}
            />
            <Route exact path="/pos" component={POSPageMenu} />

            {/* QR Generator */}
            <Route exact path="/generator" component={App} />

            {/* Folder/Page route - should be last */}
            <Route exact path="/folder/:name" component={Page} />
          </Switch>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactRouter>
  </IonApp>
);

export default MainApp;
