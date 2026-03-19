import React, { useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import { search, arrowBack } from "ionicons/icons";
import "./PosItem.css";
import { useHistory, useLocation } from "react-router-dom";
import POSCard from "../../components/Reusable/PosCard";
import { BackButton } from "../../components/Reusable/BackButton";
import {
  getInventoryItems,
  InventoryItem,
} from "../../logicHandlers/itemInvCrud";

type CartItem = InventoryItem & {
  cartQuantity: number;
};

type PosItemLocationState = {
  cartItems?: CartItem[];
};

const PosItemPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<PosItemLocationState>();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>(
    location.state?.cartItems || [],
  );

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

  const addToCart = (item: InventoryItem) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.item_id === item.item_id,
    );

    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = cartItems.map((cartItem) =>
        cartItem.item_id === item.item_id
          ? {
              ...cartItem,
              cartQuantity: Math.min(
                cartItem.cartQuantity + 1,
                cartItem.quantity,
              ),
            }
          : cartItem,
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          ...item,
          cartQuantity: item.quantity > 0 ? 1 : 0,
        },
      ];
    }

    setCartItems(updatedCart);

    history.push("/pos", {
      cartItems: updatedCart,
    });
  };

  const filteredItems = items.filter(
    (item) =>
      item.quantity > 0 &&
      item.item_name.toLowerCase().includes(searchText.toLowerCase())
  );  

  return (
    <div className="pos-item-container">
      <div className="item-main-container">
        <div className="top-header">
          <div className="top-top-header">
            <BackButton
              className="pos-btn-back"
              type="submit"
              onClick={() =>
                history.push("/pos", {
                  cartItems,
                })
              }
            >
              <IonIcon icon={arrowBack} />
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

        <div className="pos-item-card-list">
          {filteredItems.map((item) => (
            <POSCard
              key={item.item_id}
              productName={item.item_name}
              stock={item.quantity}
              price={item.price}
              buttonLabel="Add to cart"
              onButtonClick={() => addToCart(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PosItemPage;
