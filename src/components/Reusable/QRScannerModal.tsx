import React, { useState, useEffect, useRef } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonText,
  IonBadge,
  IonToast,
  IonSpinner,
} from '@ionic/react';
import { closeOutline, personOutline, cartOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { Html5Qrcode } from 'html5-qrcode';
import { decodeQRData, formatQRDataForDisplay } from '../../Services/qrLogic';
import './QRScannerModal.css';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'customer' | 'pos';
  onModeChange: (mode: 'customer' | 'pos') => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger' | 'warning'>('success');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      // Wait for the element to be rendered before initializing
      const timer = setTimeout(() => {
        const element = document.getElementById('qr-reader');
        if (element && !scannerRef.current) {
          scannerRef.current = new Html5Qrcode('qr-reader');
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        stopScanning();
      };
    } else {
      // Clean up when modal closes
      if (scannerRef.current) {
        stopScanning().then(() => {
          scannerRef.current = null;
        });
      }
    }
  }, [isOpen]);

  const startScanning = async () => {
    if (isScanningRef.current || !scannerRef.current) return;

    try {
      isScanningRef.current = true;
      setScanning(true);
      setScanResult(null);

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      setToastMessage('Failed to start camera. Please check permissions.');
      setToastColor('danger');
      setShowToast(true);
      isScanningRef.current = false;
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    if (!isScanningRef.current || !scannerRef.current) return;

    try {
      await scannerRef.current.stop();
      isScanningRef.current = false;
      setScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    await stopScanning();

    const result = decodeQRData(decodedText);

    if (result.success && result.data) {
      const formattedData = formatQRDataForDisplay(result.data);
      setScanResult(formattedData);

      if (mode === 'customer') {
        handleCustomerCheckIn(formattedData);
      } else {
        handlePOSTransaction(formattedData);
      }
    } else {
      setToastMessage(result.error || 'Invalid QR code');
      setToastColor('danger');
      setShowToast(true);
      setScanResult(null);
    }
  };

  const onScanError = (errorMessage: string) => {
    // Ignore frequent scan errors
  };

  const handleCustomerCheckIn = (memberData: any) => {
    if (memberData.status === 'active') {
      setToastMessage(`${memberData.memberName} checked in successfully!`);
      setToastColor('success');
      
      // TODO: Save check-in to database
      console.log('Check-in recorded:', memberData);
    } else if (memberData.status === 'expiring-soon') {
      setToastMessage(`${memberData.memberName} membership expires soon!`);
      setToastColor('warning');
    } else {
      setToastMessage(`${memberData.memberName} membership has expired!`);
      setToastColor('danger');
    }
    setShowToast(true);
  };

  const handlePOSTransaction = (memberData: any) => {
    setToastMessage(`Member ${memberData.memberName} scanned for POS`);
    setToastColor('success');
    setShowToast(true);
    
    // TODO: Navigate to POS page with member data
    console.log('POS transaction for:', memberData);
  };

  const handleClose = async () => {
    await stopScanning();
    setScanResult(null);
    onClose();
  };

  const handleScanAnother = () => {
    setScanResult(null);
    startScanning();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose} className="qr-scanner-modal">
      <IonHeader>
        <IonToolbar>
          <IonTitle>QR Code Scanner</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={mode} onIonChange={(e) => onModeChange(e.detail.value as 'customer' | 'pos')}>
            <IonSegmentButton value="customer">
              <IonIcon icon={personOutline} />
              <IonLabel>Customer</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pos">
              <IonIcon icon={cartOutline} />
              <IonLabel>POS</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="qr-scanner-container">
          {/* Camera View */}
          <IonCard className="scanner-card">
            <IonCardContent>
              <div id="qr-reader" className="qr-reader"></div>
              
              {!scanning && !scanResult && (
                <div className="scanner-placeholder">
                  <IonIcon icon={mode === 'customer' ? personOutline : cartOutline} className="mode-icon" />
                  <h3>{mode === 'customer' ? 'Customer Check-In' : 'POS Transaction'}</h3>
                  <p>
                    {mode === 'customer'
                      ? 'Scan member QR code to check them in'
                      : 'Scan member QR code to add to transaction'}
                  </p>
                </div>
              )}

              {scanning && (
                <div className="scanning-overlay">
                  <IonSpinner name="crescent" />
                  <p>Scanning...</p>
                </div>
              )}
            </IonCardContent>
          </IonCard>

          {/* Scan Result Display */}
          {scanResult && (
            <IonCard className="result-card">
              <IonCardContent>
                <div className="result-header">
                  <IonIcon
                    icon={scanResult.isValid ? checkmarkCircleOutline : closeCircleOutline}
                    className={`result-icon ${scanResult.isValid ? 'success' : 'error'}`}
                  />
                  <h2>{scanResult.memberName}</h2>
                </div>
                
                <div className="result-details">
                  <p><strong>Member ID:</strong> {scanResult.memberId}</p>
                  <p><strong>Membership:</strong> {scanResult.membershipType}</p>
                  <p><strong>Expires:</strong> {scanResult.expiryDate}</p>
                  <IonBadge
                    color={
                      scanResult.status === 'active'
                        ? 'success'
                        : scanResult.status === 'expiring-soon'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {scanResult.status.toUpperCase().replace('-', ' ')}
                  </IonBadge>
                </div>

                {mode === 'customer' && scanResult.isValid && (
                  <IonText color="success" className="check-in-success">
                    <p>✓ Check-in recorded successfully!</p>
                  </IonText>
                )}
              </IonCardContent>
            </IonCard>
          )}

          {/* Action Buttons */}
          <div className="scanner-actions">
            {!scanning && !scanResult && (
              <IonButton expand="block" onClick={startScanning}>
                Start Scanning
              </IonButton>
            )}

            {scanning && (
              <IonButton expand="block" color="danger" onClick={stopScanning}>
                Stop Scanning
              </IonButton>
            )}

            {scanResult && (
              <IonButton expand="block" onClick={handleScanAnother}>
                Scan Another
              </IonButton>
            )}
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
          position="top"
        />
      </IonContent>
    </IonModal>
  );
};

export default QRScannerModal;
