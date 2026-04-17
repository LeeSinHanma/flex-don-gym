import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import ConfirmModal from "../../components/Reusable/ConfirmModal";
import NumberInput from "../../components/Reusable/NumberInput";
import LoadingScreen from "../LoadingScreen";
import "./AdminDashboard.css";
import "./Product.css";

import {
  getMembershipTypes,
  updateMembershipType,
  MembershipTypeResponse,
  deleteMembershipType,
} from "../../logicHandlers/membershipCrud";
import StatusModal from "../../components/Reusable/StatusModal";

interface RouteParams {
  membershipId: string;
}

const AdminEditMembership: React.FC = () => {
  const history = useHistory();
  const { membershipId } = useParams<RouteParams>();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<number>(0);
  const [price, setPrice] = useState<string>("0");
  const [discountAmount, setDiscountAmount] = useState<string>("0");
  const [durationMonths, setDurationMonths] = useState<string>("0");

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [shouldGoBack, setShouldGoBack] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  const membershipTypeLabel: Record<number, string> = {
    0: "Postpaid",
    1: "Prepaid",
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
          (item) => item.membership_id === Number(membershipId),
        );

        if (!selectedMembership) {
          alert("Membership not found");
          return;
        }

        setName(selectedMembership.name ?? "");
        setType(selectedMembership.type ?? 0);
        setPrice(String(selectedMembership.price ?? 0));
        setDiscountAmount(String(selectedMembership.discount_amount ?? 0));
        setDurationMonths(String(selectedMembership.duration_months ?? 0));
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
      openStatusModal(
        "Missing Name",
        "Membership name is required.",
        "warning",
      );
      return;
    }

    const numericPrice = price === "" ? 0 : Number(price);
    const numericDiscount = discountAmount === "" ? 0 : Number(discountAmount);
    const numericDuration = durationMonths === "" ? 0 : Number(durationMonths);

    if (numericPrice < 0 || numericDiscount < 0 || numericDuration < 0) {
      openStatusModal(
        "Invalid Input",
        "Numeric fields cannot be negative.",
        "warning",
      );
      return;
    }

    setIsLoading(true);
    try {
      await updateMembershipType(Number(membershipId), {
        name: trimmedName,
        type,
        price: numericPrice,
        discount_amount: numericDiscount,
        duration_months: numericDuration,
      });

      setAcceptedData({
        name: trimmedName,
        type,
        price: numericPrice,
        discountAmount: numericDiscount,
        durationMonths: numericDuration,
      });

      setShouldGoBack(true);
      openStatusModal(
        "Membership Updated",
        `"${trimmedName}" was updated successfully.`,
        "success",
      );
    } catch (err: any) {
      console.log("API ERROR:", err?.message);
      openStatusModal(
        "Update Failed",
        err?.message || "Failed to update membership",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await deleteMembershipType(Number(membershipId));

      setShowDeleteModal(false);
      setShouldGoBack(true);
      openStatusModal(
        "Membership Deleted",
        "The membership has been successfully deleted.",
        "success",
      );
    } catch (err: any) {
      console.error("Delete failed", err);
      openStatusModal(
        "Delete Failed",
        err?.message || "Failed to delete membership",
        "error",
      );
    } finally {
      setIsDeleting(false);
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
                <IonIcon icon={arrowBack} />
              </BackButton>
              <h1>Edit Membership</h1>
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label>Membership Name:</label>
              <UsernameInput
                className="input-username"
                placeholder="Membership name"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="membership-type">Type:</label>

              <select
                id="membership-type"
                className="employee-input"
                value={type}
                onChange={(e) => setType(Number(e.target.value))}
              >
                <option value={0}>Postpaid</option>
                <option value={1}>Prepaid</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price:</label>
              <NumberInput
                className="input-username"
                placeholder="Price"
                value={price}
                onChange={setPrice}
                allowDecimal
                prefix="₱"
                formatWithCommas
              />
            </div>

            <div className="form-group">
              <label>Discount Amount:</label>
              <NumberInput
                className="input-username"
                placeholder="Discount amount"
                value={discountAmount}
                onChange={setDiscountAmount}
                allowDecimal
                prefix="₱"
                formatWithCommas
              />
            </div>

            <div className="form-group">
              <label>Duration in Months:</label>
              <NumberInput
                className="input-username"
                placeholder="Duration months"
                value={durationMonths}
                onChange={setDurationMonths}
                formatWithCommas
              />
            </div>
          </div>

          <div className="bottom-container">
            <Button
              className="btn-submit"
              type="button"
              onClick={() => setShowSaveConfirmModal(true)}
            >
              Save
            </Button>
            <Button
              className="btn-cancel"
              type="button"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        <ConfirmModal
          isOpen={showDeleteModal}
          title="Confirm Delete"
          message={`Are you sure you want to delete "${
            name.trim() || "this membership"
          }"?`}
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          onCancel={() => {
            if (!isDeleting) setShowDeleteModal(false);
          }}
          onConfirm={handleDelete}
        />

        <ConfirmModal
          isOpen={showSaveConfirmModal}
          title="Confirm Save"
          message={`Are you sure you want to save changes to "${
            name.trim() || "this membership"
          }"?`}
          confirmText="Save"
          cancelText="Cancel"
          onCancel={() => setShowSaveConfirmModal(false)}
          onConfirm={async () => {
            setShowSaveConfirmModal(false);
            await handleUpdate();
          }}
        />

        <StatusModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);

            if (shouldGoBack) {
              setShouldGoBack(false);
              history.goBack();
            }
          }}
          title={statusTitle}
          message={statusMessage}
          type={statusType}
        />
      </div>
    </>
  );
};

export default AdminEditMembership;
