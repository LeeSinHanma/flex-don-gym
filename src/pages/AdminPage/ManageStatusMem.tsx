import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import "./ManageStatusMem.css";
import { Modal } from "../../components/Reusable/Modals";
import ConfirmModal from "../../components/Reusable/ConfirmModal";
import dondonLogo from "../../resource/dondon-logo.png";
import { getVisitsByMemberId, Visit } from "../../logicHandlers/visits";
import {
  getMemberById,
  Member,
  deleteMember,
  updateMember,
  addMemberCredit,
  AddCreditPayload,
  renewMember,
  RenewMemberPayload,
} from "../../logicHandlers/memberCrud";
import { getCurrentUser } from "../../logicHandlers/userServices";
import { getMembershipTypeById, getMembershipTypes, MembershipTypeResponse } from "../../logicHandlers/membershipCrud";
import QrCodeModal from "../../components/Reusable/QrCodeModal";
import StatusModal from "../../components/Reusable/StatusModal";

interface RouteParams {
  memberId: string;
}

const ManageStatusMemPage: React.FC = () => {
  const history = useHistory();
  const { memberId } = useParams<RouteParams>();

  const [member, setMember] = useState<Member | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [membershipName, setMembershipName] = useState("");
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [addCredits, setAddCredits] = useState("");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showRenewConfirmModal, setShowRenewConfirmModal] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showRenewPlanModal, setShowRenewPlanModal] = useState(false);
  const [membershipTypes, setMembershipTypes] = useState<MembershipTypeResponse[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number>(0);
  const [renewCredits, setRenewCredits] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountGiven, setAmountGiven] = useState<string>("");
  const [note, setNote] = useState("");
  const [showPlanConfirmModal, setShowPlanConfirmModal] = useState(false);

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
    const loadMember = async () => {
      try {
        const data = await getMemberById(memberId);
        setMember(data);

        if (data.membership_plan_id) {
          const membershipData = await getMembershipTypeById(
            data.membership_plan_id,
          );
          setMembershipName(membershipData.name || "Unknown");
        }

        const visitData = await getVisitsByMemberId(memberId);
        setVisits(visitData);

        const types = await getMembershipTypes();
        setMembershipTypes(types);
      } catch (err) {
        console.error(err);
      }
    };

    loadMember();
  }, [memberId]);

  const handleRenewMember = async () => {
    if (!member) return;

    try {
      const creditsToAdd = Number(addCredits);

      if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
        openStatusModal(
          "Invalid Input",
          "Please enter a valid credit amount.",
          "warning",
        );
        return;
      }

      if (amountGiven === "" || Number(amountGiven) < 0) {
        openStatusModal(
          "Invalid Amount",
          "Please enter a valid amount given.",
          "warning",
        );
        return;
      }

      const user = getCurrentUser();
      const payload: AddCreditPayload = {
        credits: creditsToAdd,
        transacted_by: String(user?.userID || user?.user_id || "unknown"),
        payment_method: paymentMethod,
        amount_given: Number(amountGiven),
        note: note.trim(),
      };

      await addMemberCredit(member.member_id, payload);

      // Refresh member data
      const updated = await getMemberById(member.member_id);
      setMember(updated);
      
      // Reset form
      setAddCredits("");
      setAmountGiven("");
      setNote("");
      setShowRenewModal(false);

      openStatusModal(
        "Credits Added",
        `${creditsToAdd} credits added successfully.`,
        "success",
      );
    } catch (error: any) {
      console.error(error);
      setShowRenewConfirmModal(false);
      openStatusModal("Update Failed", error.message || "Failed to add credits.", "error");
    }
  };

  const handleFinalRenew = async () => {
    if (!member) return;

    try {
      if (selectedPlanId === 0) {
        openStatusModal("Selection Required", "Please select a membership plan.", "warning");
        return;
      }

      if (amountGiven === "" || Number(amountGiven) < 0) {
        openStatusModal("Invalid Amount", "Please enter a valid amount given.", "warning");
        return;
      }

      const creditsValue = Number(renewCredits) || 0;
      const user = getCurrentUser();
      const payload: RenewMemberPayload = {
        member_id: member.member_id,
        membership_plan_id: selectedPlanId,
        credits: creditsValue === 0 ? null : creditsValue,
        transacted_by: String(user?.userID || user?.user_id || "unknown"),
        payment_method: paymentMethod,
        amount_given: Number(amountGiven),
        note: note.trim(),
      };

      console.log("Renew Payload:", payload);

      await renewMember(payload);

      // Refresh data
      const updated = await getMemberById(member.member_id);
      setMember(updated);
      
      if (updated.membership_plan_id) {
        const membershipData = await getMembershipTypeById(updated.membership_plan_id);
        setMembershipName(membershipData.name || "Unknown");
      }

      // Reset form
      setSelectedPlanId(0);
      setRenewCredits("");
      setAmountGiven("");
      setNote("");
      setPaymentMethod("Cash");
      setShowRenewPlanModal(false);

      openStatusModal(
        "Membership Renewed",
        "The membership has been successfully renewed.",
        "success"
      );
    } catch (error: any) {
      console.error(error);
      setShowPlanConfirmModal(false);
      openStatusModal("Renewal Failed", error.message || "Failed to renew membership.", "error");
    }
  };

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

        <div className="status-content-scroll">
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
                      <strong>{visit.direction}</strong> -{" "}
                      {formatDateTime(visit.created_at)}
                    </p>
                    <p>Access: {visit.access_granted ? "Granted" : "Denied"}</p>
                    {!visit.access_granted && visit.denial_reason && (
                      <p>Reason: {visit.denial_reason}</p>
                    )}
                    {visit.amount_paid > 0 && (
                      <p>Amount Paid: ₱{visit.amount_paid}</p>
                    )}
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
                onClick={() => setShowSelectionModal(true)}
              >
                Add/Renew
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
      </div>

      <QrCodeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        qrValue={member?.member_id}
        memberName={member ? `${member.first_name} ${member.last_name}` : ""}
        logoSrc={dondonLogo}
        downloadFileName={
          member ? `${member.first_name}-${member.last_name}-qr` : "member-qr"
        }
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${
          member ? `${member.first_name} ${member.last_name}` : "this member"
        }"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (!member) return;

          try {
            await deleteMember(member.member_id);
            setShowDeleteModal(false);
            setShouldRedirect(true);
            openStatusModal(
              "Member Deleted",
              "The member has been successfully deleted.",
              "success",
            );
          } catch (error) {
            console.error(error);
            openStatusModal(
              "Delete Failed",
              "Failed to delete member.",
              "error",
            );
          }
        }}
      />

      <ConfirmModal
        isOpen={showRenewConfirmModal}
        title="Confirm Credit Update"
        message={`Add ${addCredits || 0} credits to ${
          member ? `${member.first_name} ${member.last_name}` : "this member"
        }?`}
        confirmText="Confirm"
        cancelText="Cancel"
        onCancel={() => setShowRenewConfirmModal(false)}
        onConfirm={async () => {
          setShowRenewConfirmModal(false);
          await handleRenewMember();
        }}
      />

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);

          if (shouldRedirect) {
            setShouldRedirect(false);
            history.push("/status-member");
          }
        }}
        title={statusTitle}
        message={statusMessage}
        type={statusType}
      />

      <Modal
        isOpen={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        title="Choose Action"
        showCloseButton={false}
        className="selection-modal-v2"
      >
        <div className="renew-modal-content">
          <Button
            type="button"
            className="renew-btn"
            onClick={() => {
              setShowSelectionModal(false);
              setShowRenewModal(true); // This opens current Add Credit UI
            }}
          >
            Add Credit
          </Button>

          <Button
            type="button"
            className="renew-btn"
            onClick={() => {
              setShowSelectionModal(false);
              // Pre-fill values for renewal
              setSelectedPlanId(member?.membership_plan_id || 0);
              setRenewCredits("0");
              setAmountGiven("");
              setNote("");
              setPaymentMethod("Cash");
              setShowRenewPlanModal(true);
            }}
          >
            Renew Membership
          </Button>

          <Button
            type="button"
            className="cancel-btn"
            onClick={() => setShowSelectionModal(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showRenewPlanModal}
        onClose={() => {
          setShowRenewPlanModal(false);
          setSelectedPlanId(0);
          setRenewCredits("");
          setAmountGiven("");
          setNote("");
        }}
        title="Renew Membership"
        showCloseButton={false}
        className="renew-membership-modal-v2"
      >
        <div className="renew-modal-content">
          <div className="form-group">
            <label>Select Plan</label>
            <select
              className="employee-input"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(Number(e.target.value))}
            >
              <option value="0">Select a membership plan</option>
              {membershipTypes.map((type) => (
                <option key={type.membership_id} value={type.membership_id}>
                  {type.name} (₱{type.price})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Additional Credits</label>
            <input
              className="employee-input"
              type="number"
              value={renewCredits}
              onChange={(e) => setRenewCredits(e.target.value)}
              placeholder="Enter credits"
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              className="employee-input"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="GCash">GCash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount Given</label>
            <input
              className="employee-input"
              type="number"
              value={amountGiven}
              onChange={(e) => setAmountGiven(e.target.value)}
              placeholder="Enter amount given"
            />
          </div>

          <div className="form-group">
            <label>Note</label>
            <input
              className="employee-input"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "center" }}>
            <Button
              type="button"
              className="renew-btn"
              onClick={() => setShowPlanConfirmModal(true)}
            >
              Confirm
            </Button>

            <Button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowRenewPlanModal(false);
                setShowPlanConfirmModal(false);
                setSelectedPlanId(0);
                setRenewCredits("");
                setAmountGiven("");
                setNote("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showPlanConfirmModal}
        title="Confirm Renewal"
        message={`Are you sure you want to renew the membership for ${
          member ? `${member.first_name} ${member.last_name}` : "this member"
        }?`}
        confirmText="Confirm"
        cancelText="Cancel"
        onCancel={() => setShowPlanConfirmModal(false)}
        onConfirm={async () => {
          setShowPlanConfirmModal(false);
          await handleFinalRenew();
        }}
      />

      <Modal
        isOpen={showRenewModal}
        onClose={() => {
          setShowRenewModal(false);
          setAddCredits("");
          setAmountGiven("");
          setNote("");
        }}
        title="Add Credit"
        showCloseButton={false}
        className="add-credit-modal-v2"
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

          <div className="form-group">
            <label>Payment Method</label>
            <select
              className="employee-input"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="GCash">GCash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount Given</label>
            <input
              className="employee-input"
              type="number"
              value={amountGiven}
              onChange={(e) => setAmountGiven(e.target.value)}
              placeholder="Enter amount given"
            />
          </div>

          <div className="form-group">
            <label>Note</label>
            <input
              className="employee-input"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "center" }}>
            <Button
              type="button"
              className="renew-btn"
              onClick={() => setShowRenewConfirmModal(true)}
            >
              Confirm
            </Button>

            <Button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowRenewModal(false);
                setShowRenewConfirmModal(false);
                setAddCredits("");
                setAmountGiven("");
                setNote("");
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
