import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
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

type CartItem = InventoryItem & {
  cartQuantity: number;
};

type LocationState = {
  cartItems?: CartItem[];
  totalAmount?: number;
};

const PosCheckout: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();

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

  const handlePlaceOrder = async () => {
    try {
      if (cartItems.length === 0) {
        console.log("No items in cart");
        return;
      }

      if (paymentMethod === "cash" && Number(amountGiven) < totalAmount) {
        console.log("Insufficient cash amount");
        return;
      }

      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

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

      await createSale(salePayload);

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
    }
  };

  return (
    <div className="pos-item-container">
      <div className="item-main-container">
        <div className="top-top-header">
          <BackButton
            className="pos-btn-back"
            type="submit"
            onClick={() => history.push("/pos")}
          >
            <IonIcon icon={arrowBack} />
          </BackButton>
          <h2>Checkout</h2>
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
      />
    </div>
  );
};

export default PosCheckout;
