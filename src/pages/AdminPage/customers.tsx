import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonText,
  IonBadge,
  IonAvatar,
} from "@ionic/react";
import {
  addOutline,
  closeOutline,
  personOutline,
  trashOutline,
  createOutline,
  qrCodeOutline,
  searchOutline,
  callOutline,
  mailOutline,
} from "ionicons/icons";
import AdminHeader from "../../components/admincomponents/Layout/header";
import "./customer.css";
import "./common.css";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  status: "Active" | "Inactive" | "Expired";
  joinDate: string;
  expiryDate: string;
}

const Customers: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membershipType: "monthly",
    joinDate: new Date().toISOString().split("T")[0],
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      membershipType: "monthly",
      joinDate: new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  // Mock data - replace with actual data from your backend
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      membershipType: "Annual",
      status: "Active",
      joinDate: "2024-01-15",
      expiryDate: "2025-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1234567891",
      membershipType: "Monthly",
      status: "Active",
      joinDate: "2024-03-10",
      expiryDate: "2024-04-10",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.j@example.com",
      phone: "+1234567892",
      membershipType: "Quarterly",
      status: "Expired",
      joinDate: "2023-10-01",
      expiryDate: "2024-01-01",
    },
  ]);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchText.toLowerCase()) ||
      member.email.toLowerCase().includes(searchText.toLowerCase()) ||
      member.phone.includes(searchText)
  );

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipType: member.membershipType.toLowerCase(),
      joinDate: member.joinDate,
    });
    setShowModal(true);
  };

  const handleDeleteMember = (id: number) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const handleSaveMember = () => {
    if (editingMember) {
      // Update existing member
      setMembers(
        members.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                ...formData,
                membershipType:
                  formData.membershipType.charAt(0).toUpperCase() +
                  formData.membershipType.slice(1),
              }
            : m
        )
      );
    } else {
      // Add new member
      const newMember: Member = {
        id: Math.max(...members.map((m) => m.id), 0) + 1,
        ...formData,
        membershipType:
          formData.membershipType.charAt(0).toUpperCase() +
          formData.membershipType.slice(1),
        status: "Active",
        expiryDate: calculateExpiryDate(
          formData.joinDate,
          formData.membershipType
        ),
      };
      setMembers([...members, newMember]);
    }
    setShowModal(false);
  };

  const calculateExpiryDate = (joinDate: string, type: string): string => {
    const date = new Date(joinDate);
    switch (type.toLowerCase()) {
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "quarterly":
        date.setMonth(date.getMonth() + 3);
        break;
      case "annual":
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date.toISOString().split("T")[0];
  };

  const handleGenerateQR = (member: Member) => {
    setSelectedMember(member);
    setShowQRModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Expired":
        return "danger";
      case "Inactive":
        return "warning";
      default:
        return "medium";
    }
  };

  return (
    <IonPage>
      <AdminHeader title="Members Management" />
      <IonContent className="customers-content">
        <IonCard className="employee-header-card">
          <div className="employee-header-content">
            <div>
              <IonCardTitle>Members</IonCardTitle>
              <IonText color="medium">
                <p className="employee-subtitle">
                  Manage Member accounts, Expiry, and Membership types
                </p>
              </IonText>
            </div>
            <IonButton onClick={openAddModal} color="primary">
              <IonIcon slot="start" icon={addOutline} />
              Add Members
            </IonButton>
          </div>
        </IonCard>

        <div className="customers-container">
          {/* Search Bar */}
          <div className="search-section">
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value!)}
              placeholder="Search members by name, email, or phone"
              className="custom-searchbar"
            />
          </div>

          {/* Members List */}
          <IonList className="members-list">
            {filteredMembers.length === 0 ? (
              <IonCard className="empty-state-card">
                <IonCardContent>
                  <div className="empty-state">
                    <IonIcon icon={searchOutline} className="empty-state-icon" />
                    <h3>No members found</h3>
                    <p>Try adjusting your search or add a new member</p>
                  </div>
                </IonCardContent>
              </IonCard>
            ) : (
              filteredMembers.map((member) => (
                <IonItem key={member.id} className="member-item">
                  <IonAvatar slot="start" className="member-avatar">
                    <IonIcon icon={personOutline} />
                  </IonAvatar>
                  <IonLabel>
                    <h2 className="member-name">{member.name}</h2>
                    <p className="member-info">
                      <IonIcon icon={mailOutline} className="info-icon" />
                      {member.email}
                    </p>
                    <p className="member-info">
                      <IonIcon icon={callOutline} className="info-icon" />
                      {member.phone}
                    </p>
                    <div className="member-meta">
                      <IonBadge color={getStatusColor(member.status)}>
                        {member.status}
                      </IonBadge>
                      <span className="membership-type">
                        {member.membershipType}
                      </span>
                      <span className="expiry-date">
                        Expires: {member.expiryDate}
                      </span>
                    </div>
                  </IonLabel>
                  <div className="member-actions" slot="end">
                    <IonButton
                      fill="clear"
                      color="primary"
                      onClick={() => handleGenerateQR(member)}
                      title="Generate QR Code"
                    >
                      <IonIcon slot="icon-only" icon={qrCodeOutline} />
                    </IonButton>
                    <IonButton
                      fill="clear"
                      color="primary"
                      onClick={() => handleEditMember(member)}
                      title="Edit Member"
                    >
                      <IonIcon slot="icon-only" icon={createOutline} />
                    </IonButton>
                    <IonButton
                      fill="clear"
                      color="danger"
                      onClick={() => handleDeleteMember(member.id)}
                      title="Delete Member"
                    >
                      <IonIcon slot="icon-only" icon={trashOutline} />
                    </IonButton>
                  </div>
                </IonItem>
              ))
            )}
          </IonList>

          {/* Floating Action Button */}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton color="primary" onClick={openAddModal}>
              <IonIcon icon={addOutline} />
            </IonFabButton>
          </IonFab>

          {/* Add/Edit Member Modal */}
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar color="primary">
                <IonTitle>
                  {editingMember ? "Edit Member" : "Add New Member"}
                </IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModal(false)}>
                    <IonIcon slot="icon-only" icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="modal-content">
              <div className="form-container">
                <div className="form-group">
                  <IonLabel className="form-label">Full Name *</IonLabel>
                  <IonInput
                    value={formData.name}
                    onIonInput={(e) =>
                      setFormData({ ...formData, name: e.detail.value! })
                    }
                    placeholder="Enter full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <IonLabel className="form-label">Email *</IonLabel>
                  <IonInput
                    type="email"
                    value={formData.email}
                    onIonInput={(e) =>
                      setFormData({ ...formData, email: e.detail.value! })
                    }
                    placeholder="Enter email address"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <IonLabel className="form-label">Phone Number *</IonLabel>
                  <IonInput
                    type="tel"
                    value={formData.phone}
                    onIonInput={(e) =>
                      setFormData({ ...formData, phone: e.detail.value! })
                    }
                    placeholder="Enter phone number"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <IonLabel className="form-label">Membership Type *</IonLabel>
                  <IonSelect
                    value={formData.membershipType}
                    onIonChange={(e) =>
                      setFormData({
                        ...formData,
                        membershipType: e.detail.value,
                      })
                    }
                    className="form-select"
                  >
                    <IonSelectOption value="monthly">Monthly</IonSelectOption>
                    <IonSelectOption value="quarterly">Quarterly</IonSelectOption>
                    <IonSelectOption value="annual">Annual</IonSelectOption>
                    <IonSelectOption value="weekly">Weekly</IonSelectOption>
                  </IonSelect>
                </div>

                <div className="form-group">
                  <IonLabel className="form-label">Join Date *</IonLabel>
                  <IonInput
                    type="date"
                    value={formData.joinDate}
                    onIonInput={(e) =>
                      setFormData({ ...formData, joinDate: e.detail.value! })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-actions">
                  <IonButton
                    expand="block"
                    color="medium"
                    fill="outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </IonButton>
                  <IonButton
                    expand="block"
                    color="primary"
                    onClick={handleSaveMember}
                    disabled={
                      !formData.name || !formData.email || !formData.phone
                    }
                  >
                    {editingMember ? "Update Member" : "Add Member"}
                  </IonButton>
                </div>
              </div>
            </IonContent>
          </IonModal>

          {/* QR Code Modal */}
          <IonModal
            isOpen={showQRModal}
            onDidDismiss={() => setShowQRModal(false)}
          >
            <IonHeader>
              <IonToolbar color="primary">
                <IonTitle>Member QR Code</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowQRModal(false)}>
                    <IonIcon slot="icon-only" icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="modal-content">
              <div className="qr-container">
                <div className="qr-member-info">
                  <h2>{selectedMember?.name}</h2>
                  <p>{selectedMember?.email}</p>
                  <IonBadge color={getStatusColor(selectedMember?.status || "")}>
                    {selectedMember?.status}
                  </IonBadge>
                </div>
                <div className="qr-code-placeholder">
                  <IonIcon icon={qrCodeOutline} className="qr-icon" />
                  <p className="qr-placeholder-text">
                    QR Code will be generated here
                  </p>
                  <p className="qr-id">Member ID: {selectedMember?.id}</p>
                </div>
                <IonButton expand="block" color="primary" className="download-btn">
                  Download QR Code
                </IonButton>
              </div>
            </IonContent>
          </IonModal>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Customers;