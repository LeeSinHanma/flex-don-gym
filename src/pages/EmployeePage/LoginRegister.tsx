import React, { useEffect, useState } from "react";
import "./LoginRegister.css";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import { getUserByUsername, loginUser, setCurrentUser, getCurrentUser } from "../../logicHandlers/userServices";
import { IonImg, IonIcon } from "@ionic/react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import dondonLogo from "../../resource/dondon-logo.png";

import LoadingScreen from "../LoadingScreen";

const LoginRegister: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine); // ✅

  const history = useHistory();

  // ✅ Detect internet changes
  useEffect(() => {
    const parsed = getCurrentUser();

    if (parsed) {
      console.log("User already logged in:", parsed); // ✅

      if (parsed.role === 0) history.push("/admin-dashboard");
      else if (parsed.role === 1) history.push("/qr");
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
      const userRes = await loginUser(username, password);
      
      let fullUser: any;
      try {
        fullUser = await getUserByUsername(username);
      } catch (err: any) {
        console.warn("Could not fetch user by username (possibly 403 Forbidden). Falling back to token payload.", err);
        
        let tokenPayload: any = {};
        if (userRes.access_token) {
          try {
            const base64Url = userRes.access_token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            tokenPayload = JSON.parse(jsonPayload);
            console.log("Extracted token payload:", tokenPayload);
          } catch (e) {
            console.error("Failed to parse JWT", e);
          }
        }

        fullUser = {
          id: userRes.id || userRes.user_id || tokenPayload.id || tokenPayload.sub || "unknown-id",
          username: username,
          first_name: userRes.first_name || tokenPayload.first_name || "Employee",
          last_name: userRes.last_name || tokenPayload.last_name || "",
          role: userRes.role ?? tokenPayload.role ?? 1,
          access_list: userRes.access_list || tokenPayload.access_list || []
        };
      }

      const loggedUser = {
        userID: fullUser.id,
        username: fullUser.username,
        firstName: fullUser.first_name,
        lastName: fullUser.last_name,
        role: fullUser.role,
        accessList: fullUser.access_list || [],
      };

      // ✅ Save logged in user
      setCurrentUser(loggedUser);

      // ✅ Console log here
      console.log("Logged in user:", loggedUser);

      if (fullUser.role === 0) history.push("/admin-dashboard");
      else if (fullUser.role === 1) history.push("/qr");
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

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="input-password"
                placeholder="Password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
              </button>
            </div>

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
