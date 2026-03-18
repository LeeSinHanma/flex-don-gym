import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Reusable/Button";
import { useHistory, useLocation } from "react-router-dom";
import "./Pos.css";
import { IonIcon } from "@ionic/react";
import { filter, menu } from "ionicons/icons";
import POSCard from "../../components/Reusable/PosCard";
import EmployeeMenu from "../../components/Reusable/EmployeeMenu";
import scanSound from "../../resource/scanSound.mp3";
import scanError from "../../resource/scanError.mp3";
import StatusModal from "../../components/Reusable/StatusModal";

import {
  startBarcodeScanner,
  stopBarcodeScanner,
} from "../../logicHandlers/barcodeScannerModule";
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
  const scanAudio = useRef<HTMLAudioElement | null>(null);
  const errorAudio = useRef<HTMLAudioElement | null>(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

    const playSuccessSound = () => {
    if (scanAudio.current) {
      scanAudio.current.currentTime = 0;
      scanAudio.current.play().catch(() => {});
    }
  };

  const playErrorSound = () => {
    if (errorAudio.current) {
      errorAudio.current.currentTime = 0;
      errorAudio.current.play().catch(() => {});
    }
  };

  const openStatusModal = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
  ) => {
    setStatusTitle(title);
    setStatusMessage(message);
    setStatusType(type);
    setShowStatusModal(true);
  };

  useEffect(() => {
    scanAudio.current = new Audio(scanSound);
    errorAudio.current = new Audio(scanError);
  }, []);

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

        if (!item) {
          playErrorSound();
          openStatusModal(
            "Item Not Found",
            "The scanned barcode does not match any product.",
            "error",
          );
          return;
        }

        if (item.quantity <= 0) {
          playErrorSound();
          openStatusModal(
            "Out of Stock",
            `${item.item_name} is currently out of stock.`,
            "warning",
          );
          return;
        }

        let didAddItem = false;
        let reachedMaxStock = false;

        setCartItems((prev) => {
          const existingItem = prev.find(
            (cartItem) => cartItem.item_id === item.item_id,
          );

          if (existingItem) {
            if (existingItem.cartQuantity >= item.quantity) {
              reachedMaxStock = true;
              return prev;
            }

            didAddItem = true;

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

          didAddItem = true;

          return [
            ...prev,
            {
              ...item,
              cartQuantity: 1,
            },
          ];
        });

        if (reachedMaxStock) {
          playErrorSound();
          openStatusModal(
            "Stock Limit Reached",
            `You already added the maximum available quantity for ${item.item_name}.`,
            "warning",
          );
          return;
        }

        if (didAddItem) {
          playSuccessSound();
        }
      } catch (error) {
        console.error("Scan handling error:", error);
        playErrorSound();
        openStatusModal(
          "Item Not Found",
          "The scanned barcode does not match any product.",
          "error",
        );
      } finally {
        setTimeout(() => {
          isProcessingScan.current = false;
        }, 1500);
      }
    };

    startBarcodeScanner("qr-reader", handleScan);

    return () => {
      stopBarcodeScanner();
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
        onBeforeLogout={() => stopBarcodeScanner()}
      />

      <StatusModal
        isOpen={showStatusModal}
        title={statusTitle}
        message={statusMessage}
        type={statusType}
        onClose={() => setShowStatusModal(false)}
      />
    </div>
  );
};

export default PosPage;