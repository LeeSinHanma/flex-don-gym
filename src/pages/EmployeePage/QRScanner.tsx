import React, { useEffect, useState, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import "./QRScanner.css";
import { Button } from "../../components/Reusable/Button";
import { Modal } from "../../components/Reusable/Modals";
import {
  startQrScanner,
  stopQrScanner,
} from "../../logicHandlers/qrScannerModule";
import { scanVisit } from "../../logicHandlers/visits";
import EmployeeMenu from "../../components/Reusable/EmployeeMenu";
import { IonIcon, IonImg } from "@ionic/react";
import { search, menu } from "ionicons/icons";
import { getMemberByName, Member } from "../../logicHandlers/memberCrud";
import dondonLogo from "../../resource/dondon-logo.png";
import scanSound from "../../resource/scanSound.mp3";
import scanError from "../../resource/scanError.mp3";

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

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isMirrored, setIsMirrored] = useState(false);
  const scanAudio = useRef<HTMLAudioElement | null>(null);
  const errorAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    scanAudio.current = new Audio(scanSound);
    errorAudio.current = new Audio(scanError);
  }, []);

  const playSuccessSound = () => {
    if (scanAudio.current) {
      scanAudio.current.currentTime = 0;
      scanAudio.current.play().catch(() => {});
    }
  };

  const playErrorSound = () => {
    if (errorAudio.current) {
      errorAudio.current.currentTime = 0;
      errorAudio.current.play().catch(() => {});
    }
  };

  const getMembershipLabel = (type: number) => {
    switch (type) {
      case 0:
        return "Member";
      case 1:
        return "Casual";
      default:
        return `Type ${type}`;
    }
  };

  const handleDecoded = useCallback(async (decodedText: string) => {
    try {
      const id = decodedText.trim();
      if (!id) return;

      const result = await scanVisit({
        member_id: id,
        direction: "inbound",
      });

      if (result.visit.access_granted) {
        playSuccessSound();
      } else {
        playErrorSound();
      }

      setVisitResult(result);
      setShowModal(true);
    } catch (err: any) {
      console.error("Failed to scan visit:", err?.message || err);
      playErrorSound();
    }
  }, []);

  const restartScanner = useCallback(async () => {
    await stopQrScanner();
    await startQrScanner("qr-reader", handleDecoded);
  }, [handleDecoded]);

  useEffect(() => {
    startQrScanner("qr-reader", handleDecoded);

    return () => {
      stopQrScanner();
    };
  }, [handleDecoded]);

  useEffect(() => {
    if (!showSearchModal) return;

    const trimmed = searchText.trim();

    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timeout = setTimeout(async () => {
      try {
        const results = await getMemberByName(trimmed);
        setSearchResults(results);
      } catch (err) {
        console.error("Search failed:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchText, showSearchModal]);

  const lastTap = useRef(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      setIsMirrored((prev) => !prev);
    }

    lastTap.current = now;
  };

  return (
    <div className="main-qr-container">
      <div className="main-container">
        <div className="text-container">
          <button
            type="button"
            className="icon-button search-icon"
            onClick={() => setShowSearchModal(true)}
            aria-label="Search member"
          >
            <IonIcon icon={search} />
          </button>

          <div className="header-title-group">
            <IonImg src={dondonLogo} className="login-logo" />
            <p>Scan QR code</p>
          </div>

          <div className="header-action-group">
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowEmployeeMenu(true)}
              aria-label="Open menu"
            >
              <IonIcon icon={menu} />
            </button>
          </div>
        </div>

        <div
          className={`camera-container ${isMirrored ? "mirrored" : ""}`}
          onClick={handleDoubleTap}
        >
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
        </div>
      </div>

      <Modal
        className="modal-box"
        isOpen={showModal}
        title="Visit Result"
        showCloseButton={false}
        onClose={async () => {
          setShowModal(false);
          setVisitResult(null);
          await restartScanner();
        }}
      >
        {visitResult ? (
          <div className="visit-result-card">
            <div className="visit-result-row">
              <span>Name</span>
              <strong>{visitResult.member_name}</strong>
            </div>

            <div className="visit-result-row">
              <span>Membership Type</span>
              <strong>{getMembershipLabel(visitResult.membership_type)}</strong>
            </div>

            <div className="visit-result-row">
              <span>Access Granted</span>
              <strong>{visitResult.visit.access_granted ? "YES" : "NO"}</strong>
            </div>

            {!visitResult.visit.access_granted && (
              <div className="visit-result-row">
                <span>Reason</span>
                <strong>
                  {visitResult.visit.denial_reason || "No reason provided."}
                </strong>
              </div>
            )}

            <div className="visit-result-row">
              <span>Amount Paid</span>
              <strong>{visitResult.visit.amount_paid}</strong>
            </div>

            <div className="form-group">
              <div
                className={`employee-message ${
                  visitResult.visit.access_granted
                    ? "employee-message-success"
                    : "employee-message-error"
                }`}
              >
                {visitResult.message || "No message available."}
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: "16px" }}>
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

      <Modal
        className="modal-box"
        isOpen={showSearchModal}
        showCloseButton={false}
        title="Search Member"
        onClose={() => {
          setShowSearchModal(false);
          setSearchText("");
          setSearchResults([]);
          setIsSearching(false);
        }}
      >
        <div className="employee-form">
          <div className="form-group">
            <label>Search</label>
            <input
              className="employee-input"
              type="text"
              placeholder="Enter member name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Results</label>

            <div
              className="search-results-container"
              style={{
                minHeight: "120px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                background: "#fff",
                maxHeight: "250px",
                overflowY: "auto",
                color: "#04354F",
              }}
            >
              {!searchText.trim() ? (
                <p style={{ margin: 0, textAlign: "center" }}>
                  Start typing to search members.
                </p>
              ) : isSearching ? (
                <p style={{ margin: 0, textAlign: "center" }}>Searching...</p>
              ) : searchResults.length === 0 ? (
                <p style={{ margin: 0, textAlign: "center" }}>
                  No results found.
                </p>
              ) : (
                searchResults.map((member) => (
                  <div
                    key={member.member_id}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedMember(member);
                      setShowConfirmModal(true);
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      {member.first_name} {member.last_name}
                    </div>

                    <div style={{ fontSize: "13px", color: "#666" }}>
                      {member.first_name} {member.last_name}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 10 }}>
            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={() => {
                setShowSearchModal(false);
                setSearchText("");
                setSearchResults([]);
                setIsSearching(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        className="modal-box"
        isOpen={showConfirmModal}
        showCloseButton={false}
        title="Confirm Admission"
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedMember(null);
        }}
      >
        <div className="employee-form">
          <div className="form-group" style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
              Admit this Member?
            </p>

            {selectedMember && (
              <p style={{ marginTop: "10px", color: "#666", fontSize: "25px" }}>
                {selectedMember.first_name} {selectedMember.last_name}
              </p>
            )}
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 10 }}>
            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={async () => {
                if (!selectedMember) return;

                try {
                  const result = await scanVisit({
                    member_id: selectedMember.member_id,
                    direction: "inbound",
                  });

                  setShowConfirmModal(false);
                  setShowSearchModal(false);
                  setSelectedMember(null);
                  setSearchText("");
                  setSearchResults([]);
                  setIsSearching(false);

                  setVisitResult(result);
                  setShowModal(true);
                } catch (err: any) {
                  console.error(
                    "Failed to scan selected member:",
                    err?.message || err,
                  );
                  playErrorSound();
                }
              }}
            >
              Yes
            </Button>

            <Button
              type="button"
              className="btn-modal"
              onClick={() => {
                setShowConfirmModal(false);
                setSelectedMember(null);
              }}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>

      <EmployeeMenu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
        onBeforeLogout={() => stopQrScanner()}
      />
    </div>
  );
};

export default QRScannerHome;
