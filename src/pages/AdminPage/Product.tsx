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

const ProductPage: React.FC = () => {
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
          <h1>Product</h1>
          <IonIcon
            icon={menuOutline}
            className="menu-icon"
            onClick={() => history.push("/admin-dashboard")}
          />
        </div>
        <div className="admin-main-content">
          <div className="product-search-row">
            <input
              className="product-search-input"
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button type="button" className="product-search-btn">
              Search
            </button>
          </div>

          <div className="product-card-wrapper">
            <POSCard
              productName="Protein Powder"
              price={1000}
              topRight={<span className="product-stock-text">30 stocks</span>}
            />
          </div>
        </div>
        <div className="bottom-container">
          <Button
            className="btn btn-submit"
            type="button"
            onClick={handleAddEmployee}
          >
            Add employee
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Employee"
        showCloseButton={false}
      >
        <div className="employee-form">
          <div className="form-group">
            <label htmlFor="employee-name">Employee Name</label>
            <UsernameInput
              id="employee-name"
              className="employee-input"
              placeholder="Enter employee name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="employee-password">Password</label>
            <PasswordInput
              id="employee-password"
              className="employee-input"
              placeholder="Enter password"
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
export default ProductPage;
