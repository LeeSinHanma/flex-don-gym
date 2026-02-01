import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Reusable/Button";
import "./Menu.css";

const MenuButtons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="login-register-container"
      style={{ display: "flex", gap: "10px" }}
    >
      <div className="menu-main-container">
        <Button onClick={() => navigate("/member")}>MEMBER</Button>
        <Button onClick={() => navigate("/walkin")}>WALK-IN</Button>
        <Button onClick={() => navigate("/prepaid")}>PREPAID</Button>
      </div>
    </div>
  );
};

export default MenuButtons;
