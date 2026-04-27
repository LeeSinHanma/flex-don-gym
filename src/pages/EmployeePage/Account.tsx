import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import { getCurrentUser, changePassword, loginUser } from "../../logicHandlers/userServices";
import StatusModal from "../../components/Reusable/StatusModal";
import { BackButton } from "../../components/Reusable/BackButton";
import Menu from "../../components/Reusable/Menu";
import { Button } from "../../components/Reusable/Button";
import { Modal } from "../../components/Reusable/Modals";
import useResponsiveView from "../../hooks/useResponsiveView";

import "./StatusMember.css"; 
import "./Account.css"; 

const AccountPage: React.FC = () => {
  const history = useHistory();
  const isMobileView = useResponsiveView();
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Status Modal State
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "warning" | "info",
  });

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

  const normalizeAccessKey = (key: string) => key.trim().toLowerCase();

  const formatAccess = (key: string) => {
    const normalizedKey = normalizeAccessKey(key);
    return accessNames[normalizedKey] || key;
  };

  const showStatus = (title: string, message: string, type: "success" | "error" | "warning" | "info") => {
    setStatusModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const handlePasswordSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showStatus("Input Required", "Please fill in all fields.", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showStatus("Match Error", "New passwords do not match!", "error");
      return;
    }

    setLoading(true);
    try {
      const userId = user.userID || user.user_id || user.id;
      const username = user.username;
      
      if (!userId || !username) {
        throw new Error("User information is incomplete.");
      }

      // 1. Validate current password by attempting to login
      try {
        await loginUser(username, currentPassword);
      } catch (loginErr: any) {
        throw new Error("Current password verification failed. Please check your credentials.");
      }

      // 2. If login successful, proceed to change password
      await changePassword(userId, newPassword);
      
      showStatus("Success", "Password changed successfully!", "success");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Password Change Error:", err);
      showStatus("Error", err.message || "Failed to change password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-member-container account-page-wrapper">
      <div className="main-container account-main-content">
        <div className="status-header-row">
          <BackButton
            className="status-page-back"
            type="button"
            onClick={() => history.goBack()}
          >
            <IonIcon icon={arrowBack} />
          </BackButton>

          <h2>My Account</h2>

          {isMobileView && (
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowEmployeeMenu(true)}
            >
              <IonIcon icon={menu} />
            </button>
          )}
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
                const rawAccessList = Array.isArray(user.accessList)
                  ? user.accessList
                  : Array.isArray(user.access_list)
                      ? user.access_list
                      : [];

                const arr = rawAccessList
                  .map((item: string) => normalizeAccessKey(item))
                  .filter((item: string, index: number, list: string[]) => item && list.indexOf(item) === index);
                
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="btn-modal btn-submit-modal account-btn-submit"
              onClick={handlePasswordSubmit}
              disabled={loading}
            >
              {loading ? "Updating..." : "Submit"}
            </Button>
          </div>
        </div>
      </Modal>
      <StatusModal
        isOpen={statusModal.isOpen}
        title={statusModal.title}
        message={statusModal.message}
        type={statusModal.type}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
      />
    </div>
  );
};

export default AccountPage;
