import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonBadge,
  IonIcon,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { qrCodeOutline, cartOutline, personAddOutline, timeOutline, peopleOutline } from "ionicons/icons";
import EmployeeHeader from "../../components/EmployeeComponents/Layout/Header";
import { CheckInCountCard } from "../../components/EmployeeComponents/cards";
import { EmptyStateCard } from "../../components/Reusable/cards";
import qrService from "../../Services/qrService";
import "./EmployeeDashboard.css";

interface CheckIn {
  memberId: string;
  memberName: string;
  membershipType: string;
  checkInTime: string;
}

const EmployeeDashboard: React.FC = () => {
  const history = useHistory();
  const [todayCheckIns, setTodayCheckIns] = useState<CheckIn[]>([]);
  const [checkInCount, setCheckInCount] = useState(0);

  useEffect(() => {
    // Load today's check-ins
    const checkIns = qrService.getTodayCheckIns();
    setTodayCheckIns(checkIns.slice(0, 5)); // Show last 5 check-ins
    setCheckInCount(checkIns.length);
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <IonPage>
      <EmployeeHeader title="Employee Dashboard" showQRButton={true} />
      <IonContent fullscreen className="employee-dashboard-content">
        <div className="dashboard-container">
          {/* Today's Check-ins Count Card */}
          <CheckInCountCard count={checkInCount} />

          {/* Quick Action Buttons */}
          <div className="quick-actions-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              <IonCard className="action-card" button onClick={() => history.push("/employee/members")}>
                <IonCardContent>
                  <div className="action-card-content">
                    <IonIcon icon={peopleOutline} className="action-icon primary" />
                    <div className="action-text">
                      <h3>All Members</h3>
                      <p>View & manage members</p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonCard className="action-card" button onClick={() => history.push("/employee/prepaid")}>
                <IonCardContent>
                  <div className="action-card-content">
                    <IonIcon icon={personAddOutline} className="action-icon success" />
                    <div className="action-text">
                      <h3>Register Prepaid</h3>
                      <p>Add new member</p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonCard className="action-card" button onClick={() => history.push("/employee/walk-in")}>
                <IonCardContent>
                  <div className="action-card-content">
                    <IonIcon icon={timeOutline} className="action-icon warning" />
                    <div className="action-text">
                      <h3>Walk-In</h3>
                      <p>Daily entry</p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonCard className="action-card" button onClick={() => history.push("/employee/pos")}>
                <IonCardContent>
                  <div className="action-card-content">
                    <IonIcon icon={cartOutline} className="action-icon secondary" />
                    <div className="action-text">
                      <h3>Point of Sale</h3>
                      <p>Sell products</p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          </div>

          {/* Recent Check-ins List */}
          <div className="recent-checkins-section">
            <h2 className="section-title">Recent Check-ins</h2>
            {todayCheckIns.length > 0 ? (
              <IonCard className="checkins-card">
                <IonList className="checkins-list">
                  {todayCheckIns.map((checkIn, index) => (
                    <IonItem key={index} className="checkin-item" lines="full">
                      <IonLabel>
                        <h3 className="member-name">{checkIn.memberName}</h3>
                        <p className="member-type">{checkIn.membershipType}</p>
                      </IonLabel>
                      <IonBadge slot="end" className="time-badge">
                        {formatTime(checkIn.checkInTime)}
                      </IonBadge>
                    </IonItem>
                  ))}
                </IonList>
              </IonCard>
            ) : (
              <EmptyStateCard message="No check-ins yet today. Scan a member's QR code to get started." />
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EmployeeDashboard;
