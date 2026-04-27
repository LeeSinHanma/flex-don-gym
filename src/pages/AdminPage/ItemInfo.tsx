import React, { useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory, useLocation } from "react-router-dom";
import { arrowBack, menu } from "ionicons/icons";
import Menu from "../../components/Reusable/Menu";
import useResponsiveView from "../../hooks/useResponsiveView";
import "./AdminDashboard.css";
import "./ItemInfo.css";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import {
  InventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
} from "../../logicHandlers/itemInvCrud";
import { Modal } from "../../components/Reusable/Modals";
import ConfirmModal from "../../components/Reusable/ConfirmModal";
import StatusModal from "../../components/Reusable/StatusModal";
import NumberInput from "../../components/Reusable/NumberInput";

type LocationState = {
  item?: InventoryItem;
};

const ItemInfoPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const isMobileView = useResponsiveView();
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const passedItem = location.state?.item;

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [quantity, setQuantity] = useState<string>("0");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmType, setConfirmType] = useState<"save" | "delete" | null>(
    null,
  );

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!passedItem) return;

    setItemName(passedItem.item_name ?? "");
    setDescription(passedItem.description ?? "");
    setPrice(String(passedItem.price ?? 0));
    setQuantity(String(passedItem.quantity ?? 0));
  }, [passedItem]);

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

  const handleDelete = async () => {
    if (!passedItem?.item_id) return;

    try {
      await deleteInventoryItem(passedItem.item_id);
      setShouldRedirect(true);
      openStatusModal("Deleted", "Product deleted successfully.", "success");
    } catch (e: any) {
      console.error(e);
      openStatusModal("Delete Failed", e?.message || "Delete failed", "error");
    }
  };

  const handleSave = async () => {
    if (!passedItem?.item_id) return;

    try {
      setIsSaving(true);

      await updateInventoryItem(passedItem.item_id, {
        item_name: itemName.trim(),
        description: description.trim(),
        price: price === "" ? 0 : Number(price),
        quantity: quantity === "" ? 0 : Number(quantity),
      });

      setShouldRedirect(true);
      openStatusModal("Saved", "Product updated successfully.", "success");
    } catch (e: any) {
      console.error(e);
      openStatusModal("Update Failed", e?.message || "Update failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmAction = async () => {
    setShowConfirmModal(false);

    if (confirmType === "save") {
      await handleSave();
    }

    if (confirmType === "delete") {
      await handleDelete();
    }

    setConfirmType(null);
  };

  return (
    <>
      <Menu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
      />
      <div className="admin-dashboard-container">
        <div className="main-container">
          <div className="status-header-row">
            <BackButton
              className="status-page-back"
              onClick={() => history.push("/admin-product")}
            >
              <IonIcon icon={arrowBack} />
            </BackButton>

            <h2>Edit Products</h2>
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

          {!passedItem && (
            <p style={{ textAlign: "center", color: "red" }}>
              No product selected. Go back and click a product card.
            </p>
          )}

          <div className="form-container">
            <div className="form-group">
              <label>Item Name:</label>
              <UsernameInput
                className="input-username"
                placeholder="Item Name"
                value={itemName}
                onChange={(e: any) => setItemName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Item Description:</label>
              <UsernameInput
                className="input-username"
                placeholder="Description"
                type="text"
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Price:</label>
              <NumberInput
                className="input-username"
                placeholder="Price"
                value={price}
                onChange={setPrice}
                allowDecimal
                prefix="₱"
                formatWithCommas
              />
            </div>

            <div className="form-group">
              <label>Stock:</label>
              <NumberInput
                className="input-username"
                placeholder="Quantity"
                value={quantity}
                onChange={setQuantity}
                formatWithCommas
              />
            </div>
          </div>

          <div className="status-button-container">
            <div className="status-button">
              <Button
                type="button"
                className="renew-btn"
                disabled={!passedItem || isSaving}
                onClick={() => {
                  setConfirmType("save");
                  setShowConfirmModal(true);
                }}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>

              <Button
                type="button"
                className="cancel-btn"
                disabled={!passedItem}
                onClick={() => {
                  setConfirmType("delete");
                  setShowConfirmModal(true);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={showConfirmModal}
          title={confirmType === "delete" ? "Confirm Delete" : "Confirm Save"}
          message={
            confirmType === "delete"
              ? "Are you sure you want to delete this product?"
              : "Are you sure you want to save these changes?"
          }
          confirmText={confirmType === "delete" ? "Delete" : "Save"}
          cancelText="Cancel"
          onCancel={() => {
            setShowConfirmModal(false);
            setConfirmType(null);
          }}
          onConfirm={handleConfirmAction}
        />

        <StatusModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);

            if (shouldRedirect) {
              setShouldRedirect(false);
              history.push("/admin-product");
            }
          }}
          title={statusTitle}
          message={statusMessage}
          type={statusType}
        />
      </div>
    </>
  );
};

export default ItemInfoPage;
