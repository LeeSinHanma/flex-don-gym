import React, { useEffect } from "react";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import "./Pos.css";
import { IonIcon } from "@ionic/react";
import { cartOutline, menuOutline } from "ionicons/icons";
import PosNav from "../../components/Reusable/NavItems";
import POSCard from "../../components/Reusable/PosCard";

import {
  startQrScanner,
  stopQrScanner,
} from "../../logicHandlers/qrScannerModule";

const PosPage: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const handleScan = async (decodedText: string) => {
      console.log("Scanned barcode:", decodedText);
    };

    startQrScanner("product", handleScan);

    return () => {
      stopQrScanner();
    };
  }, []);

  return (
    <div className="pos-main-container">
      <div className="pos-container">
        <div className="pos-header">
          <IonIcon
            icon={menuOutline}
            className="menu-icon"
            onClick={() => history.push("/pos-item")}
          />
          <Button
            type="button"
            className="btn-checkout"
            onClick={() => history.push("/pos-checkout")}
          >
            Checkout
          </Button>
        </div>

        {/* ✅ BARCODE CAMERA */}
        <div className="barcode">
          <div id="qr-reader" style={{ width: "100%" }}></div>
        </div>

        <div className="shopping-info">
          <div className="cart">
            <IonIcon icon={cartOutline} className="cart-icon" />
            <h2 className="shop-cart">Shopping Cart</h2>
          </div>
          <div className="total-amount">
            <h2 className="amount">P4000</h2>
          </div>
        </div>

        <div className="pos-card-item">
          <POSCard
            productName="Protein Powder"
            price={1000.0}
            initialCount={0}
            minCount={0}
            maxCount={10}
            onCountChange={(count) => console.log("count changed:", count)}
          />
        </div>

        <div className="pos-footer">
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

export default PosPage;
