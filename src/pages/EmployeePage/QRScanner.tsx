import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import "./QRScanner.css";
import { Button } from "../../components/Reusable/Button";
import { Modal } from "../../components/Reusable/Modals"; // ✅ use this modal
import {
  startQrScanner,
  stopQrScanner,
} from "../../logicHandlers/qrScannerModule";
import { scanVisit } from "../../logicHandlers/visits";
import PosNav from "../../components/Reusable/NavItems";
import { IonIcon, IonImg } from "@ionic/react";
import { search } from "ionicons/icons";
import dondonLogo from "../../resource/dondon-logo.png";

type ScanVisitResult = {
  visit: {
    visit_id: number;
    member_id: string;
    direction: string;
    access_granted: boolean;
    denial_reason: string;
    amount_paid: number;
    created_at: string;
  };
  member_name: string;
  membership_type: number;
  message: string;
};

const QRScannerHome: React.FC = () => {
  const history = useHistory();

  const [showModal, setShowModal] = useState(false);
  const [visitResult, setVisitResult] = useState<ScanVisitResult | null>(null);

  const handleDecoded = useCallback(async (decodedText: string) => {
    try {
      const id = decodedText.trim();
      if (!id) return;

      const result = await scanVisit({
        member_id: id,
        direction: "inbound",
      });

      console.log("Visit Scan Result:", result);

      setVisitResult(result);
      setShowModal(true);
    } catch (err: any) {
      console.error("Failed to scan visit:", err?.message || err);
    }
  }, []);

  const restartScanner = useCallback(async () => {
    await stopQrScanner(); // ensure fully stopped
    await startQrScanner("member", handleDecoded); // start clean
  }, [handleDecoded]);

  useEffect(() => {
    startQrScanner("member", handleDecoded);

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
          <div className="search-icon">
            <IonIcon icon={search} />
          </div>
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
        showCloseButton={false}
        onClose={async () => {
          setShowModal(false);
          setVisitResult(null);
          await restartScanner();
        }}
      >
        {visitResult ? (
          <div className="employee-form">
            <div className="form-group">
              <label>Member ID</label>
              <input
                className="employee-input"
                value={visitResult.visit.member_id}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                className="employee-input"
                value={visitResult.member_name}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Membership Type</label>
              <input
                className="employee-input"
                value={String(visitResult.membership_type)}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Access Granted</label>
              <input
                className="employee-input"
                value={visitResult.visit.access_granted ? "YES" : "NO"}
                readOnly
              />
            </div>

            {!visitResult.visit.access_granted && (
              <div className="form-group">
                <label>Reason</label>
                <input
                  className="employee-input"
                  value={visitResult.visit.denial_reason || ""}
                  readOnly
                />
              </div>
            )}

            <div className="form-group">
              <label>Amount Paid</label>
              <input
                className="employee-input"
                value={String(visitResult.visit.amount_paid)}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <input
                className="employee-input"
                value={visitResult.message}
                readOnly
              />
            </div>

            <div className="form-actions" style={{ display: "flex", gap: 10 }}>
              <Button
                type="button"
                className="btn-modal btn-submit-modal"
                onClick={async () => {
                  setShowModal(false);
                  setVisitResult(null);
                  await restartScanner();
                }}
              >
                OK
              </Button>
            </div>
          </div>
        ) : (
          <div className="employee-form">
            <p style={{ textAlign: "center", margin: 0 }}>No visit data.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QRScannerHome;
