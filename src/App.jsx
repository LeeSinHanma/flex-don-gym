import React, { useState } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import QRCode from "react-qr-code";
import "./App.css";

import LoginRegister from "./pages/EmployeePage/LoginRegister";
import MenuButtons from "./pages/EmployeePage/Menu";
import MemberMenu from "./pages/EmployeePage/Member";
import WalkInMenu from "./pages/EmployeePage/WalkIn";
import PrepaidMenu from "./pages/EmployeePage/Prepaid";
import QRScannerHome from "./pages/EmployeePage/QRScanner";
import QRGen from "./pages/QrGenPage/QrGen";
import StartingPageAdmin from "./pages/AdminPage/StartingPage";
import StatusMemberPage from "./pages/EmployeePage/StatusMember";
import PosPage from "./pages/EmployeePage/Pos";
import ManageStatusMemPage from "./pages/AdminPage/ManageStatusMem";
import PosItemPage from "./pages/EmployeePage/PosItem";
import LoginRegisterErrorPage from "./components/Reusable/LoginRegisterError";
import LoadingScreen from "./pages/LoadingScreen";

const QRGenerator = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [qrVisible, setVisible] = useState(false);

  const history = useHistory();

  return (
    <div className="container">
      <button
        style={{ marginTop: "20px" }}
        onClick={() => history.push("/qrGen")}
      >
        Go to QR Generator
      </button>

      <button
        style={{ marginTop: "20px" }}
        onClick={() => history.push("/login")}
      >
        Login
      </button>

      <button
        style={{ marginTop: "20px" }}
        onClick={() => history.push("/admin-page")}
      >
        Get Started
      </button>
      <button
        style={{ marginTop: "20px" }}
        onClick={() => history.push("/pos")}
      >
        POS
      </button>
      <button
        style={{ marginTop: "20px" }}
        onClick={() => history.push("/error-page")}
      >
        Login Error
      </button>
      <button
        style={{ marginTop: "20px" }}
        onClick={() => history.push("/loading")}
      >
        Loading Screen
      </button>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Route path="/generator" component={QRGenerator} />
      <Redirect to="/generator" />

      <Route exact path="/login" component={LoginRegister} />
      <Route exact path="/menu" component={MenuButtons} />
      <Route exact path="/member" component={MemberMenu} />
      <Route exact path="/walkin" component={WalkInMenu} />
      <Route exact path="/prepaid" component={PrepaidMenu} />
      <Route exact path="/qr" component={QRScannerHome} />
      <Route exact path="/qrGen" component={QRGen} />
      <Route exact path="/admin-page" component={StartingPageAdmin} />
      <Route exact path="/status-member" component={StatusMemberPage} />
      <Route exact path="/manage-status" component={ManageStatusMemPage} />
      <Route exact path="/pos" component={PosPage} />
      <Route exact path="/pos-item" component={PosItemPage} />
      <Route exact path="/error-page" component={LoginRegisterErrorPage} />
      <Route exact path="/loading" component={LoadingScreen} />
    </>
  );
};

export default App;
