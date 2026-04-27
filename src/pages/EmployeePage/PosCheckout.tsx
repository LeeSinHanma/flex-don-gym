import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory, useLocation } from "react-router-dom";
import POSCard from "../../components/Reusable/PosCard";
import "./PosItem.css";
import "./PosCheckout.css";
import { InventoryItem } from "../../logicHandlers/itemInvCrud";
import { createSale } from "../../logicHandlers/salesHandler";
import ReceiptModal from "../../components/Reusable/ReceiptModal";
import TransacModal from "../../components/Reusable/TransacModal";
import StatusModal from "../../components/Reusable/StatusModal";
import { getCurrentUser } from "../../logicHandlers/userServices";
import Menu from "../../components/Reusable/Menu";
import useResponsiveView from "../../hooks/useResponsiveView";

type CartItem = InventoryItem & {
  cartQuantity: number;
};

type LocationState = {
  cartItems?: CartItem[];
  totalAmount?: number;
};

import { Network } from "@capacitor/network";
import { processSaleOffline } from "../../logicHandlers/offlineSales";

const PosCheckout: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const isMobileView = useResponsiveView();
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);

  const cartItems = location.state?.cartItems ?? [];
  const totalAmount = location.state?.totalAmount ?? 0;

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptSoldBy, setReceiptSoldBy] = useState("");
  const [receiptPaymentMethod, setReceiptPaymentMethod] = useState<
    "cash" | "gcash"
  >("cash");
  const [receiptAmountGiven, setReceiptAmountGiven] = useState(0);
  const [showTransacModal, setShowTransacModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash">("cash");
  const [amountGiven, setAmountGiven] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const openStatusModal = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setStatusTitle(title);
    setStatusMessage(message);
    setStatusType(type);
    setShowStatusModal(true);
  };

  const handlePlaceOrder = async () => {
    try {
      if (cartItems.length === 0) {
        openStatusModal("Empty Cart", "There are no items in the cart.", "info");
        return;
      }

      if (paymentMethod === "cash" && Number(amountGiven) < totalAmount) {
        setShowTransacModal(false);

        openStatusModal(
          "Insufficient Amount",
          "The cash amount given is less than the total amount.",
          "warning"
        );
        return;
      }

      const parsedUser = getCurrentUser();

      const soldBy =
        parsedUser?.username ||
        parsedUser?.name ||
        parsedUser?.email ||
        "unknown";

      const finalAmountGiven =
        paymentMethod === "gcash" ? totalAmount : Number(amountGiven);

      const salePayload = {
        sold_by: soldBy,
        payment_method: paymentMethod,
        amount_given: finalAmountGiven,
        items: cartItems.map((item) => ({
          item_id: item.item_id,
          item_name: item.item_name,
          quantity: item.cartQuantity,
          unit_price: item.price,
        })),
      };

      console.log("Placing order with payload:", salePayload);

      setIsLoading(true);
      let saleId = "";
      const networkStatus = await Network.getStatus();

      if (networkStatus.connected) {
        try {
          const response = await createSale(salePayload);
          saleId = response.sale_id;
          console.log("Online sale created with ID:", saleId);
        } catch (apiErr) {
          console.warn("API sale creation failed, trying offline fallback...");
          const offlineResult = await processSaleOffline(salePayload);
          saleId = offlineResult.sale_id;
          console.log("Offline fallback sale created with ID:", saleId);
        }
      } else {
        const offlineResult = await processSaleOffline(salePayload);
        saleId = offlineResult.sale_id;
        console.log("Offline sale created with ID:", saleId);
      }

      // close transaction modal
      setShowTransacModal(false);

      // save values for receipt modal
      setReceiptSoldBy(soldBy);
      setReceiptPaymentMethod(paymentMethod);
      setReceiptAmountGiven(finalAmountGiven);

      // open receipt
      setShowReceiptModal(true);
    } catch (error) {
      console.error("Checkout failed:", error);
      openStatusModal("Checkout Failed", "An error occurred while processing your order.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pos-item-container">
      <Menu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
      />
      <div className="item-main-container">
        <div className="status-header-row">
          <BackButton
            className="status-page-back"
            type="submit"
            onClick={() => history.push("/pos")}
          >
            <IonIcon icon={arrowBack} />
          </BackButton>
          <h2>Checkout</h2>
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

        <div className="pos-checkout-info">
          {cartItems.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            cartItems.map((item) => (
              <POSCard
                key={item.item_id}
                productName={`${item.item_name} x${item.cartQuantity}`}
                price={item.price * item.cartQuantity}
                onButtonClick={() => console.log("Viewing item:", item)}
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
            onClick={() => setShowTransacModal(true)}
            disabled={isLoading}
          >
            Place order
          </Button>
        </div>
      </div>

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        onDone={() => {
          setShowReceiptModal(false);
          history.push("/pos");
        }}
        soldBy={receiptSoldBy}
        paymentMethod={receiptPaymentMethod}
        amountGiven={receiptAmountGiven}
        totalAmount={totalAmount}
        cartItems={cartItems}
      />

      <TransacModal
        isOpen={showTransacModal}
        onClose={() => setShowTransacModal(false)}
        onCheckout={handlePlaceOrder}
        totalAmount={totalAmount}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        amountGiven={amountGiven}
        setAmountGiven={setAmountGiven}
        isLoading={isLoading}
      />

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={statusTitle}
        message={statusMessage}
        type={statusType}
      />
    </div>
  );
};

export default PosCheckout;
