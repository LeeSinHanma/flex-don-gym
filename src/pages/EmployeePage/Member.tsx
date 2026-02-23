import React, { useState } from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { Modal } from "../../components/Reusable/Modals";
import "./Member.css";

const MemberMenu: React.FC = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);

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
          <UsernameInput className="input-username" placeholder="Email" />
          <UsernameInput
            className="input-username"
            placeholder="Contact number"
            type="number"
          />
          <UsernameInput className="input-username" placeholder="First name" />
          <UsernameInput className="input-username" placeholder="Last name" />
        </div>

        <div className="bottom-container">
          <Button
            className="btn-submit"
            type="button"
            onClick={() => setShowModal(true)}
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
