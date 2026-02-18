import React from "react";
import { useHistory } from "react-router-dom";
import QRScanner from "../../components/Reusable/QRScannerNav";
import "./QRScanner.css";
import { Button } from "../../components/Reusable/Button";
import PosNav from "../../components/Reusable/NavItems";

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
          <PosNav
            items={[
              { label: "POS", path: "/pos" },
              { label: "QR Scanner", path: "/qr" },
              { label: "Status", path: "/status-member" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default QRScannerHome;
