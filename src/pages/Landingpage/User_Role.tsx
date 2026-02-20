import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonList,
  IonToast,
} from '@ionic/react';
import { shieldCheckmarkOutline, personOutline, closeOutline, arrowForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Username from '../../components/Reusable/Username';
import Password from '../../components/Reusable/Password';
import Button from '../../components/Reusable/Button';
import './User_Role.css';

const UserRole: React.FC = () => {
  const history = useHistory();
  const { login } = useAuth();
  const [showModal, setShowModal] = useState(false);
  type Role = 'admin' | 'employee';
  const [selectedRole, setSelectedRole] = useState<Role | null>(null as Role | null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<Role | null>(null as Role | null);

  const handleRoleSelect = (role: 'admin' | 'employee') => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleLogin = async () => {
    if (!username || !password || !selectedRole) {
      setToastMessage('Please fill in all fields');
      setShowToast(true);
      return;
    }
    setLoading(true);
    const success = await login(username, password, selectedRole);
    setLoading(false);
    if (success) {
      setShowModal(false);
      history.push(selectedRole === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    } else {
      setToastMessage('Invalid credentials. Please try again.');
      setShowToast(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsername('');
    setPassword('');
  };

  return (
    <IonPage>
      <IonContent className="ur-page" fullscreen>

        {/* ── Full screen split layout ── */}
        <div className="ur-split">

          {/* ── ADMIN panel ── */}
          <button
            className={`ur-panel ur-admin ${hoveredRole === 'admin' ? 'is-hovered' : ''} ${hoveredRole === 'employee' ? 'is-dimmed' : ''}`}
            onClick={() => handleRoleSelect('admin')}
            onMouseEnter={() => setHoveredRole('admin')}
            onMouseLeave={() => setHoveredRole(null)}
          >
            <div className="ur-panel-noise" />
            <div className="ur-panel-inner">
              <div className="ur-icon-ring admin-ring">
                <IonIcon
                  icon={shieldCheckmarkOutline}
                  style={{ fontSize: '36px', color: '#ffffff', display: 'block' }}
                />
              </div>
              <div className="ur-label-group">
                <span className="ur-role-tag">ACCESS LEVEL 01</span>
                <h2 className="ur-role-name">Admin</h2>
                <p className="ur-role-desc">Full system control</p>
              </div>
              <div className="ur-arrow">
                <IonIcon
                  icon={arrowForwardOutline}
                  style={{ fontSize: '22px', color: 'rgba(255,255,255,0.5)', display: 'block' }}
                />
              </div>
            </div>
            <div className="ur-panel-glow admin-glow" />
          </button>

          {/* ── Divider ── */}
          <div className="ur-divider">
            <div className="ur-divider-line" />
            <div className="ur-divider-badge">
              <span>OR</span>
            </div>
            <div className="ur-divider-line" />
          </div>

          {/* ── EMPLOYEE panel ── */}
          <button
            className={`ur-panel ur-employee ${hoveredRole === 'employee' ? 'is-hovered' : ''} ${hoveredRole === 'admin' ? 'is-dimmed' : ''}`}
            onClick={() => handleRoleSelect('employee')}
            onMouseEnter={() => setHoveredRole('employee')}
            onMouseLeave={() => setHoveredRole(null)}
          >
            <div className="ur-panel-noise" />
            <div className="ur-panel-inner">
              <div className="ur-icon-ring employee-ring">
                <IonIcon
                  icon={personOutline}
                  style={{ fontSize: '36px', color: '#ffffff', display: 'block' }}
                />
              </div>
              <div className="ur-label-group">
                <span className="ur-role-tag">ACCESS LEVEL 02</span>
                <h2 className="ur-role-name">Employee</h2>
                <p className="ur-role-desc">Daily operations</p>
              </div>
              <div className="ur-arrow">
                <IonIcon
                  icon={arrowForwardOutline}
                  style={{ fontSize: '22px', color: 'rgba(255,255,255,0.5)', display: 'block' }}
                />
              </div>
            </div>
            <div className="ur-panel-glow employee-glow" />
          </button>

        </div>

        {/* ── Branding footer ── */}
        <div className="ur-brand">
          <span className="ur-brand-name">FLEXDON</span>
          <span className="ur-brand-dot">·</span>
          <span className="ur-brand-sub">Gym Management</span>
        </div>

        {/* ── Login Modal ── */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={handleCloseModal}
          className="ur-modal"
        >
          <IonHeader>
            <IonToolbar className={`ur-modal-toolbar ${selectedRole === 'admin' ? 'toolbar-admin' : 'toolbar-employee'}`}>
              <IonTitle className="ur-modal-title">
                {selectedRole === 'admin' ? 'Admin Login' : 'Employee Login'}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={handleCloseModal}>
                  <IonIcon
                    icon={closeOutline}
                    style={{ fontSize: '22px', color: '#ffffff', display: 'block' }}
                  />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ur-modal-content">
            <div className="ur-login-wrap">

              {/* Role indicator pill */}
              <div className={`ur-role-pill ${selectedRole === 'admin' ? 'pill-admin' : 'pill-employee'}`}>
                <IonIcon
                  icon={selectedRole === 'admin' ? shieldCheckmarkOutline : personOutline}
                  style={{ fontSize: '16px', color: '#ffffff', display: 'block' }}
                />
                <span>{selectedRole === 'admin' ? 'Administrator' : 'Employee'}</span>
              </div>

              <h3 className="ur-login-heading">Welcome back</h3>
              <p className="ur-login-sub">Sign in to continue to your dashboard</p>

              <IonList className="ur-login-list">
                <Username
                  value={username}
                  onChange={setUsername}
                  placeholder="Enter your username"
                  required
                />
                <Password
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter your password"
                  required
                />
              </IonList>

              <div className="ur-login-actions">
                <Button
                  text={loading ? 'Signing in…' : 'Sign In'}
                  onClick={handleLogin}
                  expand="block"
                  size="large"
                  disabled={loading}
                />
                <button className="ur-cancel-link" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </div>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="danger"
          position="top"
        />

      </IonContent>
    </IonPage>
  );
};

export default UserRole;