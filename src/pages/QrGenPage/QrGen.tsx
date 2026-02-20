import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import QRCode from "react-qr-code";

import { generateGymQr } from "../../logicHandlers/qrGenModule";
import "../../App.css";

const QrGen: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [qrVisible, setVisible] = useState(false);

  const history = useHistory();

  const generateQrCodeHandler = () => {
    const result = generateGymQr({ firstName, lastName, age });

    if (!result.ok) {
      alert(result.error);
      return;
    }

    setQrValue(result.value);
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
    </div>
  );
};

export default QrGen;