import React from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import "./Member.css";

const MemberMenu: React.FC = () => {
  const history = useHistory();
  return (
    <div className="member-menu-container">
      <div className="main-container">
        <div className="top-container">
          <BackButton
            className="btn btn-back"
            onClick={() => history.push("/menu")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>
          <h1>Member</h1>
        </div>
        <div className="form-container">
          <UsernameInput className="input-username" placeholder="Username" />
          <UsernameInput
            className="input-username"
            placeholder="Age"
            type="number"
          />
        </div>
        <div className="bottom-container">
          <Button className="btn-submit" type="submit">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
export default MemberMenu;
