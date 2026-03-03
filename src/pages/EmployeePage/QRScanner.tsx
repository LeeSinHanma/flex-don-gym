import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import "./QRScanner.css";
import { Button } from "../../components/Reusable/Button";
import { Modal } from "../../components/Reusable/Modals"; // ✅ use this modal
import {
  startQrScanner,
  stopQrScanner,
} from "../../logicHandlers/qrScannerModule";
import { getMemberByID } from "../../logicHandlers/userServices";
import PosNav from "../../components/Reusable/NavItems";
import { IonImg } from "@ionic/react";
import dondonLogo from "../../resource/dondon-logo.png";

type MemberInfo = {
  member_id: string;
  email: string;
  contact_number: string;
  first_name: string;
  last_name: string;
  membership_type: number;
  membership_plan_id: number;
  membership_expiry: string;
  credits: number;
  registered_by: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const QRScannerHome: React.FC = () => {
  const history = useHistory();

  const [showModal, setShowModal] = useState(false);
  const [member, setMember] = useState<MemberInfo | null>(null);

  const handleDecoded = useCallback(async (decodedText: string) => {
    try {
      const id = decodedText.trim();
      if (!id) return;

      const fetched = await getMemberByID(id);
      console.log("Member Details:", fetched);

      setMember(fetched);
      setShowModal(true);
      // ✅ no need to stop here if your module already stops after scan
    } catch (err: any) {
      console.error("Failed to fetch member:", err?.message || err);
    }
  }, []);

  const restartScanner = useCallback(async () => {
    await stopQrScanner(); // ensure fully stopped
    await startQrScanner(handleDecoded); // start clean
  }, [handleDecoded]);

  useEffect(() => {
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

      {/* ✅ Reused MODAL */}
      <Modal
        className="modal-box"
        isOpen={showModal}
        title="Member Details"
        onClose={async () => {
          setShowModal(false);
          setMember(null);
          await restartScanner(); // ✅ restart scanning after closing modal
        }}
      >
        {member ? (
          <div className="accepted-details">
            <p>
              <b>Member ID:</b> {String(member.member_id ?? "")}
            </p>
            <p>
              <b>First Name:</b> {member.first_name ?? ""}
            </p>
            <p>
              <b>Last Name:</b> {member.last_name ?? ""}
            </p>
            <p>
              <b>Credits:</b> {member.credits ?? ""}
            </p>
            <p>
              <b>Amount to Pay:</b> {"50.00"}{" "}
              {/* Placeholder for amount, replace with actual logic */}
            </p>

            {/* Optional: Add a confirm button */}
            <div className="modal-buttons">
              <Button
                className="btn-submit"
                type="button"
                onClick={async () => {
                  console.log("Confirmed member:", member);
                  setShowModal(false);
                  setMember(null);
                  await restartScanner();
                }}
              >
                Confirm
              </Button>

              <Button
                className="btn-submit btn-cancel"
                type="button"
                onClick={async () => {
                  console.log("Cancelled member:", member);
                  setShowModal(false);
                  setMember(null);
                  await restartScanner();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p>No member data.</p>
        )}
      </Modal>
    </div>
  );
};

export default QRScannerHome;
