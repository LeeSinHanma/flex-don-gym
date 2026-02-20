import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonText,
  IonCard,
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  useIonToast,
} from "@ionic/react";
import {
  addOutline,
  closeOutline,
  personAddOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import EmployeeHeader from "../../components/EmployeeComponents/Layout/Header";
import "./Member.css";

interface Member {
  id: string;
  name: string;
  membershipType: string;
  status: "active" | "expired" | "expiring-soon";
  expiryDate: string;
  email?: string;
  phone?: string;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  membershipType: "",
  startDate: "",
  expiryDate: "",
};

const MemberList: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const [searchText, setSearchText] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<typeof emptyForm>>({});

  useEffect(() => {
    const mockMembers: Member[] = [
      { id: "M001", name: "Juan Dela Cruz",    membershipType: "Premium Monthly", status: "active",        expiryDate: "2024-12-31", email: "juan@email.com",   phone: "+63 912 345 6789" },
      { id: "M002", name: "Maria Santos",       membershipType: "Basic Monthly",   status: "active",        expiryDate: "2024-11-30", email: "maria@email.com",  phone: "+63 917 234 5678" },
      { id: "M003", name: "Pedro Rodriguez",    membershipType: "Premium Yearly",  status: "expiring-soon", expiryDate: "2024-10-15", email: "pedro@email.com",  phone: "+63 918 345 6789" },
      { id: "M004", name: "Ana Garcia",         membershipType: "Basic Monthly",   status: "expired",       expiryDate: "2024-09-30", email: "ana@email.com",    phone: "+63 919 456 7890" },
      { id: "M005", name: "Carlos Martinez",    membershipType: "Premium Monthly", status: "active",        expiryDate: "2024-12-25", email: "carlos@email.com", phone: "+63 920 567 8901" },
    ];
    setMembers(mockMembers);
    setFilteredMembers(mockMembers);
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchText.toLowerCase()) ||
          member.id.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchText, members]);

  const handleMemberClick = (memberId: string) => {
    history.push(`/employee/member/${memberId}`);
  };

  // ── Form validation ──
  const validate = () => {
    const errors: Partial<typeof emptyForm> = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim())  errors.lastName  = "Last name is required";
    if (!formData.email.trim())     errors.email     = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email address";
    if (!formData.phone.trim())     errors.phone     = "Phone is required";
    if (!formData.membershipType)   errors.membershipType = "Select a membership type";
    if (!formData.startDate)        errors.startDate  = "Start date is required";
    if (!formData.expiryDate)       errors.expiryDate = "Expiry date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Determine status from expiry ──
  const computeStatus = (expiry: string): Member["status"] => {
    const now = new Date();
    const exp = new Date(expiry);
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0)  return "expired";
    if (diffDays <= 7) return "expiring-soon";
    return "active";
  };

  const handleAddMember = () => {
    if (!validate()) return;

    const newId = `M${String(members.length + 1).padStart(3, "0")}`;
    const newMember: Member = {
      id: newId,
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      membershipType: formData.membershipType,
      status: computeStatus(formData.expiryDate),
      expiryDate: formData.expiryDate,
      email: formData.email,
      phone: formData.phone,
    };

    setMembers((prev) => [newMember, ...prev]);
    setShowModal(false);
    setFormData(emptyForm);
    setFormErrors({});
    present({ message: `Member ${newMember.name} added successfully!`, duration: 2500, color: "success", position: "top" });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":        return "status-badge-active";
      case "expiring-soon": return "status-badge-warning";
      case "expired":       return "status-badge-expired";
      default:              return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":        return "Active";
      case "expiring-soon": return "Expiring Soon";
      case "expired":       return "Expired";
      default:              return status;
    }
  };

  return (
    <IonPage>
      <EmployeeHeader title="Members" />
      <IonContent fullscreen className="member-list-content">
        <div className="member-list-container">

          {/* Top bar — search + add button */}
          <div className="member-topbar">
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value!)}
              placeholder="Search by name or ID"
              className="member-searchbar"
              animated={true}
            />
            <IonButton className="add-member-btn" onClick={() => setShowModal(true)}>
              <IonIcon
                slot="start"
                icon={addOutline}
                style={{ fontSize: "20px", color: "#ffffff", display: "block" }}
              />
              Add Member
            </IonButton>
          </div>

          {/* Stats strip */}
          <div className="member-stats-strip">
            <div className="stat-pill">
              <span className="stat-pill-value">{members.length}</span>
              <span className="stat-pill-label">Total</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-value active-count">{members.filter(m => m.status === "active").length}</span>
              <span className="stat-pill-label">Active</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-value warning-count">{members.filter(m => m.status === "expiring-soon").length}</span>
              <span className="stat-pill-label">Expiring</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-value expired-count">{members.filter(m => m.status === "expired").length}</span>
              <span className="stat-pill-label">Expired</span>
            </div>
          </div>

          {/* Member List */}
          {filteredMembers.length > 0 ? (
            <IonCard className="members-card">
              <IonList className="members-list">
                {filteredMembers.map((member) => (
                  <IonItem
                    key={member.id}
                    button
                    onClick={() => handleMemberClick(member.id)}
                    className="member-item"
                    lines="full"
                  >
                    {/* Avatar */}
                    <div className="member-avatar" slot="start">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <IonLabel>
                      <h2 className="member-item-name">{member.name}</h2>
                      <p className="member-item-type">{member.membershipType}</p>
                      <p className="member-item-id">ID: {member.id} · Exp: {member.expiryDate}</p>
                    </IonLabel>
                    <IonBadge
                      slot="end"
                      className={`status-badge ${getStatusBadgeClass(member.status)}`}
                    >
                      {getStatusText(member.status)}
                    </IonBadge>
                  </IonItem>
                ))}
              </IonList>
            </IonCard>
          ) : (
            <IonCard className="empty-members-card">
              <IonCardContent>
                <div className="empty-members-state">
                  <IonIcon
                    icon={personAddOutline}
                    style={{ fontSize: "56px", color: "#9BADB7", display: "block", margin: "0 auto 12px" }}
                  />
                  <p className="empty-members-title">
                    {searchText ? "No members found" : "No members yet"}
                  </p>
                  <p className="empty-members-text">
                    {searchText
                      ? "Try adjusting your search terms"
                      : 'Tap "Add Member" to register the first member'}
                  </p>
                </div>
              </IonCardContent>
            </IonCard>
          )}
        </div>

        {/* ── Add Member Modal ── */}
        <IonModal isOpen={showModal} onDidDismiss={handleCloseModal}>
          <IonHeader>
            <IonToolbar className="add-member-toolbar">
              <IonTitle className="add-member-toolbar-title">Add New Member</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={handleCloseModal}>
                  <IonIcon
                    icon={closeOutline}
                    style={{ fontSize: "22px", color: "#ffffff", display: "block" }}
                  />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="add-member-modal-content">
            <div className="add-member-form">

              {/* Personal Info */}
              <div className="form-section-label">Personal Information</div>

              <div className="form-row">
                <div className="form-col">
                  <IonItem className={`form-item ${formErrors.firstName ? "form-item-error" : ""}`}>
                    <IonLabel position="stacked">First Name *</IonLabel>
                    <IonInput
                      value={formData.firstName}
                      onIonInput={(e) => setFormData({ ...formData, firstName: e.detail.value! })}
                      placeholder="Juan"
                    />
                  </IonItem>
                  {formErrors.firstName && <p className="field-error">{formErrors.firstName}</p>}
                </div>
                <div className="form-col">
                  <IonItem className={`form-item ${formErrors.lastName ? "form-item-error" : ""}`}>
                    <IonLabel position="stacked">Last Name *</IonLabel>
                    <IonInput
                      value={formData.lastName}
                      onIonInput={(e) => setFormData({ ...formData, lastName: e.detail.value! })}
                      placeholder="Dela Cruz"
                    />
                  </IonItem>
                  {formErrors.lastName && <p className="field-error">{formErrors.lastName}</p>}
                </div>
              </div>

              <IonItem className={`form-item ${formErrors.email ? "form-item-error" : ""}`}>
                <IonLabel position="stacked">Email Address *</IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonInput={(e) => setFormData({ ...formData, email: e.detail.value! })}
                  placeholder="juan@email.com"
                />
              </IonItem>
              {formErrors.email && <p className="field-error">{formErrors.email}</p>}

              <IonItem className={`form-item ${formErrors.phone ? "form-item-error" : ""}`}>
                <IonLabel position="stacked">Phone Number *</IonLabel>
                <IonInput
                  type="tel"
                  value={formData.phone}
                  onIonInput={(e) => setFormData({ ...formData, phone: e.detail.value! })}
                  placeholder="+63 912 345 6789"
                />
              </IonItem>
              {formErrors.phone && <p className="field-error">{formErrors.phone}</p>}

              {/* Membership Info */}
              <div className="form-section-label" style={{ marginTop: "20px" }}>Membership Details</div>

              <IonItem className={`form-item ${formErrors.membershipType ? "form-item-error" : ""}`}>
                <IonLabel position="stacked">Membership Type *</IonLabel>
                <IonSelect
                  value={formData.membershipType}
                  onIonChange={(e) => setFormData({ ...formData, membershipType: e.detail.value })}
                  placeholder="Select type"
                >
                  <IonSelectOption value="Basic Daily">Basic Daily</IonSelectOption>
                  <IonSelectOption value="Basic Weekly">Basic Weekly</IonSelectOption>
                  <IonSelectOption value="Basic Monthly">Basic Monthly</IonSelectOption>
                  <IonSelectOption value="Premium Monthly">Premium Monthly</IonSelectOption>
                  <IonSelectOption value="Premium Quarterly">Premium Quarterly</IonSelectOption>
                  <IonSelectOption value="Premium Yearly">Premium Yearly</IonSelectOption>
                </IonSelect>
              </IonItem>
              {formErrors.membershipType && <p className="field-error">{formErrors.membershipType}</p>}

              <div className="form-row">
                <div className="form-col">
                  <IonItem className={`form-item ${formErrors.startDate ? "form-item-error" : ""}`}>
                    <IonLabel position="stacked">Start Date *</IonLabel>
                    <IonInput
                      type="date"
                      value={formData.startDate}
                      onIonInput={(e) => setFormData({ ...formData, startDate: e.detail.value! })}
                    />
                  </IonItem>
                  {formErrors.startDate && <p className="field-error">{formErrors.startDate}</p>}
                </div>
                <div className="form-col">
                  <IonItem className={`form-item ${formErrors.expiryDate ? "form-item-error" : ""}`}>
                    <IonLabel position="stacked">Expiry Date *</IonLabel>
                    <IonInput
                      type="date"
                      value={formData.expiryDate}
                      onIonInput={(e) => setFormData({ ...formData, expiryDate: e.detail.value! })}
                    />
                  </IonItem>
                  {formErrors.expiryDate && <p className="field-error">{formErrors.expiryDate}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="modal-form-actions">
                <IonButton expand="block" fill="outline" color="medium" onClick={handleCloseModal}>
                  Cancel
                </IonButton>
                <IonButton expand="block" color="primary" onClick={handleAddMember}>
                  <IonIcon
                    slot="start"
                    icon={personAddOutline}
                    style={{ fontSize: "18px", color: "#ffffff", display: "block" }}
                  />
                  Add Member
                </IonButton>
              </div>

            </div>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default MemberList;