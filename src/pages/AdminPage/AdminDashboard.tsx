import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline, menuOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { BackButton } from "../../components/Reusable/BackButton";
import AdminMenu from "../../components/Reusable/AdminMenu";
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
          <BackButton
            className="btn"
            type="button"
            onClick={() => history.push("/admin-page")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>

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

      <AdminMenu isOpen={isMenuOpen} onClose={handleCloseMenu} />
    </div>
  );
};

export default AdminDashboard;