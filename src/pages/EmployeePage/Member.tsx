import React, { useEffect, useState } from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { Modal } from "../../components/Reusable/Modals";
import { createMember } from "../../logicHandlers/memberCrud";
import {
  getMembershipTypes,
  MembershipTypeResponse,
} from "../../logicHandlers/membershipCrud";
import LoadingScreen from "../LoadingScreen";
import QRCode from "react-qr-code";
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
  const [isLoading, setIsLoading] = useState(false);
  const [membershipTypes, setMembershipTypes] = useState<
    MembershipTypeResponse[]
  >([]);

  const [acceptedData, setAcceptedData] = useState<{
    email: string;
    contactNumber: string;
    firstName: string;
    lastName: string;
    qrValue: string;
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

    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await createMember({
        email: trimmedEmail,
        contact_number: trimmedContact,
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        membership_plan_id: membershipType,
        credits: credits === "" ? 0 : credits,
        registered_by: String(user.user_id),
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
                <IonIcon icon={arrowBackOutline} />
              </BackButton>
              <h1>ADD MEMBER</h1>
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

            <div style={{ display: "flex", gap: "10px" }}>
              <select
                className="input-username"
                style={{ flex: 1, fontSize: "12px" }}
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

            <div className="credit-group">
              <h3>Credits</h3>
              <UsernameInput
                className="input-username"
                placeholder="Credit"
                type="number"
                value={credits}
                onChange={(e: any) =>
                  setCredits(
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
            setAcceptedData(null);
            setEmail("");
            setContactNumber("");
            setFirstName("");
            setLastName("");
            setCredits("");
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
                <label>QR Code</label>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <QRCode value={acceptedData.qrValue} size={180} />
                </div>

                <p style={{ textAlign: "center", marginTop: 10 }}>
                  {acceptedData.firstName} {acceptedData.lastName}
                </p>
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
                    setEmail("");
                    setContactNumber("");
                    setFirstName("");
                    setLastName("");
                    setCredits("");
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
      </div>
    </>
  );
};

export default MemberMenu;
