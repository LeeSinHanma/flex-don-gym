import React from "react";
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Routes, Navigate } from "react-router-dom";

import Menu from "./components/Menu";
import Page from "./pages/Page";
import App from "./App"; // QR Generator
import LoginRegister from "./pages/LoginRegister";
import MemberMenu from "./pages/Member";
import WalkInMenu from "./pages/WalkIn";
import PrepaidMenu from "./pages/Prepaid";

const MainApp: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonSplitPane contentId="main">
        <Menu />
        <IonRouterOutlet id="main">
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/folder/Inbox" replace />} />
            {/* Page route */}
            <Route path="/folder/:name" element={<Page />} />
            {/* QR Generator */}
            <Route path="/generator" element={<App />} />
            {/* Login/Register page */}
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/member" element={<MemberMenu />} />
            <Route path="/walkin" element={<WalkInMenu />} />
            <Route path="/prepaid" element={<PrepaidMenu />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactRouter>
  </IonApp>
);

export default MainApp;
