import React, { useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import { search, arrowBack, menu } from "ionicons/icons";
import "./PosItem.css";
import { useHistory, useLocation } from "react-router-dom";
import POSCard from "../../components/Reusable/PosCard";
import { BackButton } from "../../components/Reusable/BackButton";
import Menu from "../../components/Reusable/Menu";
import useResponsiveView from "../../hooks/useResponsiveView";
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

import { Network } from "@capacitor/network";
import { getAllInventoryItems } from "../../repositories/inventoryRepository";

const PosItemPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<PosItemLocationState>();
  const isMobileView = useResponsiveView();
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>(
    location.state?.cartItems || [],
  );

  useEffect(() => {
    const loadItems = async () => {
      try {
        let data: InventoryItem[] = [];
        const status = await Network.getStatus();

        if (status.connected) {
          try {
            data = await getInventoryItems();
          } catch (apiErr) {
            console.warn("API inventory load failed, trying local fallback...");
            const local = await getAllInventoryItems();
            data = local.map((l) => ({
              item_id: l.item_id,
              item_name: l.item_name || "Unknown Item",
              description: l.description || "",
              price: l.price || 0,
              quantity: l.quantity || 0,
              added_by: l.added_by || "unknown",
              created_at: l.created_at || "",
              updated_at: l.updated_at || "",
            }));
          }
        } else {
          const local = await getAllInventoryItems();
          data = local.map((l) => ({
            item_id: l.item_id,
            item_name: l.item_name || "Unknown Item",
            description: l.description || "",
            price: l.price || 0,
            quantity: l.quantity || 0,
            added_by: l.added_by || "unknown",
            created_at: l.created_at || "",
            updated_at: l.updated_at || "",
          }));
        }

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
      <Menu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
      />
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
