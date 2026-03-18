import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "../../components/Reusable/Modals";
import { Button } from "../../components/Reusable/Button";
import { logout } from "../../logicHandlers/userServices";

interface EmployeeMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBeforeLogout?: () => Promise<void>;
}

const EmployeeMenu: React.FC<EmployeeMenuProps> = ({
  isOpen,
  onClose,
  onBeforeLogout,
}) => {
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
      if (onBeforeLogout) {
        await onBeforeLogout();
      }
      await logout();
      setShowLogoutConfirm(false);
      history.replace("/login");
    } catch (err: any) {
      console.error("Logout failed:", err?.message || err);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Menu"
        showCloseButton={false}
      >
        <div className="menu-buttons">
          <Button className="menu-btn" onClick={() => goTo("/pos")}>
            POS
          </Button>

          <Button className="menu-btn" onClick={() => goTo("/qr")}>
            QR SCANNER
          </Button>

          <Button className="menu-btn" onClick={() => goTo("/status-member")}>
            STATUS
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

          <div className="modal-actions">
            <Button
              type="button"
              className="modal-action-btn modal-action-btn-primary"
              onClick={handleConfirmLogout}
            >
              Yes
            </Button>

            <Button
              type="button"
              className="modal-action-btn modal-action-btn-danger"
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

export default EmployeeMenu;
