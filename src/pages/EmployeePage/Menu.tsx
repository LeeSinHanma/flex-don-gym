import React, { use } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import "./Menu.css";

const MenuButtons: React.FC = () => {
  const history = useHistory();

  return (
    <div className="menu-main-container">
      <div className="menu-container">
        <div className="menu-top-container">
          <BackButton
            className="btn btn-back"
            onClick={() => history.push("/qr")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>
        </div>
        <div className="menu-container">
          <Button onClick={() => history.push("/member")}>ADD MEMBER</Button>
          <Button onClick={() => history.push("/walkin")}>WALK-IN</Button>
        </div>
      </div>

      {/*<div className="menu-main-container">
        <div className="menu-top-container">
          <BackButton
            className="btn-back"
            type="submit"
            onClick={() => history.push("/menu")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>
        </div>
        
      </div>*/}
    </div>
  );
};

export default MenuButtons;
