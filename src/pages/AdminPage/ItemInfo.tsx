import React, { useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import { BackButton } from "../../components/Reusable/BackButton";
import { useHistory, useLocation } from "react-router-dom";
import { arrowBackOutline } from "ionicons/icons";
import "./AdminDashboard.css";
import { UsernameInput } from "../../components/Reusable/Username";
import { Button } from "../../components/Reusable/Button";
import { InventoryItem, deleteInventoryItem } from "../../logicHandlers/itemInvCrud";
import { Modal } from "../../components/Reusable/Modals";

type LocationState = {
  item?: InventoryItem;
};

const ItemInfoPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const passedItem = location.state?.item;

  // local form states
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    
    if (!passedItem) return;

    setItemName(passedItem.item_name ?? "");
    setDescription(passedItem.description ?? "");
    setPrice(Number(passedItem.price ?? 0));
    setQuantity(Number(passedItem.quantity ?? 0));
  }, [passedItem]);

  const handleDelete = async () => {
    if (!passedItem?.item_id) return;

    try {
      await deleteInventoryItem(passedItem.item_id);
      setShowDeleteModal(false);
      history.push("/admin-product");
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-main-container">
        <div className="admin-top-header">
          <BackButton
            className="btn status-btn-back"
            onClick={() => history.push("/admin-product")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>

          <h2>Edit Products</h2>
        </div>

        {/* optional guard */}
        {!passedItem && (
          <p style={{ textAlign: "center", color: "red" }}>
            No product selected. Go back and click a product card.
          </p>
        )}

        <div className="form-container">
          <UsernameInput
            className="input-username"
            placeholder="Item Name"
            value={itemName}
            onChange={(e: any) => setItemName(e.target.value)}
          />

          <UsernameInput
            className="input-username"
            placeholder="Description"
            type="text"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />

          <UsernameInput
            className="input-username"
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e: any) => setPrice(Number(e.target.value))}
          />

          <UsernameInput
            className="input-username"
            placeholder="Quantity"
            type="number"
            value={quantity}
            onChange={(e: any) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="status-button-container">
          <div className="status-button">
            <Button
              type="button"
              className="renew-btn"
              onClick={() => history.push("/admin-product")}
            >
              Cancel
            </Button>

            <Button
              type="button"
              className="renew-btn"
              disabled={!passedItem}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>

            <Button type="button" className="cancel-btn">
              Save
            </Button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        showCloseButton={false}
        className="confirm-modal"
      >
        <p style={{ textAlign: "center" }}>
          Are you sure you want to delete this product?
        </p>

        <div className="success-actions">
          <Button
            type="button"
            className="renew-btn"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="cancel-btn"
            onClick={handleDelete}
          >
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ItemInfoPage;