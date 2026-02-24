import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonMenuButton } from '@ionic/react';
import { personCircleOutline, notificationsOutline, qrCodeOutline } from 'ionicons/icons';
import QRScannerModal from '../../Reusable/QRScannerModal';
import './header.css';

interface AdminHeaderProps {
  title: string;
  showMenuButton?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, showMenuButton = true }) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannerMode, setScannerMode] = useState<'customer' | 'pos'>('customer');

  const handleOpenScanner = (mode: 'customer' | 'pos') => {
    setScannerMode(mode);
    setShowQRScanner(true);
  };

  return (
    <>
      <IonHeader className="admin-header">
        <IonToolbar color="primary">
          {showMenuButton && (
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
          )}
          <IonTitle className="admin-header-title">{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => handleOpenScanner('customer')} title="Scan QR - Customer">
              <IonIcon slot="icon-only" icon={qrCodeOutline} />
            </IonButton>
            <IonButton>
              <IonIcon slot="icon-only" icon={notificationsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        mode={scannerMode}
        onModeChange={setScannerMode}
      />
    </>
  );
};

export default AdminHeader;
