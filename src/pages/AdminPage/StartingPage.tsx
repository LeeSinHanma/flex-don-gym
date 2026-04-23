import React, { useEffect, useState } from "react";
import "./StartingPage.css";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import { IonImg, IonIcon } from "@ionic/react";
import { menu } from "ionicons/icons";
import dondonLogo from "../../resource/dondon-logo.png";
import LogoutModal from "../../components/Reusable/LogoutModal";
import Menu from "../../components/Reusable/Menu";
import useResponsiveView from "../../hooks/useResponsiveView";
import { getCurrentUser, logout } from "../../logicHandlers/userServices";
const StartingPageAdmin: React.FC = () => {

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);
  const isMobileView = useResponsiveView();
  const [user, setUser] = useState(getCurrentUser());

  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.replace("/");
  };

  useEffect(() => {
    const parsedUser = getCurrentUser();

    if (!parsedUser) {
      history.push("/");
    } else {
      setUser(parsedUser);
    }
  }, [history]);

  return (
    <>
      <Menu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
      />
      <div className="admin-login-container">
        <div className="admin-main-container">
          <div className="admin-image-group">
            {isMobileView && (
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowEmployeeMenu(true)}
                style={{ position: "absolute", top: "10px", right: "10px" }}
                aria-label="Open menu"
              >
                <IonIcon icon={menu} />
              </button>
            )}
            <IonImg src={dondonLogo} className="dondon-logo" alt="Logo" />

          <h1 className="admin-gym-name">DONDON'S FITNESS GYM</h1>
          <h1 className="login-gym-name">
               Hello, {user?.firstName || user?.username} {user?.lastName}!
             </h1>
        </div>
        <div className="admin-button-group">
          <Button
            className="btn btn-signup"
            type="submit"
            onClick={() => 
              user?.role === 0 ? history.push("/admin-dashboard") : history.push("/qr")}
          >
            Start
          </Button>

          <Button
            className="btn-logout"
            type="button"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </Button>
        </div>
      </div>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  </>
  );
};

export default StartingPageAdmin;
