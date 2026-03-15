import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "../../components/Reusable/Modals";
import { Button } from "../../components/Reusable/Button";
import { logout } from "../../logicHandlers/userServices";

interface AdminMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ isOpen, onClose }) => {
  const history = useHistory();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const goTo = (path: string) => {
    onClose();
    history.push(path);
  };

  const handleLogoutClick = () => {
    onClose();
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
      history.push("/login");
    } catch (err: any) {
      console.error("Logout failed:", err?.message || err);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Admin Menu"
        showCloseButton={false}
      >
        <div className="menu-buttons">
          <Button className="menu-btn" onClick={() => goTo("/admin-dashboard")}>
            DASHBOARD
          </Button>

          <Button className="menu-btn" onClick={() => goTo("/employee-page")}>
            EMPLOYEE
          </Button>

          <Button className="menu-btn" onClick={() => goTo("/admin-product")}>
            PRODUCTS
          </Button>

          <Button className="menu-btn" onClick={() => goTo("/status-member")}>
            MEMBERS
          </Button>

          <Button className="menu-btn" onClick={() => goTo("/admin-membership")}>
            MEMBERSHIP PLANS
          </Button>

          <Button className="menu-btn" onClick={handleLogoutClick}>
            LOGOUT
          </Button>

          <Button className="menu-btn menu-btn-close" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>

      <Modal
        className="modal-box"
        isOpen={showLogoutConfirm}
        showCloseButton={false}
        title="Confirm Logout"
        onClose={() => setShowLogoutConfirm(false)}
      >
        <div className="employee-form">
          <div className="form-group" style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
              Are you sure you want to log out?
            </p>
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 10 }}>
            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={handleConfirmLogout}
            >
              Yes
            </Button>

            <Button
              type="button"
              className="btn-modal"
              onClick={() => setShowLogoutConfirm(false)}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminMenu;