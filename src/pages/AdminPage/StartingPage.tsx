import React, { use, useEffect, useState } from "react";
import "./StartingPage.css";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import { IonImg } from "@ionic/react";
import dondonLogo from "../../resource/dondon-logo.png";
import LogoutModal from "../../components/Reusable/LogoutModal";
import { getCurrentUser, logout } from "../../logicHandlers/userServices";

const StartingPageAdmin: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loggedUser, setLoggedUser] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    history.replace("/");
  };

  const history = useHistory();

  const handleSubmit = () => {
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Form submitted:", {
      username,
      password,
      mode: isLogin ? "login" : "register",
    });
  };

  useEffect(() => {
    const parsedUser = getCurrentUser();

    if (!parsedUser) {
      history.push("/");
    } else {
      setLoggedUser(parsedUser.username);
    }
  }, [history]);

  return (
    <div className="admin-login-container">
      <div className="admin-main-container">
        <div className="admin-image-group">
          <IonImg src={dondonLogo} className="dondon-logo" alt="Logo" />

          <h1 className="admin-gym-name">DONDON'S FITNESS GYM</h1>
          <h1 className="login-gym-name">Logged in as: {loggedUser}</h1>
        </div>
        <div className="admin-button-group">
          <Button
            className="btn btn-signup"
            type="submit"
            onClick={() => history.push("/qr")}
          >
            Employee Page
          </Button>
          <Button
            className="btn btn-signup"
            type="submit"
            onClick={() => history.push("/admin-dashboard")}
          >
            Admin Page
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
  );
};

export default StartingPageAdmin;
