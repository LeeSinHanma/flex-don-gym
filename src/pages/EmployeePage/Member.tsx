import React, { useState } from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { Modal } from "../../components/Reusable/Modals";
import { createMember } from "../../logicHandlers/memberCrud"; // adjust path if different
import "./Member.css";

const MemberMenu: React.FC = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleAddMember = async () => {
    console.log("Add button clicked");

    // Trim values
    const trimmedEmail = email.trim();
    const trimmedContact = contactNumber.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    // 🔎 Empty field checker
    if (
      !trimmedEmail ||
      !trimmedContact ||
      !trimmedFirstName ||
      !trimmedLastName
    ) {
      alert("All fields are required.");
      return; // ❌ stop here
    }

    console.log("Form Data:", {
      trimmedEmail,
      trimmedContact,
      trimmedFirstName,
      trimmedLastName,
    });

    try {
      const response = await createMember(
        trimmedEmail,
        trimmedContact,
        trimmedFirstName,
        trimmedLastName,
        0,
        1,
        0,
        1,
      );

      console.log("API SUCCESS RESPONSE:", response);
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
          <BackButton
            className="btn btn-back"
            onClick={() => history.push("/menu")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>
          <h1>Member</h1>
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
            // onClick={() => setShowModal(true)}
          >
            Add
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        className="modal-box"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="QR Code"
      >
        <h2>Member Added</h2>
        <p>This is the QR</p>
      </Modal>
    </div>
  );
};

export default MemberMenu;
