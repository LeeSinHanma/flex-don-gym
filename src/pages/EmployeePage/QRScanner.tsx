import React from "react";
import { useHistory } from "react-router-dom";
import QRScanner from "../../components/Reusable/QRScannerNav";
import "./QRScanner.css";
import { Button } from "../../components/Reusable/Button";

const QRScannerHome: React.FC = () => {
  const history = useHistory();

  return (
    <div className="main-pos-container">
      <div className="main-container">
        <div className="qr-container"></div>
        <div className="menu-pos-container">
          <div className="add-member-container">
            <Button
              className="btn add-member"
              type="button"
              onClick={() => history.push("/menu")}
            >
              ADD NEW MEMBER
            </Button>
          </div>
          <div className="pos-nav-container">
            <div className="pos-container">
              <h3>POS</h3>
            </div>
            <div className="qr-container">
              <h3>QR Scanner</h3>
            </div>
            <div className="status-container">
              <h3>Status</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerHome;
