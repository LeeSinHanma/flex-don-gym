import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonSearchbar,
  IonList,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonCard,
  IonCardTitle,
  IonText,
  IonBadge,
} from "@ionic/react";
import {
  addOutline,
  closeOutline,
  searchOutline,
  qrCodeOutline,
} from "ionicons/icons";
import AdminHeader from "../../../components/admincomponents/Layout/header";
import { MemberCard } from "../../../components/admincomponents/cards";
import { MemberForm } from "../../../components/admincomponents/forms";
import { EmptyStateCard } from "../../../components/Reusable/cards";
import QRCodeGenerator from "../../../components/Reusable/QRCodeGenerator";
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
      setShowModal(false);
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
      setShowModal(false);
      
      // Auto-generate QR code for new member
      setSelectedMember(newMember);
      setShowQRModal(true);
    }
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
              <EmptyStateCard
                icon={searchOutline}
                message="No members found. Try adjusting your search or add a new member."
              />
            ) : (
              filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onEdit={() => handleEditMember(member)}
                  onDelete={() => handleDeleteMember(member.id)}
                  onGenerateQR={() => handleGenerateQR(member)}
                />
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
              <MemberForm formData={formData} onChange={setFormData} />

              <div className="form-actions" style={{ padding: '0 16px 16px' }}>
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
            </IonContent>
          </IonModal>

          {/* QR Code Modal */}
          <QRCodeGenerator
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            memberData={selectedMember ? {
              id: selectedMember.id,
              name: selectedMember.name,
              email: selectedMember.email,
              membershipType: selectedMember.membershipType,
              expiryDate: selectedMember.expiryDate,
              status: selectedMember.status,
            } : null}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Customers;