import React from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import Menu from "../../components/Reusable/Menu";
import useResponsiveView from "../../hooks/useResponsiveView";
import { useState } from "react";
import "./Member.css";

const PrepaidMenu: React.FC = () => {
  const history = useHistory();
  const isMobileView = useResponsiveView();
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);

  return (
    <>
      <Menu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
      />
      <div className="member-menu-container">
        <div className="main-container">
          <div className="status-header-row">
            <BackButton
              className="status-page-back"
              type="submit"
              onClick={() => history.push("/menu")}
            >
              <IonIcon icon={arrowBack} />
            </BackButton>
            <h1>Walk-in</h1>
            {isMobileView && (
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowEmployeeMenu(true)}
                aria-label="Open menu"
              >
                <IonIcon icon={menu} />
              </button>
            )}
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
    </>
  );
};

export default PrepaidMenu;
