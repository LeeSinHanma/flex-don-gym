import React from 'react';
import { IonItem, IonLabel, IonBadge } from '@ionic/react';
import './EquipmentCard.css';

interface Equipment {
  id: number;
  name: string;
  status: string;
  lastMaintenance: string;
  notes?: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: () => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onEdit }) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "working":
        return "success";
      case "maintenance":
        return "warning";
      case "broken":
        return "danger";
      default:
        return "medium";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "working":
        return "Working";
      case "maintenance":
        return "Maintenance";
      case "broken":
        return "Broken";
      default:
        return status;
    }
  };

  return (
    <IonItem
      className="equipment-item"
      button
      onClick={onEdit}
    >
      <IonLabel>
        <h2 className="equipment-name">{equipment.name}</h2>
        <p className="equipment-detail">
          Last Maintenance: {equipment.lastMaintenance}
        </p>
        {equipment.notes && (
          <p className="equipment-notes">{equipment.notes}</p>
        )}
      </IonLabel>
      <IonBadge
        slot="end"
        color={getStatusBadgeColor(equipment.status)}
        className="status-badge"
      >
        {getStatusText(equipment.status)}
      </IonBadge>
    </IonItem>
  );
};

export default EquipmentCard;
