import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonMenuButton } from '@ionic/react';
import { personCircleOutline, qrCodeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import QRScannerModal from '../../Reusable/QRScannerModal';
import './Header.css';

interface EmployeeHeaderProps {
  title: string;
  showQRButton?: boolean;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ title, showQRButton = true }) => {
  const history = useHistory();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannerMode, setScannerMode] = useState<'customer' | 'pos'>('customer');

  const handleOpenScanner = () => {
    setShowQRScanner(true);
  };

  return (
    <>
      <IonHeader className="employee-header">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="employee-header-title">{title}</IonTitle>
          <IonButtons slot="end">
            {showQRButton && (
              <IonButton onClick={handleOpenScanner} title="Scan QR Code">
                <IonIcon slot="icon-only" icon={qrCodeOutline} />
              </IonButton>
            )}
            <IonButton routerLink="/employee/dashboard">
              <IonIcon slot="icon-only" icon={personCircleOutline} />
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

export default EmployeeHeader;
