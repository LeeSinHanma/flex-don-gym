import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonBadge,
  IonIcon,
  IonButtons,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonText,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import AdminHeader from "../../components/admincomponents/Layout/header";
import {
  addOutline,
  createOutline,
  trashOutline,
  closeOutline,
  gridOutline,
  listOutline,
  warningOutline,
  cubeOutline,
} from "ionicons/icons";
import "./common.css";
import "./products.css";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  sku?: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Protein Powder - Vanilla",
      category: "Supplements",
      price: 49.99,
      stock: 25,
      description: "Premium whey protein isolate",
      sku: "SUP-001",
    },
    {
      id: 2,
      name: "Protein Powder - Chocolate",
      category: "Supplements",
      price: 49.99,
      stock: 8,
      description: "Premium whey protein isolate",
      sku: "SUP-002",
    },
    {
      id: 3,
      name: "Gym T-Shirt - Black",
      category: "Apparel",
      price: 24.99,
      stock: 45,
      description: "Moisture-wicking athletic shirt",
      sku: "APP-001",
    },
    {
      id: 4,
      name: "Gym T-Shirt - White",
      category: "Apparel",
      price: 24.99,
      stock: 3,
      description: "Moisture-wicking athletic shirt",
      sku: "APP-002",
    },
    {
      id: 5,
      name: "Water Bottle",
      category: "Accessories",
      price: 14.99,
      stock: 67,
      description: "1L insulated water bottle",
      sku: "ACC-001",
    },
    {
      id: 6,
      name: "Resistance Bands Set",
      category: "Equipment",
      price: 29.99,
      stock: 15,
      description: "5-piece resistance band set",
      sku: "EQP-001",
    },
    {
      id: 7,
      name: "Lifting Gloves",
      category: "Accessories",
      price: 19.99,
      stock: 6,
      description: "Premium padded lifting gloves",
      sku: "ACC-002",
    },
    {
      id: 8,
      name: "Pre-Workout Mix",
      category: "Supplements",
      price: 39.99,
      stock: 2,
      description: "Energy boost pre-workout formula",
      sku: "SUP-003",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    sku: "",
  });

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: "", category: "", price: "", stock: "", description: "", sku: "" });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || "",
      sku: product.sku || "",
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      alert("Please fill in all required fields");
      return;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description,
      sku: formData.sku,
    };

    if (isEditing && currentProduct) {
      setProducts(
        products.map((prod) =>
          prod.id === currentProduct.id ? { ...currentProduct, ...productData } : prod
        )
      );
    } else {
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        ...productData,
      };
      setProducts([...products, newProduct]);
    }

    setShowModal(false);
    setCurrentProduct(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((prod) => prod.id !== id));
    }
  };

  const handleStockAdjustment = (productId: number, adjustment: number) => {
    setProducts(
      products.map((prod) =>
        prod.id === productId
          ? { ...prod, stock: Math.max(0, prod.stock + adjustment) }
          : prod
      )
    );
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: "danger", label: "OUT OF STOCK" };
    if (stock < 10) return { color: "warning", label: "LOW STOCK" };
    return { color: "success", label: "IN STOCK" };
  };

  const filteredProducts = products.filter(
    (prod) =>
      prod.name.toLowerCase().includes(searchText.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchText.toLowerCase()) ||
      prod.sku?.toLowerCase().includes(searchText.toLowerCase())
  );

  const lowStockCount = products.filter((p) => p.stock < 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <IonPage className="admin-page">
      <AdminHeader title="Products Management" />

      <IonContent className="ion-padding">
        {/* Header Card */}
        <IonCard className="product-header-card">
          <IonCardHeader>
            <div className="product-header-content">
              <div>
                <IonCardTitle>Product Inventory</IonCardTitle>
                <IonText color="medium">
                  <p className="product-subtitle">
                    Manage products, pricing, and stock levels
                  </p>
                </IonText>
              </div>
              <IonButton onClick={openAddModal} color="primary">
                <IonIcon
                  slot="start"
                  icon={addOutline}
                  style={{ fontSize: "20px", color: "#ffffff", display: "block" }}
                />
                Add Product
              </IonButton>
            </div>
          </IonCardHeader>
        </IonCard>

        {/* Stats Cards */}
        <div className="product-stats">
          <IonCard className="stat-card">
            <IonCardContent>
              <div className="stat-icon-wrapper default">
                <IonIcon
                  icon={cubeOutline}
                  style={{ fontSize: "28px", color: "#1B2E4B", display: "block" }}
                />
              </div>
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">Total Products</div>
            </IonCardContent>
          </IonCard>

          <IonCard className="stat-card">
            <IonCardContent>
              <div className="stat-icon-wrapper warning">
                <IonIcon
                  icon={warningOutline}
                  style={{ fontSize: "28px", color: "#F39C12", display: "block" }}
                />
              </div>
              <div className="stat-value">{lowStockCount}</div>
              <div className="stat-label">Low Stock</div>
            </IonCardContent>
          </IonCard>

          <IonCard className="stat-card">
            <IonCardContent>
              <div className="stat-icon-wrapper danger">
                <IonIcon
                  icon={warningOutline}
                  style={{ fontSize: "28px", color: "#E74C3C", display: "block" }}
                />
              </div>
              <div className="stat-value">{outOfStockCount}</div>
              <div className="stat-label">Out of Stock</div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Search Bar and View Toggle */}
        <div className="product-controls">
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search by name, category, or SKU"
            className="product-search"
          />
          <IonSegment
            value={viewMode}
            onIonChange={(e) => setViewMode(e.detail.value as "grid" | "list")}
            className="view-toggle"
          >
            <IonSegmentButton value="grid">
              <IonIcon
                icon={gridOutline}
                style={{ fontSize: "20px", display: "block" }}
              />
            </IonSegmentButton>
            <IonSegmentButton value="list">
              <IonIcon
                icon={listOutline}
                style={{ fontSize: "20px", display: "block" }}
              />
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Product Display */}
        {filteredProducts.length === 0 ? (
          <IonCard>
            <IonCardContent>
              <div className="empty-state">
                <IonIcon
                  icon={cubeOutline}
                  style={{ fontSize: "64px", color: "#adb5bd", display: "block", margin: "0 auto 16px" }}
                />
                <div className="empty-state-title">No products found</div>
                <div className="empty-state-text">
                  {searchText
                    ? "Try adjusting your search terms"
                    : "Start by adding your first product"}
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        ) : (
          <div className={`product-${viewMode}`}>
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return viewMode === "grid" ? (
                // Grid View
                <IonCard key={product.id} className="product-card">
                  <IonCardHeader>
                    <div className="product-card-header">
                      <IonCardTitle className="product-name">
                        {product.name}
                      </IonCardTitle>
                      <IonBadge color={stockStatus.color} className="stock-badge">
                        {stockStatus.label}
                      </IonBadge>
                    </div>
                    {product.sku && (
                      <IonText color="medium">
                        <p className="product-sku">SKU: {product.sku}</p>
                      </IonText>
                    )}
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="product-info">
                      <div className="product-category">{product.category}</div>
                      {product.description && (
                        <p className="product-description">{product.description}</p>
                      )}
                      <div className="product-details">
                        <div className="product-price">${product.price.toFixed(2)}</div>
                        <div className="product-stock">
                          <span className="stock-label">Stock:</span>
                          <span className={`stock-value ${product.stock < 10 ? "low" : ""}`}>
                            {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="product-actions">
                      <div className="stock-controls">
                        <IonButton
                          size="small"
                          fill="outline"
                          onClick={() => handleStockAdjustment(product.id, -1)}
                          disabled={product.stock === 0}
                        >
                          -
                        </IonButton>
                        <IonButton
                          size="small"
                          fill="outline"
                          onClick={() => handleStockAdjustment(product.id, 1)}
                        >
                          +
                        </IonButton>
                      </div>
                      <div className="action-buttons">
                        <IonButton fill="clear" color="primary" onClick={() => openEditModal(product)}>
                          <IonIcon
                            slot="icon-only"
                            icon={createOutline}
                            style={{ fontSize: "20px", color: "#1B2E4B", display: "block" }}
                          />
                        </IonButton>
                        <IonButton fill="clear" color="danger" onClick={() => handleDelete(product.id)}>
                          <IonIcon
                            slot="icon-only"
                            icon={trashOutline}
                            style={{ fontSize: "20px", color: "#E74C3C", display: "block" }}
                          />
                        </IonButton>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ) : (
                // List View
                <IonCard key={product.id} className="product-list-item">
                  <IonCardContent>
                    <div className="product-list-content">
                      <div className="product-list-main">
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-list-meta">
                          <span className="product-category">{product.category}</span>
                          {product.sku && <span className="product-sku">SKU: {product.sku}</span>}
                        </div>
                      </div>
                      <div className="product-list-price">${product.price.toFixed(2)}</div>
                      <div className="product-list-stock">
                        <IonBadge color={stockStatus.color}>
                          {product.stock} units
                        </IonBadge>
                      </div>
                      <div className="product-list-actions">
                        <div className="stock-controls">
                          <IonButton
                            size="small"
                            fill="outline"
                            onClick={() => handleStockAdjustment(product.id, -1)}
                            disabled={product.stock === 0}
                          >
                            -
                          </IonButton>
                          <IonButton
                            size="small"
                            fill="outline"
                            onClick={() => handleStockAdjustment(product.id, 1)}
                          >
                            +
                          </IonButton>
                        </div>
                        <IonButton fill="clear" color="primary" onClick={() => openEditModal(product)}>
                          <IonIcon
                            slot="icon-only"
                            icon={createOutline}
                            style={{ fontSize: "20px", color: "#1B2E4B", display: "block" }}
                          />
                        </IonButton>
                        <IonButton fill="clear" color="danger" onClick={() => handleDelete(product.id)}>
                          <IonIcon
                            slot="icon-only"
                            icon={trashOutline}
                            style={{ fontSize: "20px", color: "#E74C3C", display: "block" }}
                          />
                        </IonButton>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              );
            })}
          </div>
        )}

        {/* Add/Edit Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{isEditing ? "Edit Product" : "Add Product"}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  <IonIcon
                    icon={closeOutline}
                    style={{ fontSize: "24px", color: "#ffffff", display: "block" }}
                  />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="product-form">
              <IonItem>
                <IonLabel position="stacked">Product Name *</IonLabel>
                <IonInput
                  value={formData.name}
                  onIonInput={(e) => setFormData({ ...formData, name: e.detail.value! })}
                  placeholder="Enter product name"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Category *</IonLabel>
                <IonSelect
                  value={formData.category}
                  onIonChange={(e) => setFormData({ ...formData, category: e.detail.value })}
                  placeholder="Select category"
                >
                  <IonSelectOption value="Supplements">Supplements</IonSelectOption>
                  <IonSelectOption value="Apparel">Apparel</IonSelectOption>
                  <IonSelectOption value="Accessories">Accessories</IonSelectOption>
                  <IonSelectOption value="Equipment">Equipment</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Price ($) *</IonLabel>
                <IonInput
                  type="number"
                  value={formData.price}
                  onIonInput={(e) => setFormData({ ...formData, price: e.detail.value! })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Stock Quantity *</IonLabel>
                <IonInput
                  type="number"
                  value={formData.stock}
                  onIonInput={(e) => setFormData({ ...formData, stock: e.detail.value! })}
                  placeholder="0"
                  min="0"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">SKU</IonLabel>
                <IonInput
                  value={formData.sku}
                  onIonInput={(e) => setFormData({ ...formData, sku: e.detail.value! })}
                  placeholder="e.g., SUP-001"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Description</IonLabel>
                <IonInput
                  value={formData.description}
                  onIonInput={(e) => setFormData({ ...formData, description: e.detail.value! })}
                  placeholder="Product description"
                />
              </IonItem>

              <div className="modal-actions">
                <IonButton
                  expand="block"
                  color="medium"
                  fill="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </IonButton>
                <IonButton expand="block" color="primary" onClick={handleSave}>
                  {isEditing ? "Update" : "Add"} Product
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Products;