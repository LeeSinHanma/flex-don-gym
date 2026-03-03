import React, { useState } from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { PasswordInput } from "../../components/Reusable/Password";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { Modal } from "../../components/Reusable/Modals";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { menuOutline } from "ionicons/icons";
import POSCard from "../../components/Reusable/PosCard";
import "./AdminDashboard.css";
import "./Product.css";

const MembershipPage: React.FC = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleAddEmployee = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmployeeName("");
    setEmployeePassword("");
  };

  const handleSubmit = () => {
    // Add your submit logic here
    console.log("Employee Name:", employeeName);
    console.log("Employee Password:", employeePassword);
    handleCloseModal();
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
            <POSCard
              productName="Annual Membership"
              price={1500}
              buttonLabel="Edit amount"
              onButtonClick={() => console.log("Add product")}
            />
            <POSCard
              productName="Monthly Membership"
              price={55}
              buttonLabel="Edit amount"
              onButtonClick={() => console.log("Add product")}
            />
            <POSCard
              productName="Walk-in Membership"
              price={55}
              buttonLabel="Edit amount"
              onButtonClick={() => console.log("Add product")}
            />
            <POSCard
              productName="Prepaid Membership"
              price={55}
              buttonLabel="Edit amount"
              onButtonClick={() => console.log("Add product")}
            />
          </div>
        </div>
        <div className="bottom-container">
          <Button
            className="btn btn-submit"
            type="button"
            onClick={handleAddEmployee}
          >
            Add product
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Product"
        showCloseButton={false}
      >
        <div className="employee-form">
          <div className="form-group">
            <label htmlFor="employee-name">Brand Name</label>
            <UsernameInput
              id="employee-name"
              className="employee-input"
              placeholder="Enter brand name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="employee-password">Expiry date</label>
            <UsernameInput
              id="employee-password"
              className="employee-input"
              placeholder="Enter expiry date"
              value={employeePassword}
              onChange={(e) => setEmployeePassword(e.target.value)}
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
