import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonIcon,
  IonAvatar,
  useIonToast,
} from "@ionic/react";
import AdminHeader from "../../components/admincomponents/Layout/header";
import {
  personOutline,
  mailOutline,
  callOutline,
  briefcaseOutline,
  logOutOutline,
  saveOutline,
  createOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./common.css";
import "./profile.css";

interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  joinedDate: string;
}

const Profile: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const [present] = useIonToast();

  const [profile, setProfile] = useState<AdminProfile>({
    name: "Admin User",
    email: "admin@flexdongym.com",
    phone: "+1 234 567 8900",
    role: "System Administrator",
    joinedDate: "January 2024",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<AdminProfile>(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);

    present({
      message: "Profile updated successfully!",
      duration: 2000,
      position: "top",
      color: "success",
    });
  };

  const handleLogout = () => {
    present({
      message: "Logging out...",
      duration: 1500,
      position: "top",
      color: "medium",
    });

    setTimeout(() => {
      logout();
      window.location.href = "/";
    }, 1500);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <IonPage className="admin-page">
      <AdminHeader title="Admin Profile" />

      <IonContent className="ion-padding">
        {/* Profile Header */}
        <IonCard className="profile-header-card">
          <IonCardContent>
            <div className="profile-header-content">
              <div className="profile-avatar-section">
                <IonAvatar className="profile-avatar-large">
                  <div className="avatar-placeholder">
                    {getInitials(profile.name)}
                  </div>
                </IonAvatar>
              </div>
              <div className="profile-info-section">
                <IonText>
                  <h2 className="profile-name">{profile.name}</h2>
                  <p className="profile-role">{profile.role}</p>
                  <p className="profile-joined">
                    Member since {profile.joinedDate}
                  </p>
                </IonText>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Profile Details */}
        <IonCard className="profile-details-card">
          <IonCardHeader>
            <div className="card-header-with-action">
              <IonCardTitle>Profile Information</IonCardTitle>
              {!isEditing && (
                <IonButton size="small" onClick={handleEdit}>
                  <IonIcon slot="start" icon={createOutline} />
                  Edit
                </IonButton>
              )}
            </div>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonIcon icon={personOutline} slot="start" color="primary" />
                <IonLabel position="stacked">Full Name</IonLabel>
                {isEditing ? (
                  <IonInput
                    value={editedProfile.name}
                    onIonInput={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        name: e.detail.value!,
                      })
                    }
                  />
                ) : (
                  <IonInput value={profile.name} readonly />
                )}
              </IonItem>

              <IonItem>
                <IonIcon icon={mailOutline} slot="start" color="primary" />
                <IonLabel position="stacked">Email</IonLabel>
                {isEditing ? (
                  <IonInput
                    type="email"
                    value={editedProfile.email}
                    onIonInput={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        email: e.detail.value!,
                      })
                    }
                  />
                ) : (
                  <IonInput value={profile.email} readonly />
                )}
              </IonItem>

              <IonItem>
                <IonIcon icon={callOutline} slot="start" color="primary" />
                <IonLabel position="stacked">Phone</IonLabel>
                {isEditing ? (
                  <IonInput
                    type="tel"
                    value={editedProfile.phone}
                    onIonInput={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        phone: e.detail.value!,
                      })
                    }
                  />
                ) : (
                  <IonInput value={profile.phone} readonly />
                )}
              </IonItem>

              <IonItem>
                <IonIcon icon={briefcaseOutline} slot="start" color="primary" />
                <IonLabel position="stacked">Role</IonLabel>
                <IonInput value={profile.role} readonly />
              </IonItem>
            </IonList>

            {isEditing && (
              <div className="profile-actions">
                <IonButton expand="block" color="primary" onClick={handleSave}>
                  <IonIcon slot="start" icon={saveOutline} />
                  Save Changes
                </IonButton>
                <IonButton
                  expand="block"
                  color="medium"
                  fill="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </IonButton>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        {/* Settings & Actions */}
        <IonCard className="settings-card">
          <IonCardHeader>
            <IonCardTitle>Account Settings</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem button detail>
                <IonLabel>
                  <h3>Change Password</h3>
                  <p>Update your account password</p>
                </IonLabel>
              </IonItem>

              <IonItem button detail>
                <IonLabel>
                  <h3>Notification Preferences</h3>
                  <p>Manage email and push notifications</p>
                </IonLabel>
              </IonItem>

              <IonItem button detail>
                <IonLabel>
                  <h3>Security Settings</h3>
                  <p>Two-factor authentication and security</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Logout Section */}
        <IonCard className="logout-card">
          <IonCardContent>
            <IonButton
              expand="block"
              color="danger"
              onClick={handleLogout}
              className="logout-button"
            >
              <IonIcon slot="start" icon={logOutOutline} />
              Logout
            </IonButton>
            <p className="logout-note">
              You will be redirected to the login page
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
