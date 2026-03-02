import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import PosNav from "../../components/Reusable/NavItems";
import "./ManageStatusMem.css";
import { Modal } from "../../components/Reusable/Modals";
import { IonImg } from "@ionic/react";
import dondonLogo from "../../resource/dondon-logo.png";

const ManageStatusMemPage: React.FC = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="manage-member-container">
      <div className="main-container">
        <div className="status-top-header">
          <BackButton
            className="btn status-btn-back"
            onClick={() => history.push("/status-member")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>
          <h2>Manage Member</h2>
        </div>
        <div className="member-container">
          <div className="member-info">
            <h2 className="member-name">Juan</h2>
            <div className="member-details">
              <h4 className="member-type">Member</h4>
              <h4 className="member-duration">10 months left</h4>
            </div>
          </div>
        </div>
        <div className="middle-container">
          <div className="history-box">
            <p className="history-info">History:</p>
          </div>

          <Button
            className="btn-qr"
            type="button"
            onClick={() => setShowModal(true)}
          >
            Show QR Code
          </Button>
        </div>

        <div className="status-button-container">
          <div className="status-button">
            <Button type="button" className="renew-btn">
              Edit
            </Button>
            <Button type="button" className="renew-btn">
              Renew
            </Button>
            <Button type="button" className="cancel-btn">
              Delete
            </Button>
          </div>
        </div>

        {/*<div className="pos-container">
          <PosNav
            items={[
              { label: "POS", path: "/pos" },
              { label: "QR Scanner", path: "/qr" },
              { label: "Status", path: "/status-member" },
            ]}
          />
        </div>*/}
      </div>

      <Modal
        className="modal-box"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="DONDON'S FITNESS GYM"
        headerImage={<IonImg src={dondonLogo} className="modal-dondon-logo" />}
      >
        <div className="qr-wrapper">
          <IonImg src={dondonLogo} className="qr-image" alt="QR code" />
        </div>
        <p className="qr-member-name">Juan Dela Cruz</p>
      </Modal>
    </div>
  );
};

export default ManageStatusMemPage;
