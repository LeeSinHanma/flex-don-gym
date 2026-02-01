import React, { use, useState } from "react";
import "./LoginRegister.css";
import { UsernameInput } from "../../components/Reusable/Username";
import { PasswordInput } from "../../components/Reusable/Password";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";

const LoginRegister: React.FC = () => {
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
    <div className="login-register-container">
      <div className="main-container">
        <div className="image-group">
          <img src="/dondon-logo.png" className="dondon-logo" alt="Logo" />
          <h1 className="gym-name">DONDON'S FITNESS GYM</h1>
        </div>
        <div className="button-group">
          <UsernameInput className="input-username" placeholder="Username" />
          <PasswordInput className="input-password" placeholder="Password" />
          <Button
            className="btn btn-signup"
            type="submit"
            onClick={() => history.push("/menu")}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
