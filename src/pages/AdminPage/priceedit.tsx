import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonIcon,
  IonBadge,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonToggle,
  useIonToast,
} from "@ionic/react";
import AdminHeader from "../../components/admincomponents/Layout/header";
import {
  saveOutline,
  refreshOutline,
  addOutline,
  createOutline,
  trashOutline,
  closeOutline,
  pricetagOutline,
  calendarOutline,
  warningOutline,
} from "ionicons/icons";
import "./common.css";
import "./priceedit.css";

type TierType = "standard" | "promo";

interface MembershipPrice {
  id: number;
  type: string;
  price: number;
  description: string;
  duration: string;
  tierType: TierType;
  promoExpiry?: string; // ISO date string
  isActive: boolean;
}

const defaultPrices: MembershipPrice[] = [
  { id: 1, type: "Daily",     price: 15,   description: "Single day access",              duration: "1 Day",   tierType: "standard", isActive: true },
  { id: 2, type: "Weekly",    price: 50,   description: "7 days of unlimited access",     duration: "7 Days",  tierType: "standard", isActive: true },
  { id: 3, type: "Monthly",   price: 150,  description: "30 days of unlimited access",    duration: "30 Days", tierType: "standard", isActive: true },
  { id: 4, type: "Quarterly", price: 400,  description: "3 months of unlimited access",   duration: "90 Days", tierType: "standard", isActive: true },
  { id: 5, type: "Yearly",    price: 1200, description: "12 months of unlimited access",  duration: "365 Days",tierType: "standard", isActive: true },
];

const emptyForm = {
  type: "",
  price: "",
  description: "",
  duration: "",
  tierType: "standard" as TierType,
  promoExpiry: "",
  isActive: true,
};

const PriceEdit: React.FC = () => {
  const [present] = useIonToast();
  const [prices, setPrices] = useState<MembershipPrice[]>(defaultPrices);
  const [hasChanges, setHasChanges] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  // --- helpers ---
  const isExpired = (expiry?: string) => {
    if (!expiry) return false;
    return new Date(expiry) < new Date();
  };

  const daysUntilExpiry = (expiry?: string) => {
    if (!expiry) return null;
    const diff = new Date(expiry).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getExpiryBadge = (membership: MembershipPrice) => {
    if (membership.tierType !== "promo" || !membership.promoExpiry) return null;
    const days = daysUntilExpiry(membership.promoExpiry);
    if (days === null) return null;
    if (days < 0)  return { color: "danger",  label: "EXPIRED" };
    if (days <= 7) return { color: "warning", label: `EXPIRES IN ${days}D` };
    return { color: "success", label: `${days} DAYS LEFT` };
  };

  // --- price inline edit ---
  const handlePriceChange = (id: number, val: string) => {
    setPrices(prices.map(p => p.id === id ? { ...p, price: parseFloat(val) || 0 } : p));
    setHasChanges(true);
  };

  const handleToggleActive = (id: number, active: boolean) => {
    setPrices(prices.map(p => p.id === id ? { ...p, isActive: active } : p));
    setHasChanges(true);
  };

  // --- modal ---
  const openAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (m: MembershipPrice) => {
    setIsEditing(true);
    setCurrentId(m.id);
    setFormData({
      type: m.type,
      price: m.price.toString(),
      description: m.description,
      duration: m.duration,
      tierType: m.tierType,
      promoExpiry: m.promoExpiry || "",
      isActive: m.isActive,
    });
    setShowModal(true);
  };

  const handleSaveModal = () => {
    if (!formData.type || !formData.price || !formData.duration) {
      present({ message: "Please fill in all required fields", duration: 2000, color: "danger", position: "top" });
      return;
    }
    if (formData.tierType === "promo" && !formData.promoExpiry) {
      present({ message: "Promo tiers require an expiry date", duration: 2000, color: "danger", position: "top" });
      return;
    }

    if (isEditing && currentId !== null) {
      setPrices(prices.map(p =>
        p.id === currentId
          ? { ...p, ...formData, price: parseFloat(formData.price) || 0, promoExpiry: formData.tierType === "promo" ? formData.promoExpiry : undefined }
          : p
      ));
    } else {
      const newItem: MembershipPrice = {
        id: Math.max(...prices.map(p => p.id), 0) + 1,
        type: formData.type,
        price: parseFloat(formData.price) || 0,
        description: formData.description,
        duration: formData.duration,
        tierType: formData.tierType,
        promoExpiry: formData.tierType === "promo" ? formData.promoExpiry : undefined,
        isActive: formData.isActive,
      };
      setPrices([...prices, newItem]);
    }

    setHasChanges(true);
    setShowModal(false);
    present({ message: isEditing ? "Tier updated!" : "New tier added!", duration: 2000, color: "success", position: "top" });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this pricing tier?")) {
      setPrices(prices.filter(p => p.id !== id));
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    console.log("Saving prices:", prices);
    present({ message: "Prices updated successfully!", duration: 2000, position: "top", color: "success" });
    setHasChanges(false);
  };

  const handleReset = () => {
    setPrices(defaultPrices);
    setHasChanges(false);
    present({ message: "Prices reset to default values", duration: 2000, position: "top", color: "medium" });
  };

  const standardPrices = prices.filter(p => p.tierType === "standard");
  const promoPrices    = prices.filter(p => p.tierType === "promo");

  return (
    <IonPage className="admin-page">
      <AdminHeader title="Membership Pricing" />

      <IonContent className="ion-padding">

        {/* Page Header */}
        <IonCard className="pricing-header-card">
          <IonCardHeader>
            <div className="pricing-header-content">
              <div>
                <IonCardTitle>Membership Pricing Tiers</IonCardTitle>
                <IonText color="medium">
                  <p className="pricing-subtitle">Manage standard and promo pricing</p>
                </IonText>
              </div>
              <IonButton onClick={openAdd} color="primary">
                <IonIcon slot="start" icon={addOutline} style={{ fontSize: "20px", color: "#ffffff", display: "block" }} />
                Add Tier
              </IonButton>
            </div>
          </IonCardHeader>
        </IonCard>

        {/* ── STANDARD TIERS ── */}
        <div className="section-label">
          <IonIcon icon={pricetagOutline} style={{ fontSize: "18px", color: "#1B2E4B", display: "block" }} />
          <span>Standard Tiers</span>
        </div>

        <IonGrid>
          <IonRow>
            {standardPrices.map((membership) => (
              <IonCol key={membership.id} size="12" sizeMd="6" sizeLg="4">
                <IonCard className={`pricing-card ${!membership.isActive ? "inactive-card" : ""}`}>
                  <IonCardHeader className="pricing-card-header">
                    <div className="pricing-card-header-top">
                      <div className="pricing-type-badge">{membership.duration}</div>
                      <div className="card-header-actions">
                        <IonButton fill="clear" onClick={() => openEdit(membership)}>
                          <IonIcon icon={createOutline} style={{ fontSize: "18px", color: "#ffffff", display: "block" }} />
                        </IonButton>
                        <IonButton fill="clear" onClick={() => handleDelete(membership.id)}>
                          <IonIcon icon={trashOutline} style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", display: "block" }} />
                        </IonButton>
                      </div>
                    </div>
                    <IonCardTitle className="pricing-card-title">{membership.type}</IonCardTitle>
                    <p className="pricing-description">{membership.description}</p>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="active-toggle-row">
                      <span className="active-label">Active</span>
                      <IonToggle
                        checked={membership.isActive}
                        onIonChange={(e) => handleToggleActive(membership.id, e.detail.checked)}
                      />
                    </div>
                    <IonItem lines="none" className="price-input-item">
                      <IonLabel position="stacked" className="price-label">Price ($)</IonLabel>
                      <IonInput
                        type="number"
                        value={membership.price}
                        onIonInput={(e) => handlePriceChange(membership.id, e.detail.value!)}
                        className="price-input"
                        min="0"
                        step="0.01"
                      />
                    </IonItem>
                    <div className="price-display">${membership.price.toFixed(2)}</div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* ── PROMO TIERS ── */}
        <div className="section-label promo-label">
          <IonIcon icon={calendarOutline} style={{ fontSize: "18px", color: "#E74C3C", display: "block" }} />
          <span>Promo Tiers</span>
          {promoPrices.filter(p => isExpired(p.promoExpiry)).length > 0 && (
            <IonBadge color="danger" className="expired-badge">
              {promoPrices.filter(p => isExpired(p.promoExpiry)).length} Expired
            </IonBadge>
          )}
        </div>

        {promoPrices.length === 0 ? (
          <IonCard className="empty-promo-card">
            <IonCardContent>
              <div className="empty-promo">
                <IonIcon icon={pricetagOutline} style={{ fontSize: "48px", color: "#adb5bd", display: "block", margin: "0 auto 12px" }} />
                <p className="empty-promo-text">No promo tiers yet</p>
                <p className="empty-promo-sub">Click "Add Tier" and select Promo type to create one</p>
              </div>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonGrid>
            <IonRow>
              {promoPrices.map((membership) => {
                const badge = getExpiryBadge(membership);
                const expired = isExpired(membership.promoExpiry);
                return (
                  <IonCol key={membership.id} size="12" sizeMd="6" sizeLg="4">
                    <IonCard className={`pricing-card promo-card ${expired ? "expired-card" : ""} ${!membership.isActive ? "inactive-card" : ""}`}>
                      <IonCardHeader className="pricing-card-header promo-header">
                        <div className="pricing-card-header-top">
                          <div className="pricing-type-badge">{membership.duration}</div>
                          <div className="card-header-actions">
                            <IonButton fill="clear" onClick={() => openEdit(membership)}>
                              <IonIcon icon={createOutline} style={{ fontSize: "18px", color: "#ffffff", display: "block" }} />
                            </IonButton>
                            <IonButton fill="clear" onClick={() => handleDelete(membership.id)}>
                              <IonIcon icon={trashOutline} style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", display: "block" }} />
                            </IonButton>
                          </div>
                        </div>
                        <IonCardTitle className="pricing-card-title">{membership.type}</IonCardTitle>
                        <p className="pricing-description">{membership.description}</p>
                        {badge && (
                          <div className="expiry-badge-row">
                            <IonBadge color={badge.color} className="expiry-badge">
                              {expired && <IonIcon icon={warningOutline} style={{ fontSize: "12px", marginRight: "4px", display: "inline", verticalAlign: "middle" }} />}
                              {badge.label}
                            </IonBadge>
                            {membership.promoExpiry && (
                              <span className="expiry-date">
                                {new Date(membership.promoExpiry).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </IonCardHeader>
                      <IonCardContent>
                        <div className="active-toggle-row">
                          <span className="active-label">Active</span>
                          <IonToggle
                            checked={membership.isActive}
                            onIonChange={(e) => handleToggleActive(membership.id, e.detail.checked)}
                          />
                        </div>
                        {expired && (
                          <div className="expired-warning">
                            <IonIcon icon={warningOutline} style={{ fontSize: "14px", color: "#E74C3C", display: "block" }} />
                            <span>This promo has expired. Update the expiry date or delete it.</span>
                          </div>
                        )}
                        <IonItem lines="none" className="price-input-item">
                          <IonLabel position="stacked" className="price-label">Price ($)</IonLabel>
                          <IonInput
                            type="number"
                            value={membership.price}
                            onIonInput={(e) => handlePriceChange(membership.id, e.detail.value!)}
                            className="price-input"
                            min="0"
                            step="0.01"
                          />
                        </IonItem>
                        <div className="price-display">${membership.price.toFixed(2)}</div>
                        {expired && (
                          <IonButton expand="block" color="warning" fill="outline" className="update-expiry-btn" onClick={() => openEdit(membership)}>
                            Update Expiry Date
                          </IonButton>
                        )}
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                );
              })}
            </IonRow>
          </IonGrid>
        )}

        {/* Action Buttons */}
        <div className="pricing-actions">
          <IonCard className="actions-card">
            <IonCardContent>
              <div className="action-buttons">
                <IonButton expand="block" color="primary" onClick={handleSave} disabled={!hasChanges}>
                  <IonIcon slot="start" icon={saveOutline} style={{ fontSize: "20px", color: "#ffffff", display: "block" }} />
                  Save Changes
                </IonButton>
                <IonButton expand="block" color="medium" fill="outline" onClick={handleReset}>
                  <IonIcon slot="start" icon={refreshOutline} style={{ fontSize: "20px", display: "block" }} />
                  Reset to Default
                </IonButton>
              </div>
              {hasChanges && <p className="unsaved-changes-text">You have unsaved changes</p>}
            </IonCardContent>
          </IonCard>
        </div>

        {/* Pricing Summary */}
        <IonCard className="summary-card">
          <IonCardHeader>
            <IonCardTitle>Pricing Summary</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="summary-list">
              {prices.map((membership) => {
                const expired = isExpired(membership.promoExpiry);
                return (
                  <div key={membership.id} className={`summary-item ${expired ? "summary-expired" : ""}`}>
                    <div className="summary-left">
                      <span className="summary-type">{membership.type}</span>
                      {membership.tierType === "promo" && (
                        <IonBadge color={expired ? "danger" : "tertiary"} className="summary-promo-badge">
                          {expired ? "EXPIRED" : "PROMO"}
                        </IonBadge>
                      )}
                      {!membership.isActive && (
                        <IonBadge color="medium" className="summary-promo-badge">INACTIVE</IonBadge>
                      )}
                    </div>
                    <span className="summary-price">${membership.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="summary-total">
              <span className="total-label">Active Revenue Potential:</span>
              <span className="total-value">
                ${prices.filter(p => p.isActive && !isExpired(p.promoExpiry)).reduce((sum, p) => sum + p.price, 0).toFixed(2)}
              </span>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Add / Edit Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{isEditing ? "Edit Tier" : "Add Tier"}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  <IonIcon icon={closeOutline} style={{ fontSize: "24px", color: "#ffffff", display: "block" }} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="tier-form">

              <IonItem className="form-item">
                <IonLabel position="stacked">Tier Type *</IonLabel>
                <IonSelect
                  value={formData.tierType}
                  onIonChange={(e) => setFormData({ ...formData, tierType: e.detail.value, promoExpiry: "" })}
                >
                  <IonSelectOption value="standard">Standard</IonSelectOption>
                  <IonSelectOption value="promo">Promo</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem className="form-item">
                <IonLabel position="stacked">Name * (e.g. "Summer Promo")</IonLabel>
                <IonInput
                  value={formData.type}
                  onIonInput={(e) => setFormData({ ...formData, type: e.detail.value! })}
                  placeholder="Enter tier name"
                />
              </IonItem>

              <IonItem className="form-item">
                <IonLabel position="stacked">Duration * (e.g. "30 Days")</IonLabel>
                <IonInput
                  value={formData.duration}
                  onIonInput={(e) => setFormData({ ...formData, duration: e.detail.value! })}
                  placeholder="e.g. 30 Days"
                />
              </IonItem>

              <IonItem className="form-item">
                <IonLabel position="stacked">Price ($) *</IonLabel>
                <IonInput
                  type="number"
                  value={formData.price}
                  onIonInput={(e) => setFormData({ ...formData, price: e.detail.value! })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </IonItem>

              <IonItem className="form-item">
                <IonLabel position="stacked">Description</IonLabel>
                <IonInput
                  value={formData.description}
                  onIonInput={(e) => setFormData({ ...formData, description: e.detail.value! })}
                  placeholder="Short description"
                />
              </IonItem>

              {formData.tierType === "promo" && (
                <IonItem className="form-item promo-expiry-item">
                  <IonLabel position="stacked">Promo Expiry Date *</IonLabel>
                  <IonInput
                    type="date"
                    value={formData.promoExpiry}
                    onIonInput={(e) => setFormData({ ...formData, promoExpiry: e.detail.value! })}
                  />
                </IonItem>
              )}

              <IonItem className="form-item" lines="none">
                <IonLabel>Active</IonLabel>
                <IonToggle
                  checked={formData.isActive}
                  onIonChange={(e) => setFormData({ ...formData, isActive: e.detail.checked })}
                />
              </IonItem>

              <div className="modal-actions">
                <IonButton expand="block" color="medium" fill="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </IonButton>
                <IonButton expand="block" color="primary" onClick={handleSaveModal}>
                  {isEditing ? "Update" : "Add"} Tier
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default PriceEdit;