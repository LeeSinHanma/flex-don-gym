import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonList,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonText,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import AdminHeader from "../../../components/admincomponents/Layout/header";
import { EquipmentCard } from "../../../components/admincomponents/cards";
import { EquipmentForm } from "../../../components/admincomponents/forms";
import { EmptyStateCard } from "../../../components/Reusable/cards";
import "./common.css";
import "./equipment.css";

interface Equipment {
  id: number;
  name: string;
  status: "working" | "maintenance" | "broken";
  lastMaintenance: string;
  notes?: string;
}

interface MaintenanceLog {
  id: number;
  equipmentId: number;
  equipmentName: string;
  date: string;
  type: string;
  technician: string;
  notes: string;
}

const Equipment: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([
    {
      id: 1,
      name: "Treadmill #1",
      status: "working",
      lastMaintenance: "2024-01-15",
      notes: "Regular checkup completed",
    },
    {
      id: 2,
      name: "Treadmill #2",
      status: "broken",
      lastMaintenance: "2024-01-10",
      notes: "Motor needs replacement",
    },
    {
      id: 3,
      name: "Bench Press #1",
      status: "maintenance",
      lastMaintenance: "2024-01-20",
      notes: "Scheduled maintenance",
    },
    {
      id: 4,
      name: "Rowing Machine #1",
      status: "working",
      lastMaintenance: "2024-01-18",
      notes: "All good",
    },
    {
      id: 5,
      name: "Elliptical #1",
      status: "working",
      lastMaintenance: "2024-01-12",
      notes: "Recent cleaning",
    },
  ]);

  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([
    {
      id: 1,
      equipmentId: 2,
      equipmentName: "Treadmill #2",
      date: "2024-01-10",
      type: "Repair",
      technician: "John Smith",
      notes: "Motor issue identified, parts ordered",
    },
    {
      id: 2,
      equipmentId: 3,
      equipmentName: "Bench Press #1",
      date: "2024-01-20",
      type: "Routine Maintenance",
      technician: "Mike Johnson",
      notes: "Belt tightened, lubrication applied",
    },
    {
      id: 3,
      equipmentId: 1,
      equipmentName: "Treadmill #1",
      date: "2024-01-15",
      type: "Inspection",
      technician: "John Smith",
      notes: "General inspection, no issues found",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    status: "working" as "working" | "maintenance" | "broken",
    lastMaintenance: "",
    notes: "",
  });

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setFormData({
      name: "",
      status: "working",
      lastMaintenance: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setShowModal(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setFormData({
      name: equipment.name,
      status: equipment.status,
      lastMaintenance: equipment.lastMaintenance,
      notes: equipment.notes || "",
    });
    setShowModal(true);
  };

  const handleSaveEquipment = () => {
    if (editingEquipment) {
      // Update existing equipment
      setEquipmentList(
        equipmentList.map((eq) =>
          eq.id === editingEquipment.id ? { ...eq, ...formData } : eq
        )
      );
    } else {
      // Add new equipment
      const newEquipment: Equipment = {
        id: Math.max(...equipmentList.map((e) => e.id), 0) + 1,
        ...formData,
      };
      setEquipmentList([...equipmentList, newEquipment]);
    }
    setShowModal(false);
  };


  return (
    <IonPage className="admin-page">
      <AdminHeader title="Equipment Management" />

      <IonContent className="ion-padding">
        {/* Header Section */}
        <div className="equipment-header">
          <div>
            <IonText>
              <h2 className="page-title">Gym Equipment</h2>
              <p className="page-subtitle">
                Track equipment status and maintenance schedules
              </p>
            </IonText>
          </div>
          <IonButton color="primary" onClick={handleAddEquipment}>
            Add Equipment
          </IonButton>
        </div>

        {/* Equipment List */}
        <IonCard className="equipment-card">
          <IonCardHeader>
            <IonCardTitle>Equipment List</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList className="equipment-list">
              {equipmentList.length === 0 ? (
                <EmptyStateCard message="No equipment found. Add your first equipment to get started." />
              ) : (
                equipmentList.map((equipment) => (
                  <EquipmentCard
                    key={equipment.id}
                    equipment={equipment}
                    onEdit={() => handleEditEquipment(equipment)}
                  />
                ))
              )}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Maintenance Log */}
        <IonCard className="maintenance-log-card">
          <IonCardHeader>
            <IonCardTitle>Maintenance Log</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="log-list">
              {maintenanceLogs.map((log) => (
                <div key={log.id} className="log-entry">
                  <div className="log-header">
                    <h3 className="log-equipment">{log.equipmentName}</h3>
                    <span className="log-date">{log.date}</span>
                  </div>
                  <div className="log-details">
                    <p className="log-type">
                      <strong>Type:</strong> {log.type}
                    </p>
                    <p className="log-technician">
                      <strong>Technician:</strong> {log.technician}
                    </p>
                    <p className="log-notes">
                      <strong>Notes:</strong> {log.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </IonCardContent>
        </IonCard>

        {/* Add/Edit Equipment Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                {editingEquipment ? "Edit Equipment" : "Add Equipment"}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  Cancel
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <EquipmentForm formData={formData} onChange={setFormData} />

            <div className="modal-actions" style={{ padding: '16px 0' }}>
              <IonButton
                expand="block"
                color="primary"
                onClick={handleSaveEquipment}
                disabled={!formData.name}
              >
                {editingEquipment ? "Update" : "Add"} Equipment
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Equipment;
