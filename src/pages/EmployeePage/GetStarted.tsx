import React from "react";
import "../AdminPage/StartingPage.css";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import { IonImg, useIonViewWillEnter } from "@ionic/react";
import dondonLogo from "../../resource/dondon-logo.png";
import { healthCheck } from "../../logicHandlers/healthCheck";

const GetStarted: React.FC = () => {
  const history = useHistory();

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
  });

  return (
    <div className="admin-login-container">
      <div className="admin-main-container">
        <div className="admin-image-group">
          <IonImg src={dondonLogo} className="dondon-logo" alt="Logo" />

          <h1 className="admin-gym-name">DONDON'S FITNESS GYM</h1>
        </div>

        <div className="admin-button-group">
          <Button
            className="btn btn-signup"
            type="button"
            onClick={() => history.push("/login")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;