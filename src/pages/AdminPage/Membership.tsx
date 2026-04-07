import React, { useEffect, useState } from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { Modal } from "../../components/Reusable/Modals";
import ConfirmModal from "../../components/Reusable/ConfirmModal";
import { useHistory } from "react-router-dom";
import { IonIcon, IonSkeletonText } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import StatusModal from "../../components/Reusable/StatusModal";
import NumberInput from "../../components/Reusable/NumberInput";
import POSCard from "../../components/Reusable/PosCard";
import "./AdminDashboard.css";
import "./Product.css";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import {
  createMembershipType,
  getMembershipTypes,
  MembershipTypeResponse,
} from "../../logicHandlers/membershipCrud";
import {
  getGymPricing,
  updateGymPricing,
  GymPricing,
} from "../../logicHandlers/gymPricing";
import Menu from "../../components/Reusable/Menu";

const MembershipPage: React.FC = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [memberships, setMemberships] = useState<MembershipTypeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { isOffline } = useNetworkStatus();

  const [name, setName] = useState("");
  const [type, setType] = useState(0);
  const [price, setPrice] = useState("0");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [durationMonths, setDurationMonths] = useState("0");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [gymPricing, setGymPricing] = useState<GymPricing | null>(null);
  const [dailyRateInput, setDailyRateInput] = useState("");
  const [isEditDailyRateOpen, setIsEditDailyRateOpen] = useState(false);
  const [isConfirmDailyRateOpen, setIsConfirmDailyRateOpen] = useState(false);
  const [isSavingDailyRate, setIsSavingDailyRate] = useState(false);
  const [loadingPricing, setLoadingPricing] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmType, setConfirmType] = useState<"save" | "delete" | null>(
    null,
  );

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

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

  const loadMemberships = async () => {
    try {
      setLoading(true);
      const data = await getMembershipTypes();
      setMemberships(data);
    } catch (error) {
      console.error("Failed to fetch membership types:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadGymPricing = async () => {
    try {
      setLoadingPricing(true);
      const data = await getGymPricing();
      setGymPricing(data);
    } catch (error) {
      console.error("Failed to fetch gym pricing:", error);
    } finally {
      setLoadingPricing(false);
    }
  };

  useEffect(() => {
    loadGymPricing();
    loadMemberships();
  }, []);

  const handleAddMembership = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName("");
    setType(0);
    setPrice("0");
    setDiscountAmount("0");
    setDurationMonths("0");
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const numericPrice = price === "" ? 0 : Number(price);
      const numericDiscount =
        discountAmount === "" ? 0 : Number(discountAmount);
      const numericDuration =
        durationMonths === "" ? 0 : Number(durationMonths);

      if (
        !name.trim() ||
        numericPrice < 0 ||
        numericDiscount < 0 ||
        numericDuration < 0
      ) {
        openStatusModal(
          "Invalid Input",
          "Please fill out all required fields properly.",
          "warning",
        );
        return;
      }

      const res = await createMembershipType({
        name: name.trim(),
        type,
        price: numericPrice,
        discount_amount: numericDiscount,
        duration_months: numericDuration,
      });

      console.log("Membership created:", res);

      handleCloseModal();
      loadMemberships();
      openStatusModal(
        "Success",
        "Membership type added successfully.",
        "success",
      );
    } catch (error) {
      console.error("Failed to create membership type:", error);
      openStatusModal(
        "Create Failed",
        "Failed to create membership type.",
        "error",
      );
    }
  };

  const handleConfirmDailyRateUpdate = async () => {
    try {
      const newRate = Number(dailyRateInput);

      if (dailyRateInput.trim() === "" || isNaN(newRate) || newRate < 0) {
        openStatusModal(
          "Invalid Input",
          "Please enter a valid daily rate.",
          "warning",
        );
        return;
      }

      setIsSavingDailyRate(true);

      const updatedPricing = await updateGymPricing(newRate);
      setGymPricing(updatedPricing);

      setIsConfirmDailyRateOpen(false);
      setIsEditDailyRateOpen(false);

      openStatusModal(
        "Daily Rate Updated",
        `Daily rate was updated to ₱${newRate.toFixed(2)}.`,
        "success",
      );
    } catch (error) {
      console.error("Failed to update daily rate:", error);
      openStatusModal("Update Failed", "Failed to update daily rate.", "error");
    } finally {
      setIsSavingDailyRate(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="main-container product-main-container">
        <div className="admin-top-header">
          <BackButton
            className="btn"
            type="button"
            onClick={() => history.push("/admin-dashboard")}
          >
            <IonIcon icon={arrowBack} />
          </BackButton>

          <h1>
            Membership <br />
            Plans
          </h1>

          <IonIcon
            icon={menu}
            className="menu-icon"
            onClick={handleMenuClick}
          />
        </div>

        <div className="membership-top-card">
          {loadingPricing ? (
            <div className="pos-card-item">
              <div className="pos-cards-container">
                <div className="pos-status-card">
                  <div className="pos-status-info">
                    <div className="pos-left-info">
                      <h2 className="pos-card-product-name">
                        <IonSkeletonText animated style={{ width: "120px" }} />
                      </h2>
                      <p className="pos-card-product-price">
                        <IonSkeletonText animated style={{ width: "60px" }} />
                      </p>
                    </div>
                    <div className="pos-card-top-right">
                      <IonSkeletonText
                        animated
                        style={{
                          width: "100px",
                          height: "35px",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <POSCard
              productName={"Daily Rate"}
              price={gymPricing?.base_day_pass_price ?? 55}
              buttonLabel={isOffline ? "Offline" : "Edit amount"}
              onButtonClick={() => {
                if (isOffline) return;
                setDailyRateInput(
                  String(gymPricing?.base_day_pass_price ?? 55),
                );
                setIsEditDailyRateOpen(true);
              }}
            />
          )}
        </div>

        {isOffline && (
          <div className="offline-notice-container">
            <p className="offline-notice-text">
              Offline Mode: Actions are currently restricted.
            </p>
          </div>
        )}

        <div className="membership-cards-container">
          <div className="membership-card-wrapper">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="pos-card-item">
                  <div className="pos-cards-container">
                    <div className="pos-status-card">
                      <div className="pos-status-info">
                        <div className="pos-left-info">
                          <h2 className="pos-card-product-name">
                            <IonSkeletonText
                              animated
                              style={{ width: "150px", display: "block" }}
                            />
                          </h2>
                          <p className="pos-card-product-price">
                            <IonSkeletonText
                              animated
                              style={{ width: "80px", display: "block" }}
                            />
                          </p>
                        </div>
                        <div className="pos-card-top-right">
                          <IonSkeletonText
                            animated
                            style={{
                              width: "100px",
                              height: "35px",
                              borderRadius: "10px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : memberships.length > 0 ? (
              memberships.map((membership) => (
                <POSCard
                  key={membership.membership_id}
                  productName={membership.name || ""}
                  price={membership.price || 0}
                  buttonLabel={isOffline ? "Offline" : "Edit amount"}
                  onButtonClick={() =>
                    !isOffline &&
                    history.push(
                      `/admin-edit-membership/${membership.membership_id}`,
                    )
                  }
                />
              ))
            ) : (
              <p>
                {isOffline ? "Currently Offline" : "No membership types found."}
              </p>
            )}
          </div>
        </div>

        <div className="bottom-container">
          <Button
            className="btn btn-submit"
            type="button"
            onClick={handleAddMembership}
            disabled={isOffline}
          >
            Add Membership Type
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Membership Plan"
        showCloseButton={false}
      >
        <div className="employee-form">
          <div className="form-group">
            <label htmlFor="membership-name">Membership Name</label>
            <UsernameInput
              id="membership-name"
              className="employee-input"
              placeholder="Enter membership name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="membership-type">Type</label>

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
            <label htmlFor="membership-price">Price</label>
            <NumberInput
              className="employee-input"
              placeholder="Enter price"
              value={price}
              onChange={setPrice}
              allowDecimal
              prefix="₱"
              formatWithCommas
            />
          </div>

          <div className="form-group">
            <label htmlFor="membership-discount">Discount Amount</label>
            <NumberInput
              className="employee-input"
              placeholder="Enter discount amount"
              value={discountAmount}
              onChange={setDiscountAmount}
              allowDecimal
              prefix="₱"
              formatWithCommas
            />
          </div>

          <div className="form-group">
            <label htmlFor="membership-duration">Duration Months</label>
            <NumberInput
              className="employee-input"
              placeholder="Enter duration in months"
              value={durationMonths}
              onChange={setDurationMonths}
              formatWithCommas
            />
          </div>

          <div className="form-actions">
            <Button
              className="btn-modal btn-submit-modal"
              onClick={handleSubmit}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        className="modal-box"
        isOpen={isEditDailyRateOpen}
        showCloseButton={false}
        title="Daily Rate"
        onClose={() => setIsEditDailyRateOpen(false)}
      >
        <div className="employee-form">
          <div className="form-group" style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
              Enter new Daily Rate
            </p>
            <NumberInput
              value={dailyRateInput}
              onChange={setDailyRateInput}
              placeholder="Enter daily rate"
              allowDecimal
              prefix="₱"
              formatWithCommas
              className="employee-input"
            />
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 10 }}>
            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={() => {
                const newRate = Number(dailyRateInput);

                if (
                  dailyRateInput.trim() === "" ||
                  isNaN(newRate) ||
                  newRate < 0
                ) {
                  openStatusModal(
                    "Invalid Input",
                    "Please enter a valid daily rate.",
                    "warning",
                  );
                  return;
                }

                setIsEditDailyRateOpen(false);
                setIsConfirmDailyRateOpen(true);
              }}
            >
              Confirm
            </Button>

            <Button
              type="button"
              className="btn-modal"
              onClick={() => setIsEditDailyRateOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        className="modal-box"
        isOpen={isConfirmDailyRateOpen}
        showCloseButton={false}
        title="Confirm Update"
        onClose={() => setIsConfirmDailyRateOpen(false)}
      >
        <div className="employee-form">
          <div className="form-group" style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
              Update Daily Rate?
            </p>
            <p style={{ marginTop: "10px", color: "#666", fontSize: "25px" }}>
              ₱
              {(dailyRateInput === ""
                ? 0
                : Number(dailyRateInput)
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 10 }}>
            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={handleConfirmDailyRateUpdate}
              disabled={isSavingDailyRate}
            >
              {isSavingDailyRate ? "Saving..." : "Yes"}
            </Button>

            <Button
              type="button"
              className="btn-modal"
              onClick={() => setIsConfirmDailyRateOpen(false)}
              disabled={isSavingDailyRate}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={statusTitle}
        message={statusMessage}
        type={statusType}
      />

      <Menu isOpen={isMenuOpen} onClose={handleCloseMenu} />
    </div>
  );
};

export default MembershipPage;
