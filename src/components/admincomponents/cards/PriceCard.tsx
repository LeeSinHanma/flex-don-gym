import React from 'react';
import { IonItem, IonLabel, IonInput, IonToggle, IonButton, IonIcon, IonBadge, IonText } from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import './PriceCard.css';

interface MembershipPrice {
  id: number;
  type: string;
  price: number;
  description: string;
  duration: string;
  tierType: string;
  promoExpiry?: string;
  isActive: boolean;
}

interface PriceCardProps {
  price: MembershipPrice;
  onPriceChange: (value: string) => void;
  onToggleActive: (active: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({ 
  price, 
  onPriceChange, 
  onToggleActive, 
  onEdit, 
  onDelete 
}) => {
  const getPromoStatus = (promoExpiry?: string) => {
    if (!promoExpiry) return null;
    const today = new Date();
    const expiry = new Date(promoExpiry);
    const diffTime = expiry.getTime() - today.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days < 0) return { color: "danger", label: "EXPIRED" };
    if (days <= 7) return { color: "warning", label: `EXPIRES IN ${days}D` };
    return { color: "success", label: `${days} DAYS LEFT` };
  };

  const promoStatus = getPromoStatus(price.promoExpiry);

  return (
    <IonItem className="price-card-item">
      <IonLabel>
        <div className="price-card-header">
          <div className="price-info">
            <h3 className="price-type">{price.type}</h3>
            <p className="price-description">{price.description}</p>
            <p className="price-duration">Duration: {price.duration}</p>
            {promoStatus && (
              <IonBadge color={promoStatus.color} className="promo-badge">
                {promoStatus.label}
              </IonBadge>
            )}
          </div>
          <div className="price-controls">
            <div className="price-input-wrapper">
              <IonText className="currency-symbol">₱</IonText>
              <IonInput
                type="number"
                value={price.price}
                onIonChange={(e) => onPriceChange(e.detail.value!)}
                className="price-input"
              />
            </div>
            <IonToggle
              checked={price.isActive}
              onIonChange={(e) => onToggleActive(e.detail.checked)}
              className="active-toggle"
            />
          </div>
        </div>
      </IonLabel>
      <div className="price-actions" slot="end">
        <IonButton fill="clear" size="small" onClick={onEdit}>
          <IonIcon icon={createOutline} slot="icon-only" />
        </IonButton>
        <IonButton fill="clear" size="small" color="danger" onClick={onDelete}>
          <IonIcon icon={trashOutline} slot="icon-only" />
        </IonButton>
      </div>
    </IonItem>
  );
};

export default PriceCard;
