import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Reusable/Button";
import { useHistory } from "react-router-dom";
import "./Pos.css";
import { IonIcon } from "@ionic/react";
import { cartOutline, menuOutline } from "ionicons/icons";
import PosNav from "../../components/Reusable/NavItems";
import POSCard from "../../components/Reusable/PosCard";

import {
  startQrScanner,
  stopQrScanner,
} from "../../logicHandlers/qrScannerModule";
import {
  getInventoryItemById,
  InventoryItem,
} from "../../logicHandlers/itemInvCrud";

type CartItem = InventoryItem & {
  cartQuantity: number;
};

const PosPage: React.FC = () => {
  const history = useHistory();
  const isProcessingScan = useRef(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const handleScan = async (decodedText: string) => {
      if (isProcessingScan.current) return;

      isProcessingScan.current = true;

      try {
        const itemId = decodedText.trim();
        if (!itemId) return;

        console.log("Scanned barcode:", itemId);

        const item = await getInventoryItemById(itemId);
        console.log("Item found:", item);

        setCartItems((prev) => {
          const existingItem = prev.find(
            (cartItem) => cartItem.item_id === item.item_id,
          );

          if (existingItem) {
            return prev.map((cartItem) =>
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
          }

          return [
            ...prev,
            {
              ...item,
              cartQuantity: item.quantity > 0 ? 1 : 0,
            },
          ];
        });
      } catch (error) {
        console.error("Scan handling error:", error);
      } finally {
        setTimeout(() => {
          isProcessingScan.current = false;
        }, 1500);
      }
    };

    startQrScanner("product", handleScan);

    return () => {
      stopQrScanner();
    };
  }, []);

  const updateCartQuantity = (itemId: string, newCount: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.item_id === itemId
            ? {
                ...item,
                cartQuantity: Math.max(0, Math.min(newCount, item.quantity)),
              }
            : item,
        )
        .filter((item) => item.cartQuantity > 0),
    );
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0,
  );

  return (
    <div className="pos-main-container">
      <div className="pos-container">
        <div className="pos-header">
          <IonIcon
            icon={menuOutline}
            className="menu-icon"
            onClick={() => history.push("/pos-item")}
          />
          <Button
            type="button"
            className="btn-checkout"
            onClick={() => history.push("/pos-checkout")}
          >
            Checkout
          </Button>
        </div>

        <div className="barcode">
          <div id="qr-reader" style={{ width: "100%" }}></div>
        </div>

        <div className="shopping-info">
          <div className="cart">
            <IonIcon icon={cartOutline} className="cart-icon" />
            <h2 className="shop-cart">Shopping Cart</h2>
          </div>
          <div className="total-amount">
            <h2 className="amount">₱{totalAmount.toFixed(2)}</h2>
          </div>
        </div>

        <div className="pos-card-item">
          {cartItems.length === 0 ? (
            <p>No items scanned yet.</p>
          ) : (
            cartItems.map((item) => (
              <POSCard
                key={item.item_id}
                productName={item.item_name}
                price={item.price}
                initialCount={item.cartQuantity}
                minCount={0}
                maxCount={item.quantity}
                onCountChange={(count) =>
                  updateCartQuantity(item.item_id, count)
                }
              />
            ))
          )}
        </div>

        <div className="pos-footer">
          <PosNav
            items={[
              { label: "POS", path: "/pos" },
              { label: "QR Scanner", path: "/qr" },
              { label: "Status", path: "/status-member" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PosPage;
