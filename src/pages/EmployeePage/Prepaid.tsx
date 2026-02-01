import React from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useNavigate } from "react-router-dom";
import "./Member.css";

const WalkInMenu: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="member-menu-container">
      <div className="main-container">
        <div className="top-container">
          <BackButton
            className="btn-back"
            type="submit"
            onClick={() => navigate("/menu")}
          >
            back
          </BackButton>
          <h1>Walk-in</h1>
        </div>
        <div className="form-container">
          <UsernameInput className="input-username" placeholder="Username" />
          <UsernameInput className="input-username" placeholder="Age" />
        </div>
        <div className="bottom-container">
          <Button className="btn btn-submit" type="submit">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
export default WalkInMenu;
