import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import "./QRScanner.css";
import { Button } from "../../components/Reusable/Button";
import { Modal } from "../../components/Reusable/Modals";
import {
  startQrScanner,
  stopQrScanner,
} from "../../logicHandlers/qrScannerModule";
import { scanVisit } from "../../logicHandlers/visits";
import PosNav from "../../components/Reusable/NavItems";
import { IonIcon, IonImg } from "@ionic/react";
import { search } from "ionicons/icons";
import { getMemberByName, Member } from "../../logicHandlers/memberCrud";
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

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

      setVisitResult(result);
      setShowModal(true);
    } catch (err: any) {
      console.error("Failed to scan visit:", err?.message || err);
    }
  }, []);

  const restartScanner = useCallback(async () => {
    await stopQrScanner();
    await startQrScanner("member", handleDecoded);
  }, [handleDecoded]);

  useEffect(() => {
    startQrScanner("member", handleDecoded);

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

  return (
    <div className="main-qr-container">
      <div className="main-container">
        <div className="text-container">
          <IonImg src={dondonLogo} className="login-logo" />
          <p>Scan QR code</p>

          <div
            className="search-icon"
            onClick={() => setShowSearchModal(true)}
            style={{ cursor: "pointer" }}
          >
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

      {/* VISIT RESULT MODAL */}

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
                value={getMembershipLabel(visitResult.membership_type)}
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

      {/* SEARCH MEMBER MODAL */}

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
                    onClick={async () => {
                      try {
                        const result = await scanVisit({
                          member_id: member.member_id,
                          direction: "inbound",
                        });

                        setShowSearchModal(false);
                        setSearchText("");
                        setSearchResults([]);

                        setVisitResult(result);
                        setShowModal(true);
                      } catch (err: any) {
                        console.error(
                          "Failed to scan selected member:",
                          err?.message || err,
                        );
                      }
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
    </div>
  );
};

export default QRScannerHome;
