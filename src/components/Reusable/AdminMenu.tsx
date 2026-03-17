import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "../../components/Reusable/Modals";
import { Button } from "../../components/Reusable/Button";
import LogoutModal from "../../components/Reusable/LogoutModal";

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

          <Button
            className="menu-btn"
            onClick={() => console.log("Access Manager clicked")}
          >
            ACCESS MANAGER
          </Button>

          <Button className="menu-btn" onClick={handleLogoutClick}>
            LOGOUT
          </Button>

          <Button className="menu-btn menu-btn-close" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Reusable Logout Modal */}
      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

export default AdminMenu;