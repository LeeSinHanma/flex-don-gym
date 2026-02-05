import React from "react";
import { useHistory } from "react-router-dom";
import "./QRScanner.css";
import { Button } from "../../components/Reusable/Button";
import { useEffect } from "react";
import { startQrScanner, stopQrScanner } from "../../logicHandlers/qrScannerModule";

const QRScannerHome: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    startQrScanner((decodedText) => {
      console.log("SCANNED:", decodedText);
      // example: navigate after scan
      // history.push(`/member/${encodeURIComponent(decodedText)}`);
    });

    return () => {
      stopQrScanner();
    };
  }, []);

  return (
    <div className="main-pos-container">
      <div className="main-container">
        <div className="camera-container">
          <div id="qr-reader" />
        </div>
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
          <div className="qr pos-nav-container">
            <div className="pos-container">
              <h3>POS</h3>
            </div>
            <div className="qr qr-container">
              <h3 onClick={() => history.push("/")}>QR Scanner</h3>
            </div>

            <div className="qr status-container">
              <h3 onClick={() => history.push("/status-member")}>Status</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerHome;