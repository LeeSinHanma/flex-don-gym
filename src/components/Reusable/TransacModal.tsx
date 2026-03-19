import React from "react";
import { Modal } from "../../components/Reusable/Modals";
import { Button } from "../../components/Reusable/Button";
import "./TransacModal.css";

interface TransacModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  totalAmount: number;
  paymentMethod: "cash" | "gcash";
  setPaymentMethod: (method: "cash" | "gcash") => void;
  amountGiven: string;
  setAmountGiven: (value: string) => void;
}

const TransacModal: React.FC<TransacModalProps> = ({
  isOpen,
  onClose,
  onCheckout,
  totalAmount,
  paymentMethod,
  setPaymentMethod,
  amountGiven,
  setAmountGiven,
}) => {
  const isGcash = paymentMethod === "gcash";
  const change = isGcash
    ? 0
    : Math.max(Number(amountGiven || 0) - totalAmount, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction"
      showCloseButton={false}
      className="transac-modal"
    >
      <div className="transac-modal-content">
        <p className="transac-total">Total: ₱{totalAmount.toFixed(2)}</p>

        <div className="transac-section">
          <p className="transac-label">Payment method</p>

          <div className="transac-method-buttons">
            <button
              type="button"
              className={`transac-method-btn ${
                paymentMethod === "cash" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("cash")}
            >
              Cash
            </button>

            <button
              type="button"
              className={`transac-method-btn ${
                paymentMethod === "gcash" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("gcash")}
            >
              GCash
            </button>
          </div>
        </div>

        <div className="transac-section">
          <p className="transac-label">Input</p>
          <input
            type="number"
            className="transac-input"
            placeholder="Enter amount"
            value={isGcash ? totalAmount : amountGiven}
            onChange={(e) => setAmountGiven(e.target.value)}
            disabled={isGcash}
          />
        </div>

        <div className="transac-section">
          <p className="transac-change">Change: ₱{change.toFixed(2)}</p>
        </div>

        <div className="transac-actions">
          <Button type="button" className="btn-checkout" onClick={onCheckout}>
            Checkout
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TransacModal;
