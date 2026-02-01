import React, { useState } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { QRCode } from "react-qr-code";
import { generateQrValue } from "./logicHandlers/qrLogic";

import "./App.css";

const QRGenerator = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [qrVisible, setVisible] = useState(false);

  const history = useHistory();

  const generateQrCodeHandler = async () => {
    const result = generateQrValue(firstName, lastName, age);

    if (result.error) {
      alert(result.error);
      return;
    }

    try {
      // 🔐 LOGIN using FastAPI (query params)
      const url = new URL(
        "https://flexolutions-backend-dev.onrender.com/users/authenticate_user_endpoint_users_login_post"
      );

      url.searchParams.append("username", firstName); // example mapping
      url.searchParams.append("password", lastName);  // example mapping

      const response = await fetch(url.toString(), {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      // store token
      localStorage.setItem("token", data.access_token);

      // 🔹 YOUR ORIGINAL CODE (unchanged)
      setQrValue(result.value);
      setVisible(true);

    } catch (error) {
      console.error(error);
      alert("Unable to login");
    }
  };



  return (
    <div className="container">
      <h1>Gym QR Code Generator 💪🏋️‍♂️</h1>

      <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />

      <button onClick={generateQrCodeHandler}>Generate QR Code</button>

      {qrVisible && (
        <div className="qr-code-container">
          <QRCode value={qrValue} size={300} />
          <p>Generated Code: <b>{qrValue}</b></p>
        </div>
      )}

      <button style={{ marginTop: "20px" }} onClick={() => history.push("/generator")}>
        Back to Generator
      </button>

    </div>
  );
};

const App = () => {
  return (
    <Switch>
      <Route path="/generator" component={QRGenerator} />
      <Redirect to="/generator" />
    </Switch>
  );
};

export default App;