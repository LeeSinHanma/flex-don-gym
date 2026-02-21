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
import { qrCodeOutline, cartOutline, personAddOutline, timeOutline } from "ionicons/icons";
import EmployeeHeader from "../../components/EmployeeComponents/Layout/Header";
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
      <EmployeeHeader title="Employee Dashboard" showQRButton={false} />
      <IonContent fullscreen className="employee-dashboard-content">
        <div className="dashboard-container">
          {/* Today's Check-ins Count Card */}
          <IonCard className="checkin-count-card">
            <IonCardContent>
              <div className="count-display">
                <IonIcon icon={timeOutline} className="count-icon" />
                <div className="count-info">
                  <IonText className="count-label">Today's Check-ins</IonText>
                  <IonText className="count-number">{checkInCount}</IonText>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Quick Action Buttons */}
          <div className="quick-actions-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              <IonButton
                expand="block"
                className="action-button action-primary"
                onClick={() => history.push("/employee/qr-scanner")}
              >
                <IonIcon slot="start" icon={qrCodeOutline} />
                Scan QR
              </IonButton>
              <IonButton
                expand="block"
                className="action-button action-secondary"
                fill="outline"
                onClick={() => history.push("/employee/pos")}
              >
                <IonIcon slot="start" icon={cartOutline} />
                POS
              </IonButton>
              <IonButton
                expand="block"
                className="action-button action-secondary"
                fill="outline"
                onClick={() => history.push("/employee/members")}
              >
                <IonIcon slot="start" icon={personAddOutline} />
                Register Member
              </IonButton>
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
              <IonCard className="empty-state-card">
                <IonCardContent>
                  <IonText className="empty-state-text">
                    No check-ins yet today. Scan a member's QR code to get started.
                  </IonText>
                </IonCardContent>
              </IonCard>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EmployeeDashboard;
