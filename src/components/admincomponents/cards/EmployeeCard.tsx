import React from 'react';
import { IonCard, IonCardContent, IonBadge, IonButton, IonIcon } from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import './EmployeeCard.css';

interface EmployeeCardProps {
  employee: {
    id: number;
    name: string;
    role: string;
    email: string;
    status: 'active' | 'inactive' | 'on-leave';
    phone?: string;
    hireDate?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      case 'on-leave':
        return 'warning';
      default:
        return 'medium';
    }
  };

  return (
    <IonCard className="employee-card">
      <IonCardContent>
        <div className="employee-card-header">
          <div>
            <h3 className="employee-name">{employee.name}</h3>
            <p className="employee-role">{employee.role}</p>
          </div>
          <IonBadge color={getStatusColor(employee.status)}>
            {employee.status.toUpperCase()}
          </IonBadge>
        </div>
        <div className="employee-details">
          <p className="employee-email">{employee.email}</p>
          {employee.phone && <p className="employee-phone">{employee.phone}</p>}
          {employee.hireDate && (
            <p className="employee-hire-date">Hired: {employee.hireDate}</p>
          )}
        </div>
        <div className="employee-actions">
          <IonButton size="small" fill="outline" onClick={onEdit}>
            <IonIcon slot="start" icon={createOutline} />
            Edit
          </IonButton>
          <IonButton size="small" fill="outline" color="danger" onClick={onDelete}>
            <IonIcon slot="start" icon={trashOutline} />
            Delete
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default EmployeeCard;
