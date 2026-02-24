import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonModal,
  IonIcon,
  IonButtons,
  IonSearchbar,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import AdminHeader from "../../../components/admincomponents/Layout/header";
import { ProductCard } from "../../../components/admincomponents/cards";
import { ProductForm } from "../../../components/admincomponents/forms";
import { StatCard, EmptyStateCard } from "../../../components/Reusable/cards";
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
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <StatCard
                icon={cubeOutline}
                value={products.length}
                label="Total Products"
                type="primary"
              />
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <StatCard
                icon={warningOutline}
                value={lowStockCount}
                label="Low Stock"
                type="warning"
              />
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <StatCard
                icon={warningOutline}
                value={outOfStockCount}
                label="Out of Stock"
                type="primary"
                iconColor="#E74C3C"
              />
            </IonCol>
          </IonRow>
        </IonGrid>

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
          <EmptyStateCard
            icon={cubeOutline}
            message={
              searchText
                ? "No products found. Try adjusting your search terms."
                : "No products yet. Start by adding your first product."
            }
          />
        ) : (
          <div className={`product-${viewMode}`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => openEditModal(product)}
                onDelete={() => handleDelete(product.id)}
                onStockAdjust={(adjustment: number) => handleStockAdjustment(product.id, adjustment)}
              />
            ))}
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
            <ProductForm formData={formData} onChange={setFormData} />

            <div className="modal-actions" style={{ padding: '16px' }}>
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
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Products;