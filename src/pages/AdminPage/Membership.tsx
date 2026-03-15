import React, { useEffect, useState } from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { Modal } from "../../components/Reusable/Modals";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline, menuOutline } from "ionicons/icons";
import POSCard from "../../components/Reusable/PosCard";
import "./AdminDashboard.css";
import "./Product.css";
import {
  createMembershipType,
  getMembershipTypes,
  MembershipTypeResponse,
} from "../../logicHandlers/membershipCrud";
import AdminMenu from "../../components/Reusable/AdminMenu";

const MembershipPage: React.FC = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [memberships, setMemberships] = useState<MembershipTypeResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState(0);
  const [price, setPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [durationMonths, setDurationMonths] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditDailyRateOpen, setIsEditDailyRateOpen] = useState(false);
  const [isConfirmDailyRateOpen, setIsConfirmDailyRateOpen] = useState(false);
  const [dailyRateInput, setDailyRateInput] = useState("");

  const membershipTypeLabel: Record<number, string> = {
    0: "Postpaid",
    1: "Prepaid",
    2: "Discount",
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

  useEffect(() => {
    loadMemberships();
  }, []);

  const handleAddMembership = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName("");
    setType(0);
    setPrice(0);
    setDiscountAmount(0);
    setDurationMonths(0);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (
        !name.trim() ||
        price < 0 ||
        discountAmount < 0 ||
        durationMonths < 0
      ) {
        alert("Please fill out all required fields properly.");
        return;
      }

      const res = await createMembershipType({
        name,
        type,
        price,
        discount_amount: discountAmount,
        duration_months: durationMonths,
      });

      console.log("Membership created:", res);

      handleCloseModal();
      loadMemberships(); // refresh cards after add
    } catch (error) {
      console.error("Failed to create membership type:", error);
    }
  };

  const topMembership = memberships[0];

  return (
    <div className="admin-dashboard-container">
      <div className="main-container product-main-container">
        <div className="admin-top-header">
          <BackButton
            className="btn"
            type="button"
            onClick={() => history.push("/admin-dashboard")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>

          <h1>
            Membership <br />
            Plans
          </h1>
          <IonIcon
            icon={menuOutline}
            className="menu-icon"
            onClick={handleMenuClick}
          />
        </div>

        <div className="membership-top-card">
          <POSCard
            productName={"Daily Rate"}
            price={55}
            buttonLabel="Edit amount"
            onButtonClick={() => {
              setDailyRateInput(String(topMembership.price ?? 55));
              setIsEditDailyRateOpen(true);
            }}
          />
        </div>

        <div className="admin-main-content">
          <div className="product-card-wrapper">
            {loading ? (
              <p>Loading membership types...</p>
            ) : memberships.length > 0 ? (
              <>
                {memberships.map((membership) => (
                  <POSCard
                    key={membership.membership_id}
                    productName={membership.name}
                    price={membership.price}
                    buttonLabel="Edit amount"
                    onButtonClick={() =>
                      history.push(
                        `/admin-edit-membership/${membership.membership_id}`,
                      )
                    }
                  />
                ))}
              </>
            ) : (
              <p>No membership types found.</p>
            )}
          </div>
        </div>

        <div className="bottom-container">
          <Button
            className="btn btn-submit"
            type="button"
            onClick={handleAddMembership}
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
              <option value={2}>Discount</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="membership-price">Price</label>
            <UsernameInput
              id="membership-price"
              className="employee-input"
              placeholder="Enter price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="membership-discount">Discount Amount</label>
            <UsernameInput
              id="membership-discount"
              className="employee-input"
              placeholder="Enter discount amount"
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="membership-duration">Duration Months</label>
            <UsernameInput
              id="membership-duration"
              className="employee-input"
              placeholder="Enter duration in months"
              type="number"
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
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

            <input
              type="number"
              value={dailyRateInput}
              onChange={(e) => setDailyRateInput(e.target.value)}
              placeholder="Enter daily rate"
              style={{
                marginTop: "15px",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "100%",
                color: "#333",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 10 }}>
            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={() => {
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
              ₱{dailyRateInput}
            </p>
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 10 }}>
            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={() => {
                console.log("New Daily Rate:", dailyRateInput);
                setIsConfirmDailyRateOpen(false);
              }}
            >
              Yes
            </Button>

            <Button
              type="button"
              className="btn-modal"
              onClick={() => setIsConfirmDailyRateOpen(false)}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>
      <AdminMenu isOpen={isMenuOpen} onClose={handleCloseMenu} />
    </div>
  );
};

export default MembershipPage;
