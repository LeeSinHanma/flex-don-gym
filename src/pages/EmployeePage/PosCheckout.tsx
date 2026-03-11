import React from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory, useLocation } from "react-router-dom";
import POSCard from "../../components/Reusable/PosCard";
import "./PosItem.css";
import "./PosCheckout.css";
import { InventoryItem } from "../../logicHandlers/itemInvCrud";

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

  const handlePlaceOrder = async () => {
    try {
      if (cartItems.length === 0) {
        console.log("No items in cart");
        return;
      }

      const orderPayload = {
        items: cartItems.map((item) => ({
          item_id: item.item_id,
          quantity: item.cartQuantity,
          price: item.price,
        })),
        total_amount: totalAmount,
      };

      console.log("Order to submit:", orderPayload);

      // later:
      // await createOrder(orderPayload);

      history.push("/pos");
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
            <IonIcon icon={arrowBackOutline} />
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
            onClick={handlePlaceOrder}
          >
            Place order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PosCheckout;
