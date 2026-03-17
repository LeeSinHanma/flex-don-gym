import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Reusable/Button";
import { useHistory, useLocation } from "react-router-dom";
import "./Pos.css";
import { IonIcon } from "@ionic/react";
import { filter, menu } from "ionicons/icons";
import POSCard from "../../components/Reusable/PosCard";
import EmployeeMenu from "../../components/Reusable/EmployeeMenu";

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

type PosLocationState = {
  cartItems?: CartItem[];
};

const PosPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<PosLocationState>();
  const isProcessingScan = useRef(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);

  useEffect(() => {
    if (location.state?.cartItems) {
      setCartItems(location.state.cartItems);
    }
  }, [location.state]);

  useEffect(() => {
    const handleScan = async (decodedText: string) => {
      if (isProcessingScan.current) return;

      isProcessingScan.current = true;

      try {
        const itemId = decodedText.trim();
        if (!itemId) return;

        const item = await getInventoryItemById(itemId);

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
          <button
            type="button"
            className="icon-button"
            onClick={() =>
              history.push("/pos-item", {
                cartItems,
              })
            }
            aria-label="Filter items"
          >
            <IonIcon icon={filter} />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => setShowEmployeeMenu(true)}
            aria-label="Open menu"
          >
            <IonIcon icon={menu} />
          </button>
        </div>

        <div className="barcode">
          <div id="qr-reader" style={{ width: "100%" }}></div>
        </div>

        <div className="shopping-info">
          <div className="cart">
            <h2 className="shop-cart">Shopping Cart</h2>
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

        <div className="pos-checkout-footer">
          <p className="pos-checkout-footer-text">
            Total: ₱{totalAmount.toFixed(2)}
          </p>
          <Button
            className="btn-checkout"
            type="button"
            onClick={() =>
              history.push("/pos-checkout", {
                cartItems,
                totalAmount,
              })
            }
          >
            Checkout
          </Button>
        </div>
      </div>

      <EmployeeMenu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
        onBeforeLogout={() => stopQrScanner()}
      />
    </div>
  );
};

export default PosPage;
