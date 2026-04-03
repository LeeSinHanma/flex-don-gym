import React, { useEffect, useState } from "react";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { getCurrentUser } from "../../logicHandlers/userServices";
import { getGymPricing } from "../../logicHandlers/gymPricing";
import { walkInVisit } from "../../logicHandlers/visits";
import StatusModal from "../../components/Reusable/StatusModal";
import LoadingScreen from "../LoadingScreen";
import { Network } from "@capacitor/network";
import { processWalkInOffline } from "../../logicHandlers/offlineQr";
import { getLocalGymPricing } from "../../repositories/pricingRepository";
import ConfirmModal from "../../components/Reusable/ConfirmModal";
import "./Member.css";

const WalkInMenu: React.FC = () => {
  const history = useHistory();
  const [guestLabel, setGuestLabel] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash">("cash");
  const [amountGiven, setAmountGiven] = useState<number | "">("");
  const [dayRate, setDayRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Status Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    const fetchPricing = async () => {
      try {
        const pricing = await getGymPricing();
        setDayRate(pricing.base_day_pass_price);
      } catch (err) {
        console.warn("Pricing API failed, trying local fallback:", err);
        const localPricing = await getLocalGymPricing();
        if (localPricing) {
          setDayRate(localPricing.base_day_pass_price);
        } else {
          setDayRate(55); // Fallback
        }
      }
    };
    fetchPricing();
  }, []);

  const handlePaymentMethodChange = (method: "cash" | "gcash") => {
    setPaymentMethod(method);
    if (method === "gcash") {
      setAmountGiven(dayRate);
    }
  };

  const handleAddClick = () => {
    const trimmedLabel = guestLabel.trim();
    if (!trimmedLabel) {
      openStatusModal(
        "Validation Error",
        "Please enter a guest name.",
        "warning",
      );
      return;
    }

    if (amountGiven === "" || Number(amountGiven) < dayRate) {
      openStatusModal(
        "Validation Error",
        "Amount given must be at least the day rate.",
        "warning",
      );
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      const user = getCurrentUser();
      const payload = {
        transacted_by: String(user?.userID || user?.user_id || "unknown"),
        payment_method: paymentMethod,
        amount_given: Number(amountGiven),
        guest_label: guestLabel.trim(),
      };

      const status = await Network.getStatus();

      if (status.connected) {
        await walkInVisit(payload);
        openStatusModal(
          "Success",
          "Walk-in visit recorded successfully.",
          "success",
        );
      } else {
        await processWalkInOffline(payload);
        openStatusModal(
          "Success (Offline)",
          "Walk-in recorded locally. It will sync once you are online.",
          "success",
        );
      }

      // Reset form
      setGuestLabel("");
      setAmountGiven("");
      setPaymentMethod("cash");
    } catch (err: any) {
      console.error("Walk-in failed:", err);
      openStatusModal(
        "Error",
        err.message || "Failed to record walk-in visit.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const calculateChange = () => {
    if (paymentMethod === "gcash") return 0;
    const given = Number(amountGiven) || 0;
    return Math.max(0, given - dayRate);
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className="member-menu-container">
        <div className="main-container">
          <div className="top-container">
            <BackButton
              className="btn btn-back"
              onClick={() => history.push("/qr")}
            >
              <IonIcon icon={arrowBack} />
            </BackButton>
            <h1>Walk-in</h1>
          </div>
          <div className="form-container">
            <div className="form-group">
              <label>Guest Name</label>
              <UsernameInput
                className="input-username"
                placeholder="Enter guest name"
                value={guestLabel}
                onChange={(e: any) => setGuestLabel(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-method-group">
                <Button
                  type="button"
                  className={`payment-btn ${
                    paymentMethod === "cash"
                      ? "payment-active"
                      : "payment-inactive"
                  }`}
                  onClick={() => handlePaymentMethodChange("cash")}
                >
                  Cash
                </Button>
                <Button
                  type="button"
                  className={`payment-btn ${
                    paymentMethod === "gcash"
                      ? "payment-active"
                      : "payment-inactive"
                  }`}
                  onClick={() => handlePaymentMethodChange("gcash")}
                >
                  GCash
                </Button>
              </div>
            </div>

            <div className="form-group">
              <label>Amount to Pay</label>
              <div className="accepted-details">
                <p>₱{dayRate.toFixed(2)}</p>
              </div>
            </div>

            <div className="form-group">
              <label>Amount Given</label>
              <UsernameInput
                className="input-username"
                placeholder="0.00"
                type="number"
                value={amountGiven}
                onChange={(e: any) =>
                  setAmountGiven(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                disabled={paymentMethod === "gcash"}
              />
            </div>

            {paymentMethod === "cash" && (
              <div className="form-group">
                <label>Change</label>
                <div className="accepted-details">
                  <p>₱{calculateChange().toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
          <div className="bottom-container">
            <Button
              className="btn btn-submit"
              type="button"
              onClick={handleAddClick}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        title="Confirm Walk-in"
        message={`Admit guest "${guestLabel}" with a payment of ₱${(Number(amountGiven) || 0).toFixed(2)} via ${paymentMethod === "cash" ? "Cash" : "GCash"}?`}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          if (statusType === "success") {
            history.push("/qr");
          }
        }}
        title={statusTitle}
        message={statusMessage}
        type={statusType}
      />
    </>
  );
};

export default WalkInMenu;

