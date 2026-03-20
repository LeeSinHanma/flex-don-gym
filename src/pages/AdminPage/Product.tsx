import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { Modal } from "../../components/Reusable/Modals";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline, menuOutline } from "ionicons/icons";
import POSCard from "../../components/Reusable/PosCard";
import AdminMenu from "../../components/Reusable/AdminMenu";
import "./AdminDashboard.css";
import "./Product.css";
import BarcodeScanModal from "../../components/Reusable/BarcodeScanModal";
import {
  createInventoryItem,
  getInventoryItems,
  InventoryItem,
  CreateInventoryItem,
} from "../../logicHandlers/itemInvCrud";
import { stopBarcodeScanner } from "../../logicHandlers/barcodeScannerModule";
import StatusModal from "../../components/Reusable/StatusModal";
import ConfirmModal from "../../components/Reusable/ConfirmModal";
import NumberInput from "../../components/Reusable/NumberInput";

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
  const [price, setPrice] = useState<string>("0");
  const [quantity, setQuantity] = useState<string>("0");
  const [addedBy, setAddedBy] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scanTarget, setScanTarget] = useState<"itemId" | "search">("itemId");
  const [sortType, setSortType] = useState<
    "default" | "name-asc" | "name-desc" | "price-asc" | "price-desc"
  >("default");

  const [stockFilter, setStockFilter] = useState<
    "all" | "in-stock" | "out-of-stock"
  >("all");

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setAddedBy(parsedUser.username || "");
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    let result = [...items];

    const q = searchValue.trim().toLowerCase();

    // 🔍 search
    if (q) {
      result = result.filter((it) => {
        const name = (it.item_name ?? "").toLowerCase();
        const desc = (it.description ?? "").toLowerCase();
        const id = (it.item_id ?? "").toLowerCase();
        return name.includes(q) || desc.includes(q) || id.includes(q);
      });
    }

    // 📦 stock filter
    if (stockFilter === "in-stock") {
      result = result.filter((it) => it.quantity > 0);
    } else if (stockFilter === "out-of-stock") {
      result = result.filter((it) => it.quantity === 0);
    }

    // 🔽 sorting
    switch (sortType) {
      case "name-asc":
        result.sort((a, b) => a.item_name.localeCompare(b.item_name));
        break;
      case "name-desc":
        result.sort((a, b) => b.item_name.localeCompare(a.item_name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [items, searchValue, sortType, stockFilter]);

  const openAddProductModal = () => {
    setIsModalOpen(true);
    setErrorMessage("");
  };

  const closeModal = async () => {
    setItemId("");
    setItemName("");
    setDescription("");
    setPrice("0");
    setQuantity("0");
    setErrorMessage("");
    await stopBarcodeScanner();
    setIsScanModalOpen(false);
    setIsModalOpen(false);

    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setAddedBy(parsedUser.username || "");
      } catch (e) {
        console.error("Failed to parse user from localStorage");
        setAddedBy("");
      }
    }
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCreateProduct = async () => {
    if (!itemId.trim() || !itemName.trim() || !addedBy.trim()) {
      setErrorMessage("Item ID, Item Name, and Added By are required.");
      return;
    }

    const numericPrice = price === "" ? 0 : Number(price);
    const numericQuantity = quantity === "" ? 0 : Number(quantity);

    if (numericPrice < 0 || numericQuantity < 0) {
      setErrorMessage("Price and Quantity cannot be negative.");
      return;
    }

    const payload: CreateInventoryItem = {
      item_id: itemId.trim(),
      item_name: itemName.trim(),
      description: description.trim(),
      price: numericPrice,
      quantity: numericQuantity,
      added_by: addedBy.trim(),
    };

    try {
      setIsSaving(true);
      setErrorMessage("");

      await createInventoryItem(payload);
      await loadItems();
      await closeModal();

      openStatusModal(
        "Product Added",
        `"${itemName}" was added successfully.`,
        "success",
      );
    } catch (e: any) {
      openStatusModal(
        "Create Failed",
        e?.message || "Create product failed",
        "error",
      );
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
            onClick={handleMenuClick}
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

            {/* Scan */}
            <button
              type="button"
              className="product-search-btn"
              onClick={() => {
                setScanTarget("search");
                setIsScanModalOpen(true);
              }}
            >
              Scan
            </button>

            {/* Sort / Filter Dropdown */}
            <div className="sort-dropdown-wrapper" ref={dropdownRef}>
              <button
                className="product-search-btn"
                onClick={() => setShowSortDropdown((prev) => !prev)}
              >
                Filter
              </button>

              {showSortDropdown && (
                <div className="sort-dropdown">
                  <p className="dropdown-label">Sort</p>

                  <button onClick={() => setSortType("default")}>
                    Default
                  </button>
                  <button
                    className={sortType === "name-asc" ? "active" : ""}
                    onClick={() => {
                      setSortType("name-asc");
                      setShowSortDropdown(false);
                    }}
                  >
                    Name A-Z
                  </button>
                  <button
                    className={sortType === "name-desc" ? "active" : ""}
                    onClick={() => {
                      setSortType("name-desc");
                      setShowSortDropdown(false);
                    }}
                  >
                    Name Z-A
                  </button>
                  <button
                    className={sortType === "price-asc" ? "active" : ""}
                    onClick={() => {
                      setSortType("price-asc");
                      setShowSortDropdown(false);
                    }}
                  >
                    Price Low → High
                  </button>
                  <button
                    className={sortType === "price-desc" ? "active" : ""}
                    onClick={() => {
                      setSortType("price-desc");
                      setShowSortDropdown(false);
                    }}
                  >
                    Price High → Low
                  </button>

                  <hr />

                  <p className="dropdown-label">Stock</p>

                  <button
                    className={stockFilter === "all" ? "active" : ""}
                    onClick={() => {
                      setStockFilter("all");
                      setShowSortDropdown(false);
                    }}
                  >
                    All
                  </button>
                  <button
                    className={stockFilter === "in-stock" ? "active" : ""}
                    onClick={() => {
                      setStockFilter("in-stock");
                      setShowSortDropdown(false);
                    }}
                  >
                    In Stock
                  </button>
                  <button
                    className={stockFilter === "out-of-stock" ? "active" : ""}
                    onClick={() => {
                      setStockFilter("out-of-stock");
                      setShowSortDropdown(false);
                    }}
                  >
                    Out of Stock
                  </button>
                </div>
              )}
            </div>
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
        className="confirm-modals"
      >
        <div className="employee-form">
          {errorMessage && (
            <p style={{ color: "red", margin: 0, textAlign: "center" }}>
              {errorMessage}
            </p>
          )}

          <div className="form-group">
            <div className="label-with-action">
              <label>Item ID *</label>

              <button
                type="button"
                className="scan-btn"
                onClick={() => {
                  setScanTarget("itemId");
                  setIsScanModalOpen(true);
                }}
              >
                Scan
              </button>
            </div>

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
            <NumberInput
              className="employee-input"
              placeholder="Enter price"
              value={price}
              onChange={setPrice}
              allowDecimal
              prefix="₱"
              formatWithCommas
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <NumberInput
              className="employee-input"
              placeholder="Enter quantity"
              value={quantity}
              onChange={setQuantity}
              formatWithCommas
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
              onClick={() => setShowConfirmModal(true)}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
      <BarcodeScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScanned={(value) => {
          if (scanTarget === "itemId") {
            setItemId(value);
          } else if (scanTarget === "search") {
            setSearchValue(value);
          }
        }}
        title="Scan Item Barcode"
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirm Product Creation"
        message={`Are you sure you want to create "${
          itemName || "this product"
        }"?

        Price: ₱${(price === "" ? 0 : Number(price)).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        Quantity: ${(quantity === "" ? 0 : Number(quantity)).toLocaleString()}`}
        confirmText="Confirm"
        cancelText="Cancel"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={async () => {
          setShowConfirmModal(false);
          await handleCreateProduct();
        }}
      />

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={statusTitle}
        message={statusMessage}
        type={statusType}
      />
      <AdminMenu isOpen={isMenuOpen} onClose={handleCloseMenu} />
    </div>
  );
};

export default ProductPage;
