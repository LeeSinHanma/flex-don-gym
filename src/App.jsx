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

const QRGenerator = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [qrVisible, setVisible] = useState(false);

  const history = useHistory();

  const generateQrCodeHandler = () => {
    if (!firstName || !lastName || !age || Number(age) <= 0) {
      alert("Complete All Fields");
      return;
    }

    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      firstName.includes(" ") ||
      lastName.includes(" ")
    ) {
      alert("Invalid input, try again");
      return;
    }

    const formatted = `000001DonGym${firstName}${lastName}${age}`;
    setQrValue(formatted);
    setVisible(true);
  };

  return (
    <div className="container">
      <h1>Gym QR Code Generator 💪🏋️‍♂️</h1>

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <button onClick={generateQrCodeHandler}>Generate QR Code</button>

      {qrVisible && (
        <div className="qr-code-container">
          <QRCode value={qrValue} size={300} />
          <p>
            Generated Code: <b>{qrValue}</b>
          </p>
        </div>
      )}

      <button
        style={{ marginTop: "20px" }}
        onClick={() => history.push("/generator")}
      >
        Back to Generator
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
    </div>
  );
};

const App = () => {
  return (
    <>
      <Route exact path="/">
        <Redirect to="/generator" />
      </Route>

      <Route exact path="/generator" component={QRGenerator} />
      <Route exact path="/login" component={LoginRegister} />
      <Route exact path="/menu" component={MenuButtons} />
      <Route exact path="/member" component={MemberMenu} />
      <Route exact path="/walkin" component={WalkInMenu} />
      <Route exact path="/prepaid" component={PrepaidMenu} />
      <Route exact path="/qr" component={QRScannerHome} />
    </>
  );
};

export default App;
