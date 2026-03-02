import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { Modal } from "../../components/Reusable/Modals";
import LoadingScreen from "../LoadingScreen";
import QRCode from "react-qr-code";
import "../EmployeePage/Member.css";

import { getMemberById, updateMember, Member } from "../../logicHandlers/memberCrud";

interface RouteParams {
  memberId: string;
}

const EditMemberPage: React.FC = () => {
  const history = useHistory();
  const { memberId } = useParams<RouteParams>();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // form fields
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [membershipType, setMembershipType] = useState<number>(0);
  const [membershipPlanId, setMembershipPlanId] = useState<number>(0);
  const [credits, setCredits] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  // for modal display
  const [acceptedData, setAcceptedData] = useState<{
    email: string;
    contactNumber: string;
    firstName: string;
    lastName: string;
    qrValue: string;
  } | null>(null);

  // load existing member
    useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const m = await getMemberById(memberId);
        setEmail(m.email ?? "");
        setContactNumber(m.contact_number ?? "");
        setFirstName(m.first_name ?? "");
        setLastName(m.last_name ?? "");

        setMembershipType(m.membership_type ?? 0);
        setMembershipPlanId(m.membership_plan_id ?? 0);
        setCredits(m.credits ?? 0);
        setIsActive(m.is_active ?? true);
      } catch (err) {
        console.error(err);
        alert("Failed to load member");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [memberId]);

  const handleUpdate = async () => {
    const trimmedEmail = email.trim();
    const trimmedContact = contactNumber.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedEmail || !trimmedContact || !trimmedFirstName || !trimmedLastName) {
      alert("All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      const updated = await updateMember(memberId, {
        email: trimmedEmail,
        contact_number: trimmedContact,
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        membership_type: membershipType,
        membership_plan_id: membershipPlanId,
        credits,
        is_active: isActive,
      });

      setAcceptedData({
        email: updated.email,
        contactNumber: updated.contact_number,
        firstName: updated.first_name,
        lastName: updated.last_name,
        qrValue: updated.member_id,
      });

      setShowModal(true);
    } catch (err: any) {
      console.log("API ERROR:", err?.message);
      alert(err?.message || "Failed to update member");
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
              <BackButton className="btn btn-back" onClick={() => history.goBack()}>
                <IonIcon icon={arrowBackOutline} />
              </BackButton>
              <h1>Edit Member</h1>
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
            <Button className="btn-submit" type="button" onClick={handleUpdate}>
              Save
            </Button>
          </div>
        </div>

        {/* MODAL (optional) */}
        <Modal
          className="modal-box"
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setAcceptedData(null);
            history.push(`/manage-status/${memberId}`); // or back to list
          }}
          title="Member Updated"
        >
          {acceptedData ? (
            <div className="accepted-details">
              <p><b>Email:</b> {acceptedData.email}</p>
              <p><b>Contact:</b> {acceptedData.contactNumber}</p>
              <p><b>First Name:</b> {acceptedData.firstName}</p>
              <p><b>Last Name:</b> {acceptedData.lastName}</p>

              <div className="qr-section">
                <p className="qr-label">QR Code:</p>
                <div className="qr-wrapper">
                  <QRCode value={acceptedData.qrValue} size={180} />
                </div>
                <p className="qr-value-text">{acceptedData.qrValue}</p>
              </div>
            </div>
          ) : (
            <p>Updated.</p>
          )}
        </Modal>
      </div>
    </>
  );
};

export default EditMemberPage;