import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "../../components/Reusable/Modals";
import { Button } from "../../components/Reusable/Button";
import { logout } from "../../logicHandlers/userServices";
import LogoutModal from "../../components/Reusable/LogoutModal";

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
      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

export default EmployeeMenu;
