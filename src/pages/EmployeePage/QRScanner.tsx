import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import "./QRScanner.css";
import { Button } from "../../components/Reusable/Button";
import QRResultModal from "../../components/Modals/QRResultModal";
import {
  startQrScanner,
  stopQrScanner,
} from "../../logicHandlers/qrScannerModule";
import { getMemberByID } from "../../logicHandlers/userServices";
import PosNav from "../../components/Reusable/NavItems";
import { IonImg } from "@ionic/react";
import dondonLogo from "../../resource/dondon-logo.png";

const QRScannerHome: React.FC = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberName, setMemberName] = useState("");

  const handleDecoded = useCallback(async (decodedText: string) => {
    try {
      const id = decodedText.trim();
      const member = await getMemberByID(id);

      console.log("Member Details:", member);

      setMemberName(member.first_name);
      setIsModalOpen(true);

      // ❌ REMOVE stopQrScanner() here — module already stops after scan
    } catch (err: any) {
      console.error("Failed to fetch member:", err?.message || err);
    }
  }, []);

  const restartScanner = useCallback(async () => {
    await stopQrScanner(); // ensure fully stopped
    await startQrScanner(handleDecoded); // start clean
  }, [handleDecoded]);

  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById("qr-reader");

      console.log("QR Reader Element:", el);
      console.log("Width:", el?.clientWidth);
      console.log("Height:", el?.clientHeight);
    }, 1000);
    startQrScanner(handleDecoded);

    return () => {
      stopQrScanner();
    };
  }, [handleDecoded]);

  return (
    <div className="main-qr-container">
      <div className="main-container">
        <div className="text-container">
          <IonImg src={dondonLogo} className="login-logo" />
          <p>Scan QR code</p>
        </div>

        <div className="camera-container">
          <div id="qr-reader" />
        </div>

        <div className="menu-qr-container">
          <div className="add-member-container">
            <Button
              className="btn-add-member"
              type="button"
              onClick={() => history.push("/menu")}
            >
              ADD NEW MEMBER
            </Button>
          </div>

          <div className="pos-footer">
            <PosNav
              items={[
                {
                  label: "POS",
                  path: "/pos",
                  className: "pos-nav-item-container",
                },
                {
                  label: "QR Scanner",
                  path: "/qr",
                  className: "qr-nav-item-container",
                },
                {
                  label: "Status",
                  path: "/status-member",
                  className: "status-item-nav-container",
                },
              ]}
            />
          </div>
        </div>
      </div>

      <QRResultModal
        isOpen={isModalOpen}
        qrText={memberName}
        onConfirm={async () => {
          console.log("Confirmed:", memberName);
          setIsModalOpen(false);
          await restartScanner();
        }}
        onClose={async () => {
          setIsModalOpen(false);
          await restartScanner();
        }}
      />
    </div>
  );
};

export default QRScannerHome;
