
import React, { useEffect, useState } from "react";

import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import PosNav from "../../components/Reusable/NavItems";
import "./ManageStatusMem.css";
import { Modal } from "../../components/Reusable/Modals";
import { getMemberById, Member, deleteMember} from "../../logicHandlers/memberCrud";

interface RouteParams {
  memberId: string;
}

const ManageStatusMemPage: React.FC = () => {
  const history = useHistory();
  const { memberId } = useParams<RouteParams>();

  const [member, setMember] = useState<Member | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const loadMember = async () => {
      try {
        const data = await getMemberById(memberId);
        setMember(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadMember();
  }, [memberId]);
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
            <h2 className="member-name">
              {member ? `${member.first_name} ${member.last_name}` : "Loading..."}
            </h2>
            <div className="member-details">
              <h4 className="member-type">
                {member
                  ? member.membership_type === 0
                    ? "Member"
                    : "Casual"
                  : ""}
              </h4>
              <h4 className="member-duration">
                {member?.membership_expiry ?? "No Expiry"}
              </h4>
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
            <Button
              type="button"
              className="cancel-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        showCloseButton={false}
        className="confirm-modal"
      >
        <p>Are you sure you want to delete this member?</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <Button
            type="button"
            className="renew-btn"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="cancel-btn"
            onClick={async () => {
              if (!member) return;

              try {
                await deleteMember(member.member_id);

                setShowDeleteModal(false);   // close confirm
                setShowSuccessModal(true);   // open success modal

              } catch (error) {
                console.error(error);
                alert("Delete failed");
              }
            }}
          >
            Confirm Delete
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          history.push("/status-member");
        }}
        title="Member Deleted"
        showCloseButton={false}
      >
        <p style={{ textAlign: "center" }}>
          The member has been successfully deleted.
        </p>

        <div className="success-actions">
          <Button
            type="button"
            className="renew-btn"
            onClick={() => {
              setShowSuccessModal(false);
              history.push("/status-member");
            }}
          >
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageStatusMemPage;