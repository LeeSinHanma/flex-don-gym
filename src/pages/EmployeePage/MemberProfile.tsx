import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import {
  personCircleOutline,
  calendarOutline,
  cardOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";
import EmployeeHeader from "../../components/EmployeeComponents/Layout/Header";
import { generateQRData } from "../../Services/qrLogic";
import QRCode from "qrcode";
import "./MemberProfile.css";

interface Member {
  id: string;
  name: string;
  membershipType: string;
  status: "active" | "expired" | "expiring-soon";
  expiryDate: string;
  joinDate: string;
  email: string;
  phone: string;
}

const MemberProfile: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const history = useHistory();
  const [member, setMember] = useState<Member | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock member data - replace with actual API call
    const mockMember: Member = {
      id: memberId,
      name: "Juan Dela Cruz",
      membershipType: "Premium Monthly",
      status: "active",
      expiryDate: "2024-12-31",
      joinDate: "2024-01-15",
      email: "juan.delacruz@email.com",
      phone: "+63 917 123 4567",
    };

    setMember(mockMember);
    setLoading(false);

    // Generate QR Code
    const qrData = generateQRData({
      memberId: mockMember.id,
      memberName: mockMember.name,
      membershipType: mockMember.membershipType,
      expiryDate: mockMember.expiryDate,
    });

    QRCode.toDataURL(qrData, { width: 250, margin: 2 })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [memberId]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "profile-status-active";
      case "expiring-soon":
        return "profile-status-warning";
      case "expired":
        return "profile-status-expired";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "expiring-soon":
        return "Expiring Soon";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading || !member) {
    return (
      <IonPage>
        <EmployeeHeader title="Member Profile" />
        <IonContent className="member-profile-content">
          <div className="loading-container">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const daysRemaining = calculateDaysRemaining(member.expiryDate);

  return (
    <IonPage>
      <EmployeeHeader title="Member Profile" />
      <IonContent fullscreen className="member-profile-content">
        <div className="member-profile-container">
          {/* Member Header Card */}
          <IonCard className="profile-header-card">
            <IonCardContent>
              <div className="profile-header">
                <IonIcon icon={personCircleOutline} className="profile-avatar" />
                <div className="profile-info">
                  <h1 className="profile-name">{member.name}</h1>
                  <p className="profile-id">ID: {member.id}</p>
                  <IonBadge className={`profile-status-badge ${getStatusBadgeClass(member.status)}`}>
                    {getStatusText(member.status)}
                  </IonBadge>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Membership Details */}
          <IonCard className="details-card">
            <IonCardContent>
              <h2 className="card-title">Membership Details</h2>
              <IonGrid className="details-grid">
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <div className="detail-item">
                      <IonIcon icon={cardOutline} className="detail-icon" />
                      <div className="detail-content">
                        <p className="detail-label">Membership Type</p>
                        <p className="detail-value">{member.membershipType}</p>
                      </div>
                    </div>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <div className="detail-item">
                      <IonIcon icon={calendarOutline} className="detail-icon" />
                      <div className="detail-content">
                        <p className="detail-label">Expiry Date</p>
                        <p className="detail-value">{formatDate(member.expiryDate)}</p>
                      </div>
                    </div>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <div className="detail-item">
                      <IonIcon icon={checkmarkCircleOutline} className="detail-icon" />
                      <div className="detail-content">
                        <p className="detail-label">Days Remaining</p>
                        <p className="detail-value">
                          {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
                        </p>
                      </div>
                    </div>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <div className="detail-item">
                      <IonIcon icon={calendarOutline} className="detail-icon" />
                      <div className="detail-content">
                        <p className="detail-label">Join Date</p>
                        <p className="detail-value">{formatDate(member.joinDate)}</p>
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* QR Code Card */}
          <IonCard className="qr-code-card">
            <IonCardContent>
              <h2 className="card-title">Member QR Code</h2>
              <div className="qr-code-container">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Member QR Code" className="qr-code-image" />
                ) : (
                  <IonSpinner name="crescent" />
                )}
                <IonText className="qr-code-hint">
                  Use this QR code for quick check-in
                </IonText>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MemberProfile;
