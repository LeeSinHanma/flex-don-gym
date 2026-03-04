import React from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import POSCard from "../../components/Reusable/PosCard";
import "./PosItem.css";
import "./PosCheckout.css";

const PosCheckout: React.FC = () => {
  const history = useHistory();
  return (
    <div className="pos-item-container">
      <div className="item-main-container">
        <div className="top-top-header">
          <BackButton
            className="pos-btn-back"
            type="submit"
            onClick={() => history.push("/pos")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>
          <h2>All items</h2>
        </div>
        <div className="pos-checkout-info">
          <POSCard
            productName="Protein Powder"
            price={1000.0}
            onButtonClick={() => console.log("button clicked")}
          />
        </div>

        <div className="pos-checkout-footer">
          <p className="pos-checkout-footer-text">Total: ₱1,000.00</p>
          <Button
            className="btn-checkout"
            type="button"
            onClick={() => console.log("checkout clicked")}
          >
            Place order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PosCheckout;
