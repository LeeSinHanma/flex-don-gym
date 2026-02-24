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
import AdminHeader from "../../../components/admincomponents/Layout/header";
import { StatCard } from "../../../components/Reusable/cards";
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
                <StatCard
                  icon={peopleOutline}
                  value={stats.totalMembers}
                  label="Total Members"
                  type="primary"
                />
              </IonCol>

              {/* Active Members */}
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <StatCard
                  icon={checkmarkCircleOutline}
                  value={stats.activeMembers}
                  label="Active Members"
                  type="success"
                />
              </IonCol>

              {/* Today's Check-ins */}
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <StatCard
                  icon={todayOutline}
                  value={stats.todayCheckIns}
                  label="Today's Check-ins"
                  type="warning"
                />
              </IonCol>

              {/* Monthly Revenue */}
              <IonCol size="12" sizeMd="6" sizeLg="3">
                <StatCard
                  icon={cashOutline}
                  value={`$${stats.revenue.toLocaleString()}`}
                  label="Monthly Revenue"
                  type="revenue"
                />
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