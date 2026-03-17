import React, { useEffect, useState } from "react";

import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import "./ManageStatusMem.css";
import { Modal } from "../../components/Reusable/Modals";
import { IonImg } from "@ionic/react";
import dondonLogo from "../../resource/dondon-logo.png";
import { getVisitsByMemberId, Visit } from "../../logicHandlers/visits";
import {
  getMemberById,
  Member,
  deleteMember,
  updateMember,
} from "../../logicHandlers/memberCrud";
import { getMembershipTypeById } from "../../logicHandlers/membershipCrud";

import QRCode from "react-qr-code";

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
  const [membershipName, setMembershipName] = useState("");
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [addCredits, setAddCredits] = useState("");
  const [visits, setVisits] = useState<Visit[]>([]);

  const formatDateDash = (dateString: string) => {
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  useEffect(() => {
    const loadMember = async () => {
      try {
        const data = await getMemberById(memberId);
        setMember(data);

        if (data.membership_plan_id) {
          const membershipData = await getMembershipTypeById(
            data.membership_plan_id,
          );
          setMembershipName(membershipData.name);
        }

        const visitData = await getVisitsByMemberId(memberId);
        setVisits(visitData);
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
        <div className="member-container member-container-member">
          <div className="member-info">
            <h2 className="member-name">
              <div>
                {member
                  ? `${member.first_name} ${member.last_name}`
                  : "Loading..."}
              </div>
            </h2>

            <div className="member-details">
              <h4 className="member-type">
                <strong>Contact Number:</strong>{" "}
                {member?.contact_number || "Loading..."}
              </h4>

              <h4 className="member-type">
                <strong>Membership Type:</strong>{" "}
                {membershipName || "Loading..."}
              </h4>

              <h4 className="member-type">
                <strong>Credits:</strong> {member?.credits ?? 0}
              </h4>

              <h4 className="member-duration">
                <strong>End of Membership:</strong>{" "}
                {member?.membership_expiry
                  ? formatDateDash(member.membership_expiry)
                  : "No Expiry"}
              </h4>
            </div>
          </div>
        </div>
        <div className="middle-container">
          <div className="history-box">
            <p className="history-info">History:</p>

            {visits.length === 0 ? (
              <p>No visit history found.</p>
            ) : (
              visits.map((visit) => (
                <div key={visit.visit_id} className="history-item">
                  <p>
                    <strong>{visit.direction}</strong> - {formatDateTime(visit.created_at)}
                  </p>
                  <p>
                    Access: {visit.access_granted ? "Granted" : "Denied"}
                  </p>
                  {!visit.access_granted && visit.denial_reason && (
                    <p>Reason: {visit.denial_reason}</p>
                  )}
                  {visit.amount_paid > 0 && <p>Amount Paid: ₱{visit.amount_paid}</p>}
                </div>
              ))
            )}
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
            <Button
              type="button"
              className="renew-btn"
              onClick={() => history.push(`/members/edit/${memberId}`)}
            >
              Edit
            </Button>
            <Button
              type="button"
              className="renew-btn"
              onClick={() => setShowRenewModal(true)}
            >
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
        className="modal-box"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="DONDON'S FITNESS GYM"
        headerImage={<IonImg src={dondonLogo} className="modal-dondon-logo" />}
      >
        <div className="qr-wrapper">
          {member ? (
            <QRCode value={member.member_id} size={250} />
          ) : (
            <p>Loading QR...</p>
          )}
        </div>

        <p className="qr-member-name">
          {member ? `${member.first_name} ${member.last_name}` : "Loading..."}
        </p>
      </Modal>

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

                setShowDeleteModal(false); // close confirm
                setShowSuccessModal(true); // open success modal
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
        showCloseButton={false}
        title="Member Deleted"
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

      <Modal
        isOpen={showRenewModal}
        onClose={() => setShowRenewModal(false)}
        title="Add Credit / Duration"
        showCloseButton={false}
        className="confirm-modal"
      >
        <div className="renew-modal-content">
          <div className="form-group">
            <label>Add Credits</label>
            <input
              className="employee-input"
              type="number"
              value={addCredits}
              onChange={(e) => setAddCredits(e.target.value)}
              placeholder="Enter credits"
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <Button
              type="button"
              className="renew-btn"
              onClick={async () => {
                if (!member) return;

                try {
                  const creditsToAdd = Number(addCredits);

                  if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
                    alert("Please enter a valid credit amount.");
                    return;
                  }

                  const payload = {
                    first_name: member.first_name,
                    last_name: member.last_name,
                    email: member.email,
                    contact_number: member.contact_number,
                    membership_plan_id: member.membership_plan_id,
                    membership_expiry: member.membership_expiry,
                    credits: (member.credits ?? 0) + creditsToAdd,
                  };

                  const updated = await updateMember(member.member_id, payload);

                  setMember(updated);
                  setAddCredits("");
                  setShowRenewModal(false);
                } catch (error) {
                  console.error(error);
                  alert("Failed to update member.");
                }
              }}
            >
              Confirm
            </Button>

            <Button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowRenewModal(false);
                setAddCredits("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageStatusMemPage;
