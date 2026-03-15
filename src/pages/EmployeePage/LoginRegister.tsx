import React, { useEffect, useState } from "react";
import "./LoginRegister.css";
import { UsernameInput } from "../../components/Reusable/Username";
import { PasswordInput } from "../../components/Reusable/Password";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import { getUserType, loginUser } from "../../logicHandlers/userCrud";
import { IonImg } from "@ionic/react";
import dondonLogo from "../../resource/dondon-logo.png";

import LoadingScreen from "../LoadingScreen";

const LoginRegister: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine); // ✅

  const history = useHistory();

  // ✅ Detect internet changes
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsed = JSON.parse(user);

      console.log("User already logged in:", parsed); // ✅

      if (parsed.userType === 0) history.push("/admin-dashboard");
      else if (parsed.userType === 1) history.push("/qr");
    }

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const handleSubmit = async () => {
    // ✅ block login if offline
    if (!isOnline) {
      setErrorMessage("No internet connection. Please connect and try again.");
      return;
    }

    if (!username || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const user = await loginUser(username, password);
      const userType = await getUserType(username);

      const loggedUser = {
        username,
        userType,
      };

      // ✅ Save logged in user
      localStorage.setItem("user", JSON.stringify(loggedUser));

      // ✅ Console log here
      console.log("Logged in user:", loggedUser);

      if (userType === 0) history.push("/admin-dashboard");
      else if (userType === 1) history.push("/qr");
      else setErrorMessage("Unknown user type");
    } catch (error: any) {
      // ✅ show better message if it's likely internet issue
      const msg = String(error?.message || "");
      const looksLikeNetwork =
        !navigator.onLine ||
        msg.toLowerCase().includes("network") ||
        msg.toLowerCase().includes("failed to fetch") ||
        msg.toLowerCase().includes("timeout");

      if (looksLikeNetwork) {
        setErrorMessage("No internet connection. Please try again.");
      } else {
        setErrorMessage("Invalid username or password");
      }

      setUsername("");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen />}

      <div className="login-register-container">
        <div className="main-container">
          <div className="image-group">
            <IonImg src={dondonLogo} className="dondon-logo" alt="Logo" />
            <h1 className="gym-name">DONDON'S FITNESS GYM</h1>
          </div>

          <div className="button-group">
            {/* ✅ offline banner */}
            {!isOnline && (
              <div className="offline-banner">
                You are offline. Connect to the internet to sign in.
              </div>
            )}

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

            {errorMessage && (
              <strong className="login-error">{errorMessage}</strong>
            )}

            <Button
              className="btn btn-signup"
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !isOnline} // ✅ disable when offline
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegister;
