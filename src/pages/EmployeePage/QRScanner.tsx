import React, { useEffect, useState, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Network } from "@capacitor/network";
import { processQrOffline } from "../../logicHandlers/offlineQr";
import "./QRScanner.css";
import { Button } from "../../components/Reusable/Button";
import { Modal } from "../../components/Reusable/Modals";
import {
  startQrScanner,
  stopQrScanner,
} from "../../logicHandlers/qrScannerModule";
import { scanVisit } from "../../logicHandlers/visits";
import Menu from "../../components/Reusable/Menu";
import { IonIcon, IonImg } from "@ionic/react";
import { search, menu } from "ionicons/icons";
import { getMemberByName, Member } from "../../logicHandlers/memberCrud";
import dondonLogo from "../../resource/dondon-logo.png";
import ConfirmModal from "../../components/Reusable/ConfirmModal";
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

type OfflineQrResult = {
  success: boolean;
  message: string;
  member: {
    member_id: string;
    first_name: string | null;
    last_name: string | null;
    membership_type: number | null;
  } | null;
};

function mapOfflineResultToVisitResult(
  memberId: string,
  result: OfflineQrResult
): ScanVisitResult {
  return {
    visit: {
      visit_id: 0,
      member_id: result.member?.member_id ?? memberId,
      direction: "inbound",
      access_granted: result.success,
      denial_reason: result.success ? "" : result.message,
      amount_paid: 0,
      created_at: new Date().toISOString(),
    },
    member_name: result.member
      ? `${result.member.first_name ?? ""} ${result.member.last_name ?? ""}`.trim()
      : "Unknown Member",
    membership_type: result.member?.membership_type ?? -1,
    message: result.message,
  };
}

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

  const processVisit = useCallback(async (memberId: string) => {
    const status = await Network.getStatus();

    if (status.connected) {
      return await scanVisit({
        member_id: memberId,
        direction: "inbound",
      });
    }

    const offlineResult = await processQrOffline(memberId);
    return mapOfflineResultToVisitResult(memberId, offlineResult);
  }, []);

  const playSuccessSound = () => {
    if (scanAudio.current) {
      scanAudio.current.currentTime = 0;
      scanAudio.current.play().catch(() => { });
    }
  };

  const playErrorSound = () => {
    if (errorAudio.current) {
      errorAudio.current.currentTime = 0;
      errorAudio.current.play().catch(() => { });
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

      const result = await processVisit(id);

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
  }, [processVisit]);

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
                className={`employee-message ${visitResult.visit.access_granted
                  ? "employee-message-success"
                  : "employee-message-error"
                  }`}
              >
                {visitResult.message || "No message available."}
              </div>
            </div>

            <div
              className="form-actions"
              style={{ marginTop: "16px", display: "flex", gap: "10px" }}
            >
              {!visitResult.visit.access_granted &&
                visitResult.visit.denial_reason === "No remaining credits" && (
                  <Button
                    type="button"
                    className="renew-btn"
                    onClick={() => {
                      console.log("Add Cash payment", {
                        member_id: visitResult.visit.member_id,
                        name: visitResult.member_name,
                        reason: visitResult.visit.denial_reason,
                      });
                    }}
                  >
                    Pay Via Cash
                  </Button>
                )}

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

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirm Admission"
        message={
          selectedMember
            ? `Admit ${selectedMember.first_name} ${selectedMember.last_name}?`
            : "Admit this member?"
        }
        confirmText="Admit"
        cancelText="Cancel"
        onCancel={() => {
          setShowConfirmModal(false);
          setSelectedMember(null);
        }}
        onConfirm={async () => {
          if (!selectedMember) return;

          try {
            const result = await processVisit(selectedMember.member_id);

            setShowConfirmModal(false);
            setShowSearchModal(false);
            setSelectedMember(null);
            setSearchText("");
            setSearchResults([]);
            setIsSearching(false);

            setVisitResult(result);
            setShowModal(true);

            if (result.visit.access_granted) {
              playSuccessSound();
            } else {
              playErrorSound();
            }
          } catch (err: any) {
            console.error(
              "Failed to scan selected member:",
              err?.message || err,
            );
            playErrorSound();
          }
        }}
      />

      <Menu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
        onBeforeLogout={() => stopQrScanner()}
      />
    </div>
  );
};

export default QRScannerHome;
