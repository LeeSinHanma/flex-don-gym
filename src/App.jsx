import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import "./App.css";
import LoginRegister from "./pages/LoginRegister";
import MenuButtons from "./pages/Menu";
import MemberMenu from "./pages/Member";
import WalkInMenu from "./pages/WalkIn";
import PrepaidMenu from "./pages/Prepaid";

const QRGenerator = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [qrVisible, setVisible] = useState(false);

  const navigate = useNavigate();

  const generateQrCodeHandler = () => {
    // Check for empty fields or invalid age

    if (!firstName || !lastName || !age || Number(age) <= 0) {
      alert("Complete All Fields");
      return;
    }

    // Check for whitespace-only or spaces in inputs
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
        onClick={() => navigate("/generator")}
      >
        Back to Generator
      </button>
      <button style={{ marginTop: "20px" }} onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/generator" />} />
      <Route path="/generator" element={<QRGenerator />} />
      <Route path="/login" element={<LoginRegister />} />
      <Route path="/menu" element={<MenuButtons />} />
      <Route path="/member" element={<MemberMenu />} />
      <Route path="/walkin" element={<WalkInMenu />} />
      <Route path="/prepaid" element={<PrepaidMenu />} />
    </Routes>
  );
};

export default App;
