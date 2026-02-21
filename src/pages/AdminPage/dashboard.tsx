import React from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
} from "@ionic/react";
import {
  peopleOutline,
  checkmarkCircleOutline,
  todayOutline,
  cashOutline,
  statsChartOutline,
} from "ionicons/icons";
import AdminHeader from "../../components/admincomponents/Layout/header";
import "./dashboard.css";

const Dashboard: React.FC = () => {
  const stats = {
    totalMembers: 245,
    activeMembers: 198,
    todayCheckIns: 87,
    revenue: 12450.0,
  };

  return (
    <IonPage>
      <AdminHeader title="Dashboard" />
      <IonContent fullscreen className="dashboard-content">
        <div className="dashboard-container">
          {/* Stats Cards */}
          <IonGrid>
            <IonRow>
              {/* Total Members */}
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-icon-wrapper primary">
                      <IonIcon
                        icon={peopleOutline}
                        style={{
                          fontSize: "32px",
                          color: "#1B2E4B",
                          display: "block",
                        }}
                      />
                    </div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.totalMembers}</h3>
                      <p className="stat-label">Total Members</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* Active Members */}
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-icon-wrapper success">
                      <IonIcon
                        icon={checkmarkCircleOutline}
                        style={{
                          fontSize: "32px",
                          color: "#2ECC71",
                          display: "block",
                        }}
                      />
                    </div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.activeMembers}</h3>
                      <p className="stat-label">Active Members</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* Today's Check-ins */}
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-icon-wrapper warning">
                      <IonIcon
                        icon={todayOutline}
                        style={{
                          fontSize: "32px",
                          color: "#F39C12",
                          display: "block",
                        }}
                      />
                    </div>
                    <div className="stat-content">
                      <h3 className="stat-value">{stats.todayCheckIns}</h3>
                      <p className="stat-label">Today's Check-ins</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* Monthly Revenue */}
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-icon-wrapper revenue">
                      <IonIcon
                        icon={cashOutline}
                        style={{
                          fontSize: "32px",
                          color: "#2ECC71",
                          display: "block",
                        }}
                      />
                    </div>
                    <div className="stat-content">
                      <h3 className="stat-value">
                        ${stats.revenue.toLocaleString()}
                      </h3>
                      <p className="stat-label">Monthly Revenue</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Charts Section Placeholder */}
          <IonCard className="charts-card">
            <IonCardHeader>
              <IonCardTitle>Analytics Overview</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="charts-placeholder">
                <IonIcon
                  icon={statsChartOutline}
                  style={{
                    fontSize: "64px",
                    color: "#adb5bd",
                    display: "block",
                    margin: "0 auto 16px auto",
                  }}
                />
                <p className="chart-placeholder-text">
                  Charts and analytics will be displayed here
                </p>
                <p className="chart-placeholder-subtext">
                  Membership trends, revenue analytics, and attendance patterns
                </p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;