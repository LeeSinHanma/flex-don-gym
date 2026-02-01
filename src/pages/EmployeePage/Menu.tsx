import React, { use } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "../../components/Reusable/Button";
import "./Menu.css";

const MenuButtons: React.FC = () => {
  const history = useHistory();

  return (
    <div
      className="login-register-container"
      style={{ display: "flex", gap: "10px" }}
    >
      <div className="menu-main-container">
        <Button onClick={() => history.push("/member")}>MEMBER</Button>
        <Button onClick={() => history.push("/walkin")}>WALK-IN</Button>
        <Button onClick={() => history.push("/prepaid")}>PREPAID</Button>
      </div>
    </div>
  );
};

export default MenuButtons;
