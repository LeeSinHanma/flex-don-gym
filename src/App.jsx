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
import AdminMenu from "./pages/AdminPage/Admin";

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

      <button style={{ marginTop: "20px" }} onClick={() => history.push("/qr")}>
        POS
      </button>
      <button
        style={{ marginTop: "20px" }}
        onClick={() => history.push("/status-member")}
      >
        Status
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
    </>
  );
};

export default App;
