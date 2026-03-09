import React, { useEffect, useState } from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { Modal } from "../../components/Reusable/Modals";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { menuOutline } from "ionicons/icons";
import POSCard from "../../components/Reusable/PosCard";
import "./AdminDashboard.css";
import "./Product.css";
import {
  createMembershipType,
  getMembershipTypes,
  MembershipTypeResponse,
} from "../../logicHandlers/membershipCrud";

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

  return (
    <div className="admin-dashboard-container">
      <div className="main-container product-main-container">
        <div className="admin-top-header">
          <h1>Membership Plans</h1>
          <IonIcon
            icon={menuOutline}
            className="menu-icon"
            onClick={() => history.push("/admin-dashboard")}
          />
        </div>

        <div className="admin-main-content">
          <div className="product-card-wrapper">
            {loading ? (
              <p>Loading membership types...</p>
            ) : memberships.length > 0 ? (
              memberships.map((membership) => (
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
              ))
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
    </div>
  );
};

export default MembershipPage;
