import React from "react";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import "./PosItem.css";
import { useHistory } from "react-router-dom";
import POSCard from "../../components/Reusable/PosCard";
import { cartOutline } from "ionicons/icons";

const PosItemPage: React.FC = () => {
  const history = useHistory();
  return (
    <div className="pos-item-container">
      <div className="item-main-container">
        <div className="top-header">
          <h2>All items</h2>
          <div className="pos-search-bar">
            <div className="item-search-bar">
              <input
                className="pos-search-input"
                type="text"
                placeholder="Search"
              />
              <IonIcon
                icon={cartOutline}
                className="cart-icon"
                onClick={() => history.push("/pos")}
              />
            </div>
          </div>
        </div>
        <div className="pos-card-item">
          <POSCard
            productName="Protein Powder"
            price={1000.0}
            buttonLabel="Add to cart"
            buttonIcon={<IonIcon icon={searchOutline} />}
            onButtonClick={() => console.log("button clicked")}
          />
        </div>
      </div>
    </div>
  );
};

export default PosItemPage;
