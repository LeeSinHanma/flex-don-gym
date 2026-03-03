import React from "react";
import { IonApp, IonIcon } from "@ionic/react";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import { arrowBackOutline } from "ionicons/icons";
import "./AdminDashboard.css";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";

const ItemInfoPage: React.FC = () => {
  const history = useHistory();
  return (
    <div className="admin-dashboard-container">
      <div className="admin-main-container">
        <div className="admin-top-header">
          <BackButton
            className="btn status-btn-back"
            onClick={() => history.push("/admin-product")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>
          <h2>Edit Products</h2>
        </div>

        <div className="form-container">
          <UsernameInput className="input-username" placeholder="Item Name" />

          <UsernameInput
            className="input-username"
            placeholder="Description"
            type="text"
          />

          <UsernameInput
            className="input-username"
            placeholder="Price"
            type="number"
          />

          <UsernameInput
            className="input-username"
            placeholder="Quantity"
            type="number"
          />
        </div>
        <div className="status-button-container">
          <div className="status-button">
            <Button type="button" className="renew-btn">
              Cancel
            </Button>
            <Button type="button" className="renew-btn">
              Delete
            </Button>
            <Button type="button" className="cancel-btn">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemInfoPage;
