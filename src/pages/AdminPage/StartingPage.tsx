import React, { use, useEffect, useState } from "react";
import "./StartingPage.css";
import { UsernameInput } from "../../components/Reusable/Username";
import { PasswordInput } from "../../components/Reusable/Password";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import { IonImg } from "@ionic/react";
import dondonLogo from "../../resource/dondon-logo.png";

const StartingPageAdmin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleLogout = () => {
    localStorage.clear(); // removes everything
    history.replace("/"); // prevent going back
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
    const user = localStorage.getItem("user");

    if (!user) {
      history.push("/");
    }
  }, []);

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
            className="btn btn-signup"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartingPageAdmin;
