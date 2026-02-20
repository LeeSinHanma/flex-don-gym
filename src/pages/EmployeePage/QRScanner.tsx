import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonText,
  IonIcon,
  IonBadge,
  IonToast,
} from '@ionic/react';
import { qrCodeOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import EmployeeHeader from '../../components/EmployeeComponents/Layout/Header';
import { decodeQRData } from '../../Services/qrLogic';
import './QRScanner.css';

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const startScan = () => {
    setScanning(true);
    setScanResult(null);

    // Mock QR scan - replace with actual QR scanner implementation using html5-qrcode
    setTimeout(() => {
      const mockQRData = JSON.stringify({
        memberId: 'M001',
        memberName: 'Juan Dela Cruz',
        membershipType: 'Monthly Premium',
        expiryDate: '2024-12-31',
      });

      const result = decodeQRData(mockQRData);
      setScanResult(result);
      setScanning(false);
      setToastMessage('Member checked in successfully!');
      setShowToast(true);
    }, 2000);
  };

  return (
    <IonPage>
      <EmployeeHeader title="QR Scanner" />
      <IonContent fullscreen className="qr-scanner-content">
        <div className="qr-scanner-container">
          <IonCard className="scanner-card">
            <IonCardContent>
              <div className="scanner-box">
                {!scanning && !scanResult && (
                  <div className="scanner-placeholder">
                    <IonIcon icon={qrCodeOutline} className="scanner-icon" />
                    <p>Ready to scan</p>
                  </div>
                )}

                {scanning && (
                  <div className="scanner-active">
                    <div className="scanning-animation"></div>
                    <p>Scanning...</p>
                  </div>
                )}

                {scanResult && (
                  <div className="scan-result">
                    <IonIcon 
                      icon={scanResult.status === 'active' ? checkmarkCircleOutline : closeCircleOutline} 
                      className={`result-icon ${scanResult.status === 'active' ? 'success' : 'error'}`}
                    />
                    <h2>{scanResult.memberName}</h2>
                    <p className="member-id">ID: {scanResult.memberId}</p>
                    <IonBadge color={scanResult.status === 'active' ? 'success' : 'danger'}>
                      {scanResult.status === 'active' ? 'Active' : 'Expired'}
                    </IonBadge>
                    <div className="member-details">
                      <p><strong>Type:</strong> {scanResult.membershipType}</p>
                      <p><strong>Expires:</strong> {scanResult.expiryDate}</p>
                    </div>
                  </div>
                )}
              </div>

              {!scanning && (
                <IonButton expand="block" onClick={startScan} style={{ marginTop: '20px' }}>
                  <IonIcon icon={qrCodeOutline} slot="start" />
                  {scanResult ? 'Scan Another' : 'Start Scanning'}
                </IonButton>
              )}
            </IonCardContent>
          </IonCard>

          <IonCard className="info-card">
            <IonCardContent>
              <h3>How to use:</h3>
              <ol>
                <li>Ask the member to show their QR code</li>
                <li>Tap "Start Scanning" button</li>
                <li>Point camera at the QR code</li>
                <li>Check-in will be recorded automatically</li>
              </ol>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={scanResult?.status === 'active' ? 'success' : 'danger'}
        />
      </IonContent>
    </IonPage>
  );
};

export default QRScanner;
