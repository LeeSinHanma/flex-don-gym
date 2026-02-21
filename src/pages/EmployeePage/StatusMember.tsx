import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon,
  IonToast,
  IonSelect,
  IonSelectOption,
  IonModal,
} from '@ionic/react';
import { checkmarkCircleOutline, timeOutline, closeCircleOutline } from 'ionicons/icons';
import EmployeeHeader from '../../components/EmployeeComponents/Layout/Header';
import './StatusMember.css';

interface Member {
  id: string;
  name: string;
  membershipType: string;
  status: 'active' | 'expiring-soon' | 'expired';
  expiryDate: string;
}

const StatusMember: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewalPlan, setRenewalPlan] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [members] = useState<Member[]>([
    { id: 'M001', name: 'Juan Dela Cruz', membershipType: 'Monthly', status: 'active', expiryDate: '2024-12-31' },
    { id: 'M002', name: 'Maria Santos', membershipType: 'Yearly', status: 'expiring-soon', expiryDate: '2024-11-15' },
    { id: 'M003', name: 'Pedro Reyes', membershipType: 'Quarterly', status: 'expired', expiryDate: '2024-10-01' },
  ]);

  const membershipPlans = [
    { value: 'monthly', label: 'Monthly - ₱1,500' },
    { value: 'quarterly', label: 'Quarterly - ₱4,000' },
    { value: 'yearly', label: 'Yearly - ₱15,000' },
  ];

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchText.toLowerCase()) ||
    member.id.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return checkmarkCircleOutline;
      case 'expiring-soon': return timeOutline;
      case 'expired': return closeCircleOutline;
      default: return checkmarkCircleOutline;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'expiring-soon': return 'warning';
      case 'expired': return 'danger';
      default: return 'medium';
    }
  };

  const handleRenew = () => {
    if (!renewalPlan) {
      setToastMessage('Please select a renewal plan');
      setShowToast(true);
      return;
    }

    // Mock renewal - replace with actual API call
    setToastMessage(`Membership renewed successfully for ${selectedMember?.name}!`);
    setShowToast(true);
    setShowRenewModal(false);
    setSelectedMember(null);
    setRenewalPlan('');
  };

  return (
    <IonPage>
      <EmployeeHeader title="Member Status & Renewal" />
      <IonContent fullscreen className="status-member-content">
        <div className="status-member-container">
          <IonCard className="search-card">
            <IonCardContent>
              <IonSearchbar
                value={searchText}
                onIonChange={(e) => setSearchText(e.detail.value!)}
                placeholder="Search by name or ID"
              />
            </IonCardContent>
          </IonCard>

          <IonList>
            {filteredMembers.map((member) => (
              <IonCard key={member.id} className="member-card">
                <IonItem lines="none">
                  <IonIcon 
                    icon={getStatusIcon(member.status)} 
                    slot="start" 
                    color={getStatusColor(member.status)}
                    style={{ fontSize: '32px' }}
                  />
                  <IonLabel>
                    <h2 style={{ fontWeight: 'bold', color: '#1B2E4B' }}>{member.name}</h2>
                    <p>ID: {member.id} | {member.membershipType}</p>
                    <p>Expires: {member.expiryDate}</p>
                  </IonLabel>
                  <IonBadge color={getStatusColor(member.status)} slot="end">
                    {member.status.replace('-', ' ').toUpperCase()}
                  </IonBadge>
                </IonItem>
                <div style={{ padding: '0 16px 16px' }}>
                  <IonButton
                    expand="block"
                    size="small"
                    onClick={() => {
                      setSelectedMember(member);
                      setShowRenewModal(true);
                    }}
                    disabled={member.status === 'active'}
                  >
                    Renew Membership
                  </IonButton>
                </div>
              </IonCard>
            ))}
          </IonList>

          {filteredMembers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9BADB7' }}>
              <p>No members found</p>
            </div>
          )}
        </div>

        {/* Renewal Modal */}
        <IonModal isOpen={showRenewModal} onDidDismiss={() => setShowRenewModal(false)}>
          <IonContent>
            <div style={{ padding: '20px' }}>
              <h2 style={{ color: '#1B2E4B', fontWeight: 'bold' }}>Renew Membership</h2>
              <p>Member: <strong>{selectedMember?.name}</strong></p>

              <IonItem>
                <IonLabel position="stacked">Select Plan</IonLabel>
                <IonSelect
                  value={renewalPlan}
                  onIonChange={(e) => setRenewalPlan(e.detail.value)}
                  placeholder="Choose plan"
                >
                  {membershipPlans.map((plan) => (
                    <IonSelectOption key={plan.value} value={plan.value}>
                      {plan.label}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonButton expand="block" onClick={handleRenew} style={{ marginTop: '20px' }}>
                Confirm Renewal
              </IonButton>
              <IonButton expand="block" fill="clear" onClick={() => setShowRenewModal(false)}>
                Cancel
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default StatusMember;
