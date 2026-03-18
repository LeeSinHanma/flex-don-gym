import React from "react";
import { Modal } from "../../components/Reusable/Modals";
import { Button } from "../../components/Reusable/Button";
import { InventoryItem } from "../../logicHandlers/itemInvCrud";
import "./ReceiptModal.css";

type CartItem = InventoryItem & {
  cartQuantity: number;
};

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: () => void;
  soldBy: string;
  paymentMethod: string;
  amountGiven: number;
  totalAmount: number;
  cartItems: CartItem[];
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  onDone,
  soldBy,
  paymentMethod,
  amountGiven,
  totalAmount,
  cartItems,
}) => {
  const change = amountGiven - totalAmount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Receipt"
      showCloseButton={false}
      className="receipt-modal"
    >
      <div className="receipt-content">
        <div className="receipt-row">
          <span>Sold by:</span>
          <span>{soldBy}</span>
        </div>

        <div className="receipt-row">
          <span>Payment method:</span>
          <span>{paymentMethod}</span>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-items">
          {cartItems.map((item) => (
            <div className="receipt-item" key={item.item_id}>
              <div className="receipt-item-name">
                {item.item_name} x{item.cartQuantity}
              </div>
              <div className="receipt-item-price">
                ₱{(item.price * item.cartQuantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="receipt-divider" />

        <div className="receipt-row">
          <span>Total:</span>
          <span>₱{totalAmount.toFixed(2)}</span>
        </div>

        <div className="receipt-row">
          <span>Amount given:</span>
          <span>₱{amountGiven.toFixed(2)}</span>
        </div>

        <div className="receipt-row receipt-change">
          <span>Change:</span>
          <span>₱{change.toFixed(2)}</span>
        </div>

        <div className="receipt-actions">
          <Button type="button" className="btn-checkout" onClick={onDone}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
