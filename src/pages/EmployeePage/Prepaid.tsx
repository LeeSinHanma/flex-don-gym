import React from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import "./Member.css";

const PrepaidMenu: React.FC = () => {
  const history = useHistory();
  return (
    <div className="member-menu-container">
      <div className="main-container">
        <div className="top-container">
          <BackButton
            className="btn-back"
            type="submit"
            onClick={() => history.push("/menu")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>
          <h1>Walk-in</h1>
        </div>
        <div className="form-container">
          <UsernameInput className="input-username" placeholder="Email" />
          <UsernameInput
            className="input-username"
            placeholder="Contact number"
            type="number"
          />
          <UsernameInput className="input-username" placeholder="First name" />
          <UsernameInput className="input-username" placeholder="Last name" />
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
export default PrepaidMenu;
