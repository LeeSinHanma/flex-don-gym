import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { Modal } from "../../components/Reusable/Modals";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline, menuOutline } from "ionicons/icons";
import POSCard from "../../components/Reusable/PosCard";
import "./AdminDashboard.css";
import "./Product.css";

import {
  createInventoryItem,
  getInventoryItems,
  InventoryItem,
  CreateInventoryItem,
} from "../../logicHandlers/itemInvCrud"; // ✅ make sure this is the correct path

const ProductPage: React.FC = () => {
  const history = useHistory();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // list state
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // search
  const [searchValue, setSearchValue] = useState("");

  // form states
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [addedBy, setAddedBy] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const data = await getInventoryItems();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return items;

    return items.filter((it) => {
      const name = (it.item_name ?? "").toLowerCase();
      const desc = (it.description ?? "").toLowerCase();
      const id = (it.item_id ?? "").toLowerCase();
      return name.includes(q) || desc.includes(q) || id.includes(q);
    });
  }, [items, searchValue]);

  const openAddProductModal = () => {
    setIsModalOpen(true);
    setErrorMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setItemId("");
    setItemName("");
    setDescription("");
    setPrice(0);
    setQuantity(0);
    setAddedBy("");
    setErrorMessage("");
  };

  const handleCreateProduct = async () => {
    if (!itemId.trim() || !itemName.trim() || !addedBy.trim()) {
      setErrorMessage("Item ID, Item Name, and Added By are required.");
      return;
    }
    if (price < 0 || quantity < 0) {
      setErrorMessage("Price and Quantity cannot be negative.");
      return;
    }

    const payload: CreateInventoryItem = {
      item_id: itemId.trim(),
      item_name: itemName.trim(),
      description: description.trim(),
      price: Number(price),
      quantity: Number(quantity),
      added_by: addedBy.trim(),
    };

    try {
      setIsSaving(true);
      setErrorMessage("");

      await createInventoryItem(payload);

      closeModal();
      await loadItems(); // ✅ refresh list so new product appears
    } catch (e: any) {
      setErrorMessage(e?.message || "Create product failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="main-container product-main-container">
        <div className="admin-top-header">
          <BackButton
            className="btn"
            type="button"
            onClick={() => history.push("/admin-dashboard")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>

          <h1>Product</h1>
          <IonIcon
            icon={menuOutline}
            className="menu-icon"
            onClick={() => history.push("/admin-dashboard")}
          />
        </div>

        <div className="admin-main-content">
          <div className="product-search-row">
            <input
              className="product-search-input"
              type="text"
              placeholder="Search by name / id / description"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              type="button"
              className="product-search-btn"
              onClick={() => {
                // optional: keep, but filtering already happens as you type
              }}
            >
              Scan
            </button>
          </div>

          <div className="product-card-wrapper">
            {isLoading && <p style={{ textAlign: "center" }}>Loading...</p>}

            {!isLoading && filteredItems.length === 0 && (
              <p style={{ textAlign: "center" }}>No products found.</p>
            )}

            {filteredItems.map((item) => (
              <div
                key={item.item_id}
                onClick={() => history.push("/admin-item-info", { item })}
                style={{ cursor: "pointer" }}
              >
                <POSCard
                  productName={item.item_name}
                  price={item.price}
                  topRight={
                    <span className="product-stock-text">
                      {item.quantity} stocks
                    </span>
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bottom-container">
          <Button
            className="btn btn-submit"
            type="button"
            onClick={openAddProductModal}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* ✅ Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Add New Product"
        showCloseButton={false}
        className="confirm-modal"
      >
        <div className="employee-form">
          {errorMessage && (
            <p style={{ color: "red", margin: 0, textAlign: "center" }}>
              {errorMessage}
            </p>
          )}

          <div className="form-group">
            <label>Item ID *</label>
            <input
              className="employee-input"
              placeholder="e.g. ITEM-001"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Item Name *</label>
            <input
              className="employee-input"
              placeholder="e.g. Protein Powder"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              className="employee-input"
              placeholder="Optional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              className="employee-input"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              className="employee-input"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Added By *</label>
            <input
              className="employee-input"
              placeholder="e.g. admin"
              value={addedBy}
              onChange={(e) => setAddedBy(e.target.value)}
            />
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 10 }}>
            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={closeModal}
            >
              Cancel
            </Button>

            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={handleCreateProduct}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductPage;
