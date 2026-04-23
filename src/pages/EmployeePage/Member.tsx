import React, { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import Menu from "../../components/Reusable/Menu";
import useResponsiveView from "../../hooks/useResponsiveView";
import { Modal } from "../../components/Reusable/Modals";
import { createMember } from "../../logicHandlers/memberCrud";
import dondonLogo from "../../resource/dondon-logo.png";
import QrCodeModal from "../../components/Reusable/QrCodeModal";
import StatusModal from "../../components/Reusable/StatusModal";
import {
  getMembershipTypes,
  MembershipTypeResponse,
} from "../../logicHandlers/membershipCrud";
import LoadingScreen from "../LoadingScreen";
import QRCode from "react-qr-code";
import { getCurrentUser } from "../../logicHandlers/userServices";
import "./Member.css";

const MemberMenu: React.FC = () => {
  const history = useHistory();
  const isMobileView = useResponsiveView();
  const [showModal, setShowModal] = useState(false);
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [membershipType, setMembershipType] = useState<number>(0);
  const [credits, setCredits] = useState<number | "">("");
  const [amountGiven, setAmountGiven] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash">("cash");
  const [note, setNote] = useState("");
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [membershipTypes, setMembershipTypes] = useState<
    MembershipTypeResponse[]
  >([]);
  const qrCardRef = useRef<HTMLDivElement | null>(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const [acceptedData, setAcceptedData] = useState<{
    email: string;
    contactNumber: string;
    firstName: string;
    lastName: string;
    qrValue: string;
    paymentMethod: string;
    amountGiven: number | string;
  } | null>(null);

  const openStatusModal = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
  ) => {
    setStatusTitle(title);
    setStatusMessage(message);
    setStatusType(type);
    setShowStatusModal(true);
  };

  useEffect(() => {
    const loadMemberships = async () => {
      try {
        const data = await getMembershipTypes();
        setMembershipTypes(data);
      } catch (err) {
        console.error("Failed to load membership types", err);
      }
    };

    loadMemberships();
  }, []);

  const resetForm = () => {
    setEmail("");
    setContactNumber("");
    setFirstName("");
    setLastName("");
    setMembershipType(0);
    setCredits("");
    setAmountGiven("");
    setPaymentMethod("cash");
    setNote("");
    setCreatedAt(new Date().toISOString().split("T")[0]);
  };

  const handleDownloadQr = async () => {
    if (!qrCardRef.current || !acceptedData) return;

    try {
      const dataUrl = await htmlToImage.toPng(qrCardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        canvasWidth: 360,
        canvasHeight: qrCardRef.current.offsetHeight,
      });

      const link = document.createElement("a");
      link.download = `${acceptedData.firstName}-${acceptedData.lastName}-qr.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download QR image:", error);
      openStatusModal("Download Failed", "Failed to download QR image.", "error");
    }
  };

  const handleAddMember = async () => {
    console.log("Add button clicked");

    const trimmedEmail = email.trim();
    const trimmedContact = contactNumber.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (
      !trimmedEmail ||
      !trimmedContact ||
      !trimmedFirstName ||
      !trimmedLastName
    ) {
      openStatusModal("Validation Error", "All fields are required.", "warning");
      return;
    }

    if (membershipType === 0) {
      openStatusModal("No Membership selected", "Please select a membership.", "warning");
      return;
    }

    const selectedPlan = membershipTypes.find((m) => m.membership_id === membershipType);
    if (!selectedPlan) {
      openStatusModal("Invalid Membership", "The selected membership plan could not be found.", "error");
      return;
    }

    const planCost = selectedPlan.price || 0;
    const creditsAdded = credits === "" ? 0 : Number(credits);
    const expectedAmount = planCost + creditsAdded;

    if (amountGiven === "" || Number(amountGiven) < expectedAmount) {
      openStatusModal(
        "Insufficient Amount", 
        `Please enter a valid amount. Expected at least ₱${expectedAmount} (Plan: ₱${planCost} + Credits: ₱${creditsAdded}).`, 
        "warning"
      );
      return;
    }

    setIsLoading(true);
    try {
      const user = getCurrentUser() || {};

      const response = await createMember({
        email: trimmedEmail,
        contact_number: trimmedContact,
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        membership_plan_id: membershipType,
        credits: credits === "" ? 0 : credits,
        registered_by: String(user.userID || user.user_id || "unknown"),
        payment_method: paymentMethod,
        amount_given: Number(amountGiven),
        created_at: createdAt,
        note: note.trim(),
      });

      const qrValue = response?.member_id;
      if (!qrValue) {
        openStatusModal("Data Error", "Member created but member_id is missing.", "error");
        return;
      }

      setAcceptedData({
        email: response.email,
        contactNumber: response.contact_number,
        firstName: response.first_name,
        lastName: response.last_name,
        qrValue,
        paymentMethod,
        amountGiven,
      });

      setShowModal(true);
    } catch (err: any) {
      console.log("API ERROR:", err.message);
      openStatusModal("Failed to add member", err.message || "Something went wrong.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Menu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
      />
      <div className="member-menu-container">
        <div className="main-container">
          <div className="top-container">
            <div className="top-item-container">
              <BackButton
                className="btn btn-back"
                onClick={() => history.push("/status-member")}
              >
                <IonIcon icon={arrowBack} />
              </BackButton>
              <h1>ADD MEMBER</h1>
              {isMobileView && (
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setShowEmployeeMenu(true)}
                  aria-label="Open menu"
                >
                  <IonIcon icon={menu} />
                </button>
              )}
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label>Email</label>
              <UsernameInput
                className="input-username"
                placeholder="Enter email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <UsernameInput
                className="input-username"
                placeholder="Enter contact number"
                type="number"
                value={contactNumber}
                onChange={(e: any) => setContactNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>First Name</label>
              <UsernameInput
                className="input-username"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e: any) => setFirstName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <UsernameInput
                className="input-username"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e: any) => setLastName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Membership Type</label>
              <select
                className="input-username"
                style={{ fontSize: "12px" }}
                value={membershipType}
                onChange={(e) => setMembershipType(Number(e.target.value))}
              >
                <option value={0}>Select Membership</option>

                {membershipTypes.map((membership) => (
                  <option
                    key={membership.membership_id}
                    value={membership.membership_id}
                    style={{ fontWeight: "bold" }}
                  >
                    {membership.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Credits</label>
              <UsernameInput
                className="input-username"
                placeholder="Enter credit amount"
                type="number"
                value={credits}
                onChange={(e: any) =>
                  setCredits(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-method-group">
                <Button
                  type="button"
                  className={`payment-btn ${
                    paymentMethod === "cash"
                      ? "payment-active"
                      : "payment-inactive"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  Cash
                </Button>

                <Button
                  type="button"
                  className={`payment-btn ${
                    paymentMethod === "gcash"
                      ? "payment-active"
                      : "payment-inactive"
                  }`}
                  onClick={() => setPaymentMethod("gcash")}
                >
                  GCash
                </Button>
              </div>
            </div>

            <div className="form-group">
              <label>Amount Given</label>
              <UsernameInput
                className="input-username"
                placeholder="Enter amount given"
                type="number"
                value={amountGiven}
                onChange={(e: any) =>
                  setAmountGiven(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
              {membershipType !== 0 && (
                <p style={{ margin: "4px 0 0 4px", fontSize: "12px", color: "var(--ion-color-medium, #666)" }}>
                  Expected amount to pay: ₱{(membershipTypes.find((m) => m.membership_id === membershipType)?.price || 0) + (credits === "" ? 0 : Number(credits))}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Registration Date</label>
              <div 
                className="input-username" 
                style={{ position: "relative", display: "flex", alignItems: "center", cursor: "pointer", overflow: "hidden" }}
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) {
                    try {
                      (input as any).showPicker();
                    } catch (err) {
                      // Fallback for browsers that don't support showPicker
                      input.click();
                    }
                  }
                }}
              >
                <span style={{ pointerEvents: "none" }}>
                  {new Date(createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <input
                  type="date"
                  value={createdAt}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCreatedAt(e.target.value || new Date().toISOString().split("T")[0])}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Note</label>
              <UsernameInput
                className="input-username"
                placeholder="Enter a note (optional)"
                value={note}
                onChange={(e: any) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="bottom-container">
            <Button
              className="btn-submit"
              type="button"
              onClick={handleAddMember}
            >
              Add
            </Button>
          </div>
        </div>

        <Modal
          className="modal-box"
          isOpen={showModal}
          showCloseButton={false}
          onClose={() => {
            setShowModal(false);
            setShowQrModal(false);
            setAcceptedData(null);
            resetForm();
          }}
          title="Member Details"
        >
          {acceptedData ? (
            <div className="employee-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  className="employee-input"
                  value={acceptedData.email}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Contact</label>
                <input
                  className="employee-input"
                  value={acceptedData.contactNumber}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>First Name</label>
                <input
                  className="employee-input"
                  value={acceptedData.firstName}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  className="employee-input"
                  value={acceptedData.lastName}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <input
                  className="employee-input"
                  value={acceptedData.paymentMethod}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Amount Given</label>
                <input
                  className="employee-input"
                  value={acceptedData.amountGiven}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>QR Code</label>

                <Button
                  type="button"
                  className="btn-modal btn-submit-modal"
                  onClick={() => setShowQrModal(true)}
                >
                  Show QR Code
                </Button>
              </div>

              <div
                className="form-actions"
                style={{ display: "flex", gap: 10 }}
              >
                <Button
                  type="button"
                  className="btn-modal btn-submit-modal"
                  onClick={() => {
                    setShowModal(false);
                    setAcceptedData(null);
                    resetForm();
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="employee-form">
              <p style={{ textAlign: "center", margin: 0 }}>
                No accepted data.
              </p>
            </div>
          )}
        </Modal>

        <QrCodeModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          qrValue={acceptedData?.qrValue}
          memberName={
            acceptedData
              ? `${acceptedData.firstName} ${acceptedData.lastName}`
              : ""
          }
          memberEmail={acceptedData?.email || ""}
          logoSrc={dondonLogo}
          downloadFileName={
            acceptedData
              ? `${acceptedData.firstName}-${acceptedData.lastName}-qr`
              : "member-qr"
          }
        />

        <StatusModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          title={statusTitle}
          message={statusMessage}
          type={statusType}
        />
      </div>
    </>
  );
};

export default MemberMenu;
