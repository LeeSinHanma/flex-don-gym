import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { Modal } from "../../components/Reusable/Modals";
import LoadingScreen from "../LoadingScreen";
import "./AdminDashboard.css";
import "./Product.css";

import {
  getMembershipTypes,
  updateMembershipType,
  MembershipTypeResponse,
  deleteMembershipType,
} from "../../logicHandlers/membershipCrud";

interface RouteParams {
  membershipId: string;
}

const AdminEditMembership: React.FC = () => {
  const history = useHistory();
  const { membershipId } = useParams<RouteParams>();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [durationMonths, setDurationMonths] = useState<number>(0);

  const [acceptedData, setAcceptedData] = useState<{
    name: string;
    type: number;
    price: number;
    discountAmount: number;
    durationMonths: number;
  } | null>(null);

  useEffect(() => {
    const loadMembership = async () => {
      setIsLoading(true);
      try {
        const memberships = await getMembershipTypes();

        const selectedMembership = memberships.find(
          (item) => item.membership_id === Number(membershipId)
        );

        if (!selectedMembership) {
          alert("Membership not found");
          return;
        }

        setName(selectedMembership.name ?? "");
        setType(selectedMembership.type ?? 0);
        setPrice(selectedMembership.price ?? 0);
        setDiscountAmount(selectedMembership.discount_amount ?? 0);
        setDurationMonths(selectedMembership.duration_months ?? 0);
      } catch (err) {
        console.error(err);
        alert("Failed to load membership");
      } finally {
        setIsLoading(false);
      }
    };

    loadMembership();
  }, [membershipId]);

  const handleUpdate = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Membership name is required.");
      return;
    }

    if (price < 0 || discountAmount < 0 || durationMonths < 0) {
      alert("Numeric fields cannot be negative.");
      return;
    }

    setIsLoading(true);
    try {
      await updateMembershipType(Number(membershipId), {
        name: trimmedName,
        type,
        price,
        discount_amount: discountAmount,
        duration_months: durationMonths,
      });

      setAcceptedData({
        name: trimmedName,
        type,
        price,
        discountAmount,
        durationMonths,
      });

      setShowModal(true);
    } catch (err: any) {
      console.log("API ERROR:", err?.message);
      alert(err?.message || "Failed to update membership");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
        await deleteMembershipType(Number(membershipId));
        history.push("/admin-membership");
    } catch (err) {
        console.error("Delete failed", err);
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
                onClick={() => history.goBack()}
              >
                <IonIcon icon={arrowBackOutline} />
              </BackButton>
              <h1>Edit Membership</h1>
            </div>
          </div>

          <div className="form-container">
            <UsernameInput
              className="input-username"
              placeholder="Membership name"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />

            <UsernameInput
              className="input-username"
              placeholder="Type"
              type="number"
              value={type}
              onChange={(e: any) => setType(Number(e.target.value))}
            />

            <UsernameInput
              className="input-username"
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e: any) => setPrice(Number(e.target.value))}
            />

            <UsernameInput
              className="input-username"
              placeholder="Discount amount"
              type="number"
              value={discountAmount}
              onChange={(e: any) => setDiscountAmount(Number(e.target.value))}
            />

            <UsernameInput
              className="input-username"
              placeholder="Duration months"
              type="number"
              value={durationMonths}
              onChange={(e: any) => setDurationMonths(Number(e.target.value))}
            />
          </div>

          <div className="bottom-container">
            <Button
                className="btn-cancel"
                type="button"
                onClick={handleDelete}
            >
                Delete
            </Button>

            <Button className="btn-submit" type="button" onClick={handleUpdate}>
                Save
            </Button>
            </div>
        </div>

        <Modal
          className="modal-box"
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setAcceptedData(null);
            history.goBack();
          }}
          title="Membership Updated"
        >
          {acceptedData ? (
            <div className="accepted-details">
              <p>
                <b>Name:</b> {acceptedData.name}
              </p>
              <p>
                <b>Type:</b> {acceptedData.type}
              </p>
              <p>
                <b>Price:</b> {acceptedData.price}
              </p>
              <p>
                <b>Discount Amount:</b> {acceptedData.discountAmount}
              </p>
              <p>
                <b>Duration Months:</b> {acceptedData.durationMonths}
              </p>
            </div>
          ) : (
            <p>Updated.</p>
          )}
        </Modal>
      </div>
    </>
  );
};

export default AdminEditMembership;