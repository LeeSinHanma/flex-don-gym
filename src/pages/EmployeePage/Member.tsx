import React, { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { Modal } from "../../components/Reusable/Modals";
import { createMember } from "../../logicHandlers/memberCrud";
import dondonLogo from "../../resource/dondon-logo.png";
import QrCodeModal from "../../components/Reusable/QrCodeModal";
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
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [membershipType, setMembershipType] = useState<number>(0);
  const [credits, setCredits] = useState<number | "">("");
  const [amountGiven, setAmountGiven] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash">("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [membershipTypes, setMembershipTypes] = useState<
    MembershipTypeResponse[]
  >([]);
  const qrCardRef = useRef<HTMLDivElement | null>(null);

  const [acceptedData, setAcceptedData] = useState<{
    email: string;
    contactNumber: string;
    firstName: string;
    lastName: string;
    qrValue: string;
    paymentMethod: string;
    amountGiven: number | string;
  } | null>(null);

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
      alert("Failed to download QR image.");
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
      alert("All fields are required.");
      return;
    }

    if (membershipType === 0) {
      alert("Please select a membership.");
      return;
    }

    if (amountGiven === "" || Number(amountGiven) < 0) {
      alert("Please enter a valid amount given.");
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
      });

      const qrValue = response?.member_id;
      if (!qrValue) {
        alert("Member created but member_id is missing.");
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
      alert(err.message || "Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className="member-menu-container">
        <div className="main-container">
          <div className="top-container">
            <div className="top-item-container">
              <BackButton
                className="btn btn-back"
                onClick={() => history.push("/menu")}
              >
                <IonIcon icon={arrowBack} />
              </BackButton>
              <h1>ADD MEMBER</h1>
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
                    paymentMethod === "cash" ? "payment-active" : "payment-inactive"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  Cash
                </Button>

                <Button
                  type="button"
                  className={`payment-btn ${
                    paymentMethod === "gcash" ? "payment-active" : "payment-inactive"
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
          logoSrc={dondonLogo}
          downloadFileName={
            acceptedData
              ? `${acceptedData.firstName}-${acceptedData.lastName}-qr`
              : "member-qr"
          }
        />
      </div>
    </>
  );
};

export default MemberMenu;