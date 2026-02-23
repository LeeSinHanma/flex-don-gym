import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./QRScanner.css";
import { Button } from "../../components/Reusable/Button";
import QRResultModal from "../../components/Modals/QRResultModal";
import { useEffect } from "react";
import {
  startQrScanner,
  stopQrScanner,
} from "../../logicHandlers/qrScannerModule";
import { getMemberByID } from "../../logicHandlers/userServices";
import PosNav from "../../components/Reusable/NavItems";

const QRScannerHome: React.FC = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    startQrScanner(async (decodedText) => {
      try {
        const member = await getMemberByID(decodedText);

        console.log("Member Details:", member);

        setMemberName(member.first_name); // store data
        setIsModalOpen(true); // open modal
        stopQrScanner(); // stop camera while modal is open
      } catch (err: any) {
        console.error("Failed to fetch member:", err.message);
      }
    });

    return () => {
      stopQrScanner();
    };
  }, []);

  return (
    <div className="main-qr-container">
      <div className="main-container">
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
                { label: "POS", path: "/pos" },
                { label: "QR Scanner", path: "/qr" },
                { label: "Status", path: "/status-member" },
              ]}
            />
          </div>
        </div>
      </div>
      {/* ✅ PUT THE MODAL RIGHT HERE */}
      <QRResultModal
        isOpen={isModalOpen}
        qrText={memberName}
        onConfirm={() => {
          console.log("Confirmed:", memberName);
          setIsModalOpen(false);
        }}
        onClose={() => {
          setIsModalOpen(false);
          startQrScanner(() => {}); // restart scanner
        }}
      />
    </div>
  );
};

export default QRScannerHome;
