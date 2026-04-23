import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import { Modal } from "./Modals";
import { Button } from "./Button";
import LogoutModal from "./LogoutModal";
import useResponsiveView from "../../hooks/useResponsiveView";
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
  const isMobileView = useResponsiveView();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Check if current route is an admin page
  const currentPath = window.location.pathname;
  const isAdminPage = true; // Show sidebar on all pages in web view

  // Add class to body when sidebar is visible
  useEffect(() => {
    if (!isMobileView && isAdminPage) {
      document.body.classList.add('has-sidebar');
    } else {
      document.body.classList.remove('has-sidebar');
    }
    
    return () => {
      document.body.classList.remove('has-sidebar');
    };
  }, [isMobileView, isAdminPage]);

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

  // Menu items that appear in both modal and sidebar
  const menuContent = (
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

      {hasAccess("transactions") && (
        <Button className="menu-btn" onClick={() => goTo("/admin-transactions")}>
          TRANSACTIONS
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

      <Button className="menu-btn" onClick={() => goTo("/account")}>
        ACCOUNT
      </Button>

      <Button className="menu-btn" onClick={handleLogoutClick}>
        LOGOUT
      </Button>

      {isMobileView && (
        <Button className="menu-btn menu-btn-close" onClick={onClose}>
          Close
        </Button>
      )}
    </div>
  );

  // On mobile view, show centered modal
  if (isMobileView) {
    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="Menu"
          showCloseButton={false}
          className="menu-modal"
        >
          {menuContent}
        </Modal>
        <LogoutModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
        />
      </>
    );
  }

  // On web view, render sidebar at root level using portal ONLY for admin pages
  if (isAdminPage) {
    const webSidebar = (
      <div className="menu-sidebar">
        <h2 className="menu-sidebar-title">Menu</h2>
        {menuContent}
      </div>
    );

    return (
      <>
        {ReactDOM.createPortal(webSidebar, document.body)}
        <LogoutModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
        />
      </>
    );
  }

  // On web view for non-admin pages, don't show sidebar
  return (
    <LogoutModal
      isOpen={showLogoutConfirm}
      onClose={() => setShowLogoutConfirm(false)}
    />
  );
};

export default Menu;
