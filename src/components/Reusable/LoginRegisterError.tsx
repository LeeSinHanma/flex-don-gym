import React, { use, useState } from "react";

import "./LoginRegisterError.css";
import { UsernameInput } from "../../components/Reusable/Username";
import { PasswordInput } from "../../components/Reusable/Password";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import { loginUser } from "../../logicHandlers/userServices";
import { IonImg } from "@ionic/react";
import dondonLogo from "../../resource/dondon-logo.png";

const LoginRegisterErrorPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const handleSubmit = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Login flow with API call
    try {
      const data = await loginUser(username, password);
      console.log("✅ Login success:", data);

      history.push("/menu");
    } catch (error: any) {
      console.error("❌ Login failed:", error.message);
      alert(error.message);
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
          <div className="user-info">
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
          </div>
          <div className="info-error">
            <p>
              Invalid <strong>Username</strong> or <strong>Password</strong>.
              Try again
            </p>
          </div>
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

export default LoginRegisterErrorPage;
