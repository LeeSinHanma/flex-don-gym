import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from "react-router-dom";

import Menu from "./components/Menu";
import Page from "./pages/Page";
import QRGenerator from "./App"; // QR Generator
import LoginRegister from "./pages/EmployeePage/LoginRegister";
import MenuButtons from "./pages/EmployeePage/Menu";
import MemberMenu from "./pages/EmployeePage/Member";
import WalkInMenu from "./pages/EmployeePage/WalkIn";
import PrepaidMenu from "./pages/EmployeePage/Prepaid";
import QRScannerHome from "./pages/EmployeePage/QRScanner";
import StartingPageAdmin from "./pages/AdminPage/StartingPage";
import EmployeeMenu from "./pages/AdminPage/Employee";
import AdminMenu from "./pages/AdminPage/Admin";
import StatusMemberPage from "./pages/EmployeePage/StatusMember";
import ManageStatusMemPage from "./pages/AdminPage/ManageStatusMem";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />

          <IonRouterOutlet id="main">
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
              <Route exact path="/qr" component={QRScannerHome} />
              <Route exact path="/admin-page" component={StartingPageAdmin} />
              <Route exact path="/employee-login" component={EmployeeMenu} />
              <Route exact path="/employee-login" component={EmployeeMenu} />
              <Route exact path="/admin-menu" component={AdminMenu} />
              <Route exact path="/status-member" component={StatusMemberPage} />
              <Route
                exact
                path="/manage-status"
                component={ManageStatusMemPage}
              />
              {/* QR Generator Route */}
              <Route exact path="/generator" component={QRGenerator} />

              {/* Folder Route - keep at the end */}
              <Route exact path="/folder/:name" component={Page} />
            </Switch>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
