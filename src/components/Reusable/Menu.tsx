import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "./Modals";
import { Button } from "./Button";
import LogoutModal from "./LogoutModal";
import { getCurrentUser } from "../../logicHandlers/userServices";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBeforeLogout?: () => Promise<void>;
}

const Menu: React.FC<MenuProps> = ({
  isOpen,
  onClose,
  onBeforeLogout,
}) => {
  const history = useHistory();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const user = getCurrentUser();
  const isAdmin = user?.role === 0 || user?.userType === 0;
  const accessList: string[] = user?.accessList || [];

  const hasAccess = (key: string) => {
    return isAdmin || accessList.includes(key);
  };

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
        title="Menu"
        showCloseButton={false}
      >
        <div className="menu-buttons">
          {hasAccess("dashboard") && (
            <Button className="menu-btn" onClick={() => goTo("/admin-dashboard")}>
              DASHBOARD
            </Button>
          )}

          {hasAccess("employees") && (
            <Button className="menu-btn" onClick={() => goTo("/employee-page")}>
              EMPLOYEE
            </Button>
          )}

          {hasAccess("products") && (
            <Button className="menu-btn" onClick={() => goTo("/admin-product")}>
              PRODUCTS
            </Button>
          )}

          {hasAccess("membership-plans") && (
            <Button className="menu-btn" onClick={() => goTo("/admin-membership")}>
              MEMBERSHIP PLANS
            </Button>
          )}

          {hasAccess("pos") && (
            <Button className="menu-btn" onClick={() => goTo("/pos")}>
              POS
            </Button>
          )}

          {hasAccess("qr-scanner") && (
            <Button className="menu-btn" onClick={() => goTo("/qr")}>
              QR SCANNER
            </Button>
          )}

          {hasAccess("status") && (
            <Button className="menu-btn" onClick={() => goTo("/status-member")}>
              STATUS / MEMBERS
            </Button>
          )}

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

export default Menu;
