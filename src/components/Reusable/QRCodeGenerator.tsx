import React, { useEffect, useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonBadge,
  IonSpinner,
} from '@ionic/react';
import { closeOutline, downloadOutline, shareOutline } from 'ionicons/icons';
import QRCode from 'qrcode';
import { generateQRData } from '../../Services/qrLogic';
import './QRCodeGenerator.css';

interface QRCodeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  memberData: {
    id: number | string;
    name: string;
    email?: string;
    membershipType: string;
    expiryDate: string;
    status?: string;
  } | null;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  isOpen,
  onClose,
  memberData,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && memberData) {
      generateQRCode();
    }
  }, [isOpen, memberData]);

  const generateQRCode = async () => {
    if (!memberData) return;

    setLoading(true);
    try {
      // Generate QR data string using the qrLogic service
      const qrDataString = generateQRData({
        memberId: String(memberData.id),
        memberName: memberData.name,
        membershipType: memberData.membershipType,
        expiryDate: memberData.expiryDate,
      });

      // Generate QR code image as data URL
      const url = await QRCode.toDataURL(qrDataString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1B2E4B',
          light: '#FFFFFF',
        },
      });

      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl || !memberData) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR_${memberData.name.replace(/\s+/g, '_')}_${memberData.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!qrCodeUrl || !memberData) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], `QR_${memberData.name}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `QR Code for ${memberData.name}`,
          text: `Membership QR Code for ${memberData.name}`,
        });
      } else {
        // Fallback to download if sharing is not supported
        handleDownload();
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
      handleDownload();
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'expired':
        return 'danger';
      case 'inactive':
      case 'expiring-soon':
        return 'warning';
      default:
        return 'medium';
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Member QR Code</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="qr-generator-content">
        {memberData && (
          <div className="qr-generator-container">
            {/* Member Info */}
            <div className="qr-member-info">
              <h2 className="member-name">{memberData.name}</h2>
              {memberData.email && (
                <p className="member-email">{memberData.email}</p>
              )}
              <div className="member-details">
                <p className="membership-type">
                  <strong>Membership:</strong> {memberData.membershipType}
                </p>
                <p className="expiry-date">
                  <strong>Expires:</strong>{' '}
                  {new Date(memberData.expiryDate).toLocaleDateString()}
                </p>
              </div>
              {memberData.status && (
                <IonBadge color={getStatusColor(memberData.status)} className="status-badge">
                  {memberData.status.toUpperCase()}
                </IonBadge>
              )}
            </div>

            {/* QR Code Display */}
            <div className="qr-code-display">
              {loading ? (
                <div className="qr-loading">
                  <IonSpinner name="crescent" color="primary" />
                  <p>Generating QR Code...</p>
                </div>
              ) : qrCodeUrl ? (
                <>
                  <img src={qrCodeUrl} alt="Member QR Code" className="qr-code-image" />
                  <p className="qr-id">Member ID: {memberData.id}</p>
                  <p className="qr-instruction">
                    Scan this code at check-in to verify membership
                  </p>
                </>
              ) : (
                <div className="qr-error">
                  <p>Failed to generate QR code</p>
                  <IonButton size="small" onClick={generateQRCode}>
                    Retry
                  </IonButton>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {qrCodeUrl && !loading && (
              <div className="qr-actions">
                <IonButton
                  expand="block"
                  color="primary"
                  onClick={handleDownload}
                  className="action-button"
                >
                  <IonIcon slot="start" icon={downloadOutline} />
                  Download QR Code
                </IonButton>
                <IonButton
                  expand="block"
                  color="secondary"
                  fill="outline"
                  onClick={handleShare}
                  className="action-button"
                >
                  <IonIcon slot="start" icon={shareOutline} />
                  Share QR Code
                </IonButton>
              </div>
            )}
          </div>
        )}
      </IonContent>
    </IonModal>
  );
};

export default QRCodeGenerator;
