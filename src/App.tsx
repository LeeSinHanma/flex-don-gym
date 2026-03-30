import { Capacitor } from "@capacitor/core";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from "react-router-dom";
import { sqliteService } from "./localdb/sqliteService";
import { syncMembershipTypesFromServer } from "./logicHandlers/syncMembershipTypes";
import { getAllMembershipTypes } from "./repositories/membershipRepository";
import { syncGymPricingFromServer } from "./logicHandlers/syncGymPricing";
import { getLocalGymPricing } from "./repositories/pricingRepository";
import { syncInventoryFromServer } from "./logicHandlers/syncInventory";
import { getAllInventoryItems } from "./repositories/inventoryRepository";
import { useEffect } from "react";

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

import { syncMembersFromServer } from "./logicHandlers/syncMembers";
import { getAllMembers } from "./repositories/memberRepository";
import { OfflineBanner } from "./components/Reusable/OfflineBanner";

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    const initApp = async () => {
      if (Capacitor.getPlatform() === "web") {
        console.log("Skipping SQLite init on web");
        return;
      }

      try {
        await sqliteService.init();
        console.log("SQLite initialized");

        const memberCount = await syncMembersFromServer();
        console.log(`Synced ${memberCount} members to SQLite`);

        const membershipTypeCount = await syncMembershipTypesFromServer();
        console.log(`Synced ${membershipTypeCount} membership types to SQLite`);

        const pricing = await syncGymPricingFromServer();
        console.log("Synced gym pricing:", pricing);

        const inventoryCount = await syncInventoryFromServer();
        console.log(`Synced ${inventoryCount} inventory items to SQLite`);

        // ✅ Sync any pending offline visits/walk-ins
        // Temporarily disabled per user request
        // await syncPendingQueue();
        console.log("Pending sync complete (Syncing currently disabled)");

      } catch (err) {
        console.error("App init failed:", err);
      }
    };

    initApp();
  }, []);

  return (
    <IonApp>
      <OfflineBanner />
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
            <PrivateRoute exact path="/member" requiredAccess="status" component={MemberMenu} />
            <PrivateRoute exact path="/walkin" component={WalkInMenu} />
            <PrivateRoute exact path="/prepaid" component={PrepaidMenu} />
            <PrivateRoute path="/qr" requiredAccess="qr-scanner" component={QRScannerHome} />
            <PrivateRoute exact path="/status-member" requiredAccess="status" component={StatusMemberPage} />
            <PrivateRoute exact path="/pos" requiredAccess="pos" component={PosPage} />
            <PrivateRoute exact path="/pos-item" requiredAccess="pos" component={PosItemPage} />
            <PrivateRoute exact path="/pos-checkout" requiredAccess="pos" component={PosCheckout} />
            <PrivateRoute exact path="/get-started" component={GetStarted} />
            {/* Admin Routes */}
            <PrivateRoute exact path="/admin-page" requiredAccess="dashboard" component={StartingPageAdmin} />
            <PrivateRoute exact path="/employee-page" requiredAccess="employees" component={EmployeeMenu} />
            <PrivateRoute exact path="/admin-product" requiredAccess="products" component={ProductPage} />
            <PrivateRoute exact path="/admin-membership" requiredAccess="membership-plans" component={MembershipPage} />
            <PrivateRoute path="/manage-status/:memberId" requiredAccess="status" component={ManageStatusMemPage} />
            <PrivateRoute path="/admin-edit-membership/:membershipId" requiredAccess="membership-plans" component={AdminEditMembership} />
            <PrivateRoute path="/employee/edit/:userId" requiredAccess="employees" component={EmployeeEdit} exact />
            <PrivateRoute path="/members/edit/:memberId" requiredAccess="status" component={EditMemberPage} />
            <PrivateRoute exact path="/admin-dashboard" requiredAccess="dashboard" component={AdminDashboard} />
            <PrivateRoute exact path="/admin-item-info" requiredAccess="products" component={ItemInfoPage} />
            {/* Folder Route (keep last) */}
            <Route exact path="/folder/:name" component={Page} />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
