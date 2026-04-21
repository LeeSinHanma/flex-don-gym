import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import { getCurrentUser } from "../../logicHandlers/userServices";
import { BackButton } from "../../components/Reusable/BackButton";
import Menu from "../../components/Reusable/Menu";
import { Button } from "../../components/Reusable/Button";
import { Modal } from "../../components/Reusable/Modals";

import "./StatusMember.css"; 
import "./Account.css"; 

const AccountPage: React.FC = () => {
  const history = useHistory();
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const user = getCurrentUser() || {};

  const accessNames: Record<string, string> = {
    dashboard: "Dashboard",
    employees: "Employee Edit",
    products: "Products Edit",
    "membership-plans": "Membership Plan",
    transactions: "Transactions",
    "qr-scanner": "QR Scanner",
    pos: "POS",
    status: "Members Page",
  };

  const formatAccess = (key: string) => {
    return accessNames[key] || key;
  };

  const handlePasswordSubmit = () => {
    console.log("Password Change Request:", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Password change recorded in console!");

    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="manage-member-container account-page-wrapper">
      <div className="main-container account-main-content">
        <div className="top-header account-header">
          <div className="status-header-row account-header-row">
            <BackButton
              className="status-page-back account-back-btn"
              type="button"
              onClick={() => history.goBack()}
            >
              <IonIcon icon={arrowBack} />
            </BackButton>

            <h2 className="account-title">My Account</h2>

            <button
              type="button"
              className="icon-button account-menu-btn"
              onClick={() => setShowEmployeeMenu(true)}
            >
              <IonIcon icon={menu} />
            </button>
          </div>
        </div>

        <div className="cards-container account-cards">
          <h3 className="account-details-title">User Details</h3>
          
          <div className="account-info-group">
            <h4 className="account-info-label">User ID</h4>
            <p className="account-info-value">
              {user.userID || user.user_id || user.id || "N/A"}
            </p>
          </div>

          <div className="account-info-group">
            <h4 className="account-info-label">Username</h4>
            <p className="account-info-value">
              {user.username || "N/A"}
            </p>
          </div>

          <div className="account-info-group">
            <h4 className="account-info-label">Full Name</h4>
            <p className="account-info-value">
              {user.firstName || user.first_name || ""} {user.lastName || user.last_name || ""}
            </p>
          </div>

          <div className="account-info-group">
            <h4 className="account-info-label">Role</h4>
            <p className="account-info-value">
              {user.role === 0 ? "Admin" : "Employee"}
            </p>
          </div>

          <div className="account-info-group">
            <h4 className="account-info-label">Access List</h4>
            <div className="account-access-tags">
              {(() => {
                const arr = Array.isArray(user.accessList) && user.accessList.length > 0 
                  ? user.accessList 
                  : Array.isArray(user.access_list) && user.access_list.length > 0 
                      ? user.access_list
                      : [];
                
                if (arr.length === 0) {
                  return <p className="account-info-value">None</p>;
                }
                
                return arr.map((item: string) => (
                  <span key={item} className="account-access-tag">
                    {formatAccess(item)}
                  </span>
                ));
              })()}
            </div>
          </div>

        </div>

        <div className="bottom-container account-bottom">
          <Button
            className="btn btn-submit account-change-pwd-btn"
            type="button"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </Button>
        </div>
      </div>

      <Menu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
      />

      <Modal
        className="modal-box"
        isOpen={showPasswordModal}
        showCloseButton={false}
        title="Change Password"
        onClose={() => {
          setShowPasswordModal(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }}
      >
        <div className="employee-form account-modal-wrapper">
          <div className="form-group account-form-group">
            <label className="account-form-label">Current Password</label>
            <input
              className="employee-input account-form-input"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group account-form-group">
            <label className="account-form-label">New Password</label>
            <input
              className="employee-input account-form-input"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group account-form-group">
            <label className="account-form-label">Confirm New Password</label>
            <input
              className="employee-input account-form-input"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="form-actions account-form-actions">
            <Button
              type="button"
              className="btn-modal account-btn-cancel"
              onClick={() => {
                setShowPasswordModal(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="btn-modal btn-submit-modal account-btn-submit"
              onClick={handlePasswordSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountPage;
