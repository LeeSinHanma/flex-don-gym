import React, { useState } from "react";
import "../AdminPage/StartingPage.css";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import { IonImg, useIonViewWillEnter } from "@ionic/react";
import dondonLogo from "../../resource/dondon-logo.png";
import { healthCheck } from "../../logicHandlers/healthCheck";
import LogoutModal from "../../components/Reusable/LogoutModal";
import { getCurrentUser } from "../../logicHandlers/userServices";

const GetStarted: React.FC = () => {
  const history = useHistory();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(getCurrentUser());

  const handleGetStarted = async () => {
    try {
      const response = await healthCheck();
      console.log(response);
    } catch (error) {
      console.error("Error checking health:", error);
    }
  };

  useIonViewWillEnter(() => {
    handleGetStarted();
    setUser(getCurrentUser());
  });

  return (
    <div className="admin-login-container">
      <div className="admin-main-container">
        <div className="admin-image-group">
          <IonImg src={dondonLogo} className="dondon-logo" alt="Logo" />

          <h1 className="admin-gym-name">DONDON'S FITNESS GYM</h1>
          
          {user && (
            <h1 className="login-gym-name">
              Hello, {user.firstName || user.username} {user.lastName}!
            </h1>
          )}
        </div>

        <div className="admin-button-group">
          <Button
            className="btn btn-signup"
            type="button"
            onClick={() => history.push("/login")}
          >
            Get Started
          </Button>

          {user && (
            <Button
              className="btn-logout"
              type="button"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => {
          setShowLogoutModal(false);
          setUser(getCurrentUser());
        }}
      />
    </div>
  );
};

export default GetStarted;