import React from 'react';
import { IonCard, IonCardContent, IonBadge, IonButton, IonIcon, IonText } from '@ionic/react';
import { createOutline, trashOutline, addOutline, removeOutline } from 'ionicons/icons';
import './ProductCard.css';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  sku?: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onStockAdjust?: (adjustment: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onStockAdjust }) => {
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: "danger", label: "OUT OF STOCK" };
    if (stock < 10) return { color: "warning", label: "LOW STOCK" };
    return { color: "success", label: "IN STOCK" };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <IonCard className="product-card">
      <IonCardContent>
        <div className="product-card-header">
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">{product.category}</p>
            {product.sku && <p className="product-sku">SKU: {product.sku}</p>}
          </div>
          <IonBadge color={stockStatus.color} className="stock-badge">
            {stockStatus.label}
          </IonBadge>
        </div>

        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        <div className="product-details">
          <div className="product-price">
            <IonText color="primary">
              <strong>₱{product.price.toFixed(2)}</strong>
            </IonText>
          </div>
          <div className="product-stock">
            <IonText color="medium">Stock: {product.stock}</IonText>
          </div>
        </div>

        {onStockAdjust && (
          <div className="stock-controls">
            <IonButton
              size="small"
              fill="outline"
              color="danger"
              onClick={() => onStockAdjust(-1)}
              disabled={product.stock === 0}
            >
              <IonIcon icon={removeOutline} slot="icon-only" />
            </IonButton>
            <IonText className="stock-value">{product.stock}</IonText>
            <IonButton
              size="small"
              fill="outline"
              color="success"
              onClick={() => onStockAdjust(1)}
            >
              <IonIcon icon={addOutline} slot="icon-only" />
            </IonButton>
          </div>
        )}

        <div className="product-actions">
          <IonButton fill="clear" color="primary" onClick={onEdit}>
            <IonIcon icon={createOutline} slot="start" />
            Edit
          </IonButton>
          <IonButton fill="clear" color="danger" onClick={onDelete}>
            <IonIcon icon={trashOutline} slot="start" />
            Delete
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ProductCard;
