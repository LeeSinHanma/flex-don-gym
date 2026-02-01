import React from "react";
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";

import Menu from "./components/Menu";
import Page from "./pages/Page";
import App from "./App"; // QR Generator
import LoginRegister from "./pages/EmployeePage/LoginRegister";
import MemberMenu from "./pages/EmployeePage/Member";
import WalkInMenu from "./pages/EmployeePage/WalkIn";
import PrepaidMenu from "./pages/EmployeePage/Prepaid";
import QRScannerHome from "./pages/EmployeePage/QRScanner";
import MemberStatusPage from "./pages/EmployeePage/MemberStatus";

const MainApp: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonSplitPane contentId="main">
        <Menu />

        <IonRouterOutlet id="main">
          {/* Redirect */}
          <Route exact path="/">
            <Redirect to="/folder/Inbox" />
          </Route>

          {/* Routes */}
          <Route path="/folder/:name" component={Page} />
          <Route exact path="/generator" component={App} />
          <Route exact path="/login" component={LoginRegister} />
          <Route exact path="/member" component={MemberMenu} />
          <Route exact path="/walkin" component={WalkInMenu} />
          <Route exact path="/prepaid" component={PrepaidMenu} />
          <Route exact path="/qr" component={QRScannerHome} />
          <Route exact path="/memberstatus" component={MemberStatusPage} />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactRouter>
  </IonApp>
);

export default MainApp;
