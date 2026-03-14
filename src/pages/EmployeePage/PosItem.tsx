import React, { useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import { searchOutline, arrowBackOutline } from "ionicons/icons";
import "./PosItem.css";
import { useHistory } from "react-router-dom";
import POSCard from "../../components/Reusable/PosCard";
import { BackButton } from "../../components/Reusable/BackButton";
import {
  getInventoryItems,
  InventoryItem,
} from "../../logicHandlers/itemInvCrud";

const PosItemPage: React.FC = () => {
  const history = useHistory();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await getInventoryItems();
        setItems(data);
      } catch (err) {
        console.error("Failed to load inventory:", err);
      }
    };

    loadItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.item_name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="pos-item-container">
      <div className="item-main-container">
        <div className="top-header">
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

          <div className="pos-search-bar">
            <div className="item-search-bar">
              <input
                className="pos-search-input"
                type="text"
                placeholder="Search item"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="pos-card-item">
          {filteredItems.map((item) => (
            <POSCard
              key={item.item_id}
              productName={item.item_name}
              price={item.price}
              stock={item.quantity} // stock
              buttonLabel="Add to cart"
              buttonIcon={<IonIcon icon={searchOutline} />}
              onButtonClick={() => console.log("Add to cart:", item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PosItemPage;
