import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { menuOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { Modal } from "../../components/Reusable/Modals";
import { Button } from "../../components/Reusable/Button";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useHistory();

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-main-container">
        <div className="admin-top-header">
          <h1>Dashboard</h1>
          <IonIcon
            icon={menuOutline}
            className="menu-icon"
            onClick={handleMenuClick}
          />
        </div>
        <div className="admin-main-content">
          <h3>Welcome to the Admin Dashboard!</h3>
        </div>
      </div>

      <Modal
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        title="Admin Menu"
        showCloseButton={false}
      >
        <div className="menu-buttons">
          <Button
            className="menu-btn"
            onClick={() => {
              handleCloseMenu();
              // Add navigation or action here
            }}
          >
            DASHBOARD
          </Button>
          <Button
            className="menu-btn"
            onClick={() => {
              history.push("/employee-page");
              // Add navigation or action here
            }}
          >
            EMPLOYEE
          </Button>
          <Button
            className="menu-btn"
            onClick={() => {
              history.push("/admin-product");
              // Add navigation or action here
            }}
          >
            PRODUCTS
          </Button>
          <Button
            className="menu-btn"
            onClick={() => {
              history.push("/status-member");
              // Add navigation or action here
            }}
          >
            MEMBERS
          </Button>
          <Button
            className="menu-btn"
            onClick={() => {
              history.push("/admin-membership");
              // Add navigation or action here
            }}
          >
            MEMBERSHIP PLANS
          </Button>
          <Button
            className="menu-btn"
            onClick={() => {
              handleCloseMenu();
              // Add navigation or action here
            }}
          >
            LOGOUT
          </Button>

          <Button className="menu-btn menu-btn-close" onClick={handleCloseMenu}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default AdminDashboard;
