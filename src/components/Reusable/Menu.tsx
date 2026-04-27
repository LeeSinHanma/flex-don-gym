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

type MenuItem = {
  key: string;
  label: string;
  path: string;
};

const Menu: React.FC<MenuProps> = ({
  isOpen,
  onClose,
  onBeforeLogout,
}) => {
  const history = useHistory();
  const isMobileView = useResponsiveView();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    operations: true,
    management: true,
    settings: true,
  });

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
  const rawAccessList = Array.isArray(user?.accessList)
    ? user.accessList
    : Array.isArray(user?.access_list)
      ? user.access_list
      : [];
  const accessList: string[] = rawAccessList.map((item: string) =>
    String(item).trim().toLowerCase(),
  );

  const hasAccess = (key: string) => {
    return isAdmin || accessList.includes(key.trim().toLowerCase());
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const goTo = (path: string) => {
    onClose();
    history.push(path);
  };

  const handleLogoutClick = () => {
    onClose();
    setShowLogoutConfirm(true);
  };

  const menuSections: Array<{ key: string; title: string; items: MenuItem[] }> = [
    {
      key: "overview",
      title: "Overview",
      items: [
        hasAccess("dashboard")
          ? { key: "dashboard", label: "DASHBOARD", path: "/admin-dashboard" }
          : null,
      ].filter(Boolean) as MenuItem[],
    },
    {
      key: "operations",
      title: "Daily Operations",
      items: [
        hasAccess("pos") ? { key: "pos", label: "POS", path: "/pos" } : null,
        hasAccess("qr-scanner")
          ? { key: "qr-scanner", label: "QR SCANNER", path: "/qr" }
          : null,
        hasAccess("status")
          ? { key: "status", label: "STATUS / MEMBERS", path: "/status-member" }
          : null,
        hasAccess("transactions")
          ? {
              key: "transactions",
              label: "TRANSACTIONS",
              path: "/admin-transactions",
            }
          : null,
      ].filter(Boolean) as MenuItem[],
    },
    {
      key: "management",
      title: "Management",
      items: [
        hasAccess("employees")
          ? { key: "employees", label: "EMPLOYEE", path: "/employee-page" }
          : null,
        hasAccess("products")
          ? { key: "products", label: "PRODUCTS", path: "/admin-product" }
          : null,
        hasAccess("membership-plans")
          ? {
              key: "membership-plans",
              label: "MEMBERSHIP PLANS",
              path: "/admin-membership",
            }
          : null,
      ].filter(Boolean) as MenuItem[],
    },
    {
      key: "settings",
      title: "Settings",
      items: [
        { key: "account", label: "ACCOUNT", path: "/account" },
        isAdmin
          ? { key: "email-settings", label: "EMAIL SETTINGS", path: "/admin-email" }
          : null,
      ].filter(Boolean) as MenuItem[],
    },
  ].filter((section) => section.items.length > 0);

  // Menu items that appear in both modal and sidebar
  const menuContent = (
    <div className="menu-shell">
      <div className="menu-buttons">
        {menuSections.map((section) => (
          <div key={section.key} className="menu-section">
            <button
              type="button"
              className="menu-section-header"
              onClick={() => toggleSection(section.key)}
              aria-expanded={!!expandedSections[section.key]}
            >
              <span className="menu-section-title">{section.title}</span>
              <span className={`menu-section-caret ${expandedSections[section.key] ? "open" : ""}`}>
                ▾
              </span>
            </button>

            {expandedSections[section.key] && (
              <div className="menu-submenu">
                {section.items.map((item) => (
                  <Button
                    key={item.key}
                    className={`menu-btn ${currentPath === item.path ? "menu-btn-active" : ""}`}
                    onClick={() => goTo(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="menu-actions">
        <Button className="menu-btn menu-btn-logout" onClick={handleLogoutClick}>
          LOGOUT
        </Button>

        {isMobileView && (
          <Button className="menu-btn menu-btn-close" onClick={onClose}>
            CLOSE
          </Button>
        )}
      </div>
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
