import React, { use, useState } from "react";
import "./LoginRegister.css";
import { UsernameInput } from "../../components/Reusable/Username";
import { PasswordInput } from "../../components/Reusable/Password";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import { getUserType, loginUser } from "../../logicHandlers/userServices";
import { IonImg } from "@ionic/react";
import dondonLogo from "../../resource/dondon-logo.png";

const LoginRegister: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  const handleSubmit = async () => {
    if (!username || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      const data = await loginUser(username, password);

      const userType = await getUserType(username);

      if (userType === 0) {
        // Employee
        history.push("/qr");
      } else if (userType === 1) {
        // Admin
        history.push("/admin-page");
      }
    } catch (error: any) {
      setErrorMessage("Invalid username or password");

      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="login-register-container">
      <div className="main-container">
        <div className="image-group">
          <IonImg src={dondonLogo} className="dondon-logo" alt="Logo" />
          <h1 className="gym-name">DONDON'S FITNESS GYM</h1>
        </div>
        <div className="button-group">
          <UsernameInput
            className="input-username"
            placeholder="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />

          <PasswordInput
            className="input-password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />

          {errorMessage && <span className="login-error">{errorMessage}</span>}
          <Button
            className="btn btn-signup"
            type="button"
            onClick={handleSubmit}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
