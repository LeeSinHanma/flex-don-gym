import React, { use, useState } from "react";
import "./StartingPage.css";
import { UsernameInput } from "../../components/Reusable/Username";
import { PasswordInput } from "../../components/Reusable/Password";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import { IonImg } from "@ionic/react";
import dondonLogo from "../../resources/dondon-logo.png";

const StartingPageAdmin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartingPageAdmin;
