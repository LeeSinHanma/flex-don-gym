import React, { useState } from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { Modal } from "../../components/Reusable/Modals";
import { createMember } from "../../logicHandlers/memberCrud"; // adjust path if different
import { generateGymQr } from "../../logicHandlers/qrGenModule";
import QRCode from "react-qr-code";
import "./Member.css";

const MemberMenu: React.FC = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [acceptedData, setAcceptedData] = useState<{
    email: string;
    contactNumber: string;
    firstName: string;
    lastName: string;
    qrValue: string;
  } | null>(null);

  const handleAddMember = async () => {
    console.log("Add button clicked");

    const trimmedEmail = email.trim();
    const trimmedContact = contactNumber.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedEmail || !trimmedContact || !trimmedFirstName || !trimmedLastName) {
      alert("All fields are required.");
      return;
    }

    const accepted = {
      email: trimmedEmail,
      contactNumber: trimmedContact,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
    };

    try {
      const response = await createMember(
        trimmedEmail,
        trimmedContact,
        trimmedFirstName,
        trimmedLastName,
        0, 1, 0, 1
      );

      console.log("API SUCCESS RESPONSE:", response);

      const qrValue = response?.member_id; // ✅ use member_id

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
      });

      setShowModal(true);
    } catch (err: any) {
      console.log("API ERROR:", err.message);
      alert(err.message || "Failed to add member");
    }
  };

  return (
    <div className="member-menu-container">
      <div className="main-container">
        <div className="top-container">
          <div className="top-item-container">
            <BackButton
              className="btn btn-back"
              onClick={() => history.push("/menu")}
            >
              <IonIcon icon={arrowBackOutline} />
            </BackButton>
            <h1>Member</h1>
          </div>
        </div>

        <div className="form-container">
          <UsernameInput
            className="input-username"
            placeholder="Email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />

          <UsernameInput
            className="input-username"
            placeholder="Contact number"
            type="number"
            value={contactNumber}
            onChange={(e: any) => setContactNumber(e.target.value)}
          />

          <UsernameInput
            className="input-username"
            placeholder="First name"
            value={firstName}
            onChange={(e: any) => setFirstName(e.target.value)}
          />

          <UsernameInput
            className="input-username"
            placeholder="Last name"
            value={lastName}
            onChange={(e: any) => setLastName(e.target.value)}
          />
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

      {/* MODAL */}
      <Modal
        className="modal-box"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setAcceptedData(null);
          setEmail("");
          setContactNumber("");
          setFirstName("");
          setLastName("");
        }}
        title="Member Details"
      >
        {acceptedData ? (
          <div className="accepted-details">
            <p><b>Email:</b> {acceptedData.email}</p>
            <p><b>Contact:</b> {acceptedData.contactNumber}</p>
            <p><b>First Name:</b> {acceptedData.firstName}</p>
            <p><b>Last Name:</b> {acceptedData.lastName}</p>

            {/* ✅ Add this at the bottom */}
            <div className="qr-section">
              <p className="qr-label">QR Code:</p>

              <div className="qr-wrapper">
                <QRCode value={acceptedData.qrValue} size={180} />
              </div>

              <p className="qr-value-text">{acceptedData.qrValue}</p>
            </div>
          </div>
        ) : (
          <p>No accepted data.</p>
        )}
      </Modal>
    </div>
  );
};

export default MemberMenu;