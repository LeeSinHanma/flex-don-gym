import React from 'react';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { qrCodeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface QRScannerNavProps {
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  color?: string;
  scannerPath?: string;
}

const QRScannerNav: React.FC<QRScannerNavProps> = ({
  position = 'bottom-right',
  color = 'secondary',
  scannerPath = '/employee/qr-scanner',
}) => {
  const history = useHistory();

  const getVerticalPosition = () => {
    return position.startsWith('top') ? 'top' : 'bottom';
  };

  const getHorizontalPosition = () => {
    return position.endsWith('right') ? 'end' : 'start';
  };

  const handleScanClick = () => {
    history.push(scannerPath);
  };

  return (
    <IonFab 
      vertical={getVerticalPosition()} 
      horizontal={getHorizontalPosition()} 
      slot="fixed"
    >
      <IonFabButton color={color} onClick={handleScanClick}>
        <IonIcon icon={qrCodeOutline} />
      </IonFabButton>
    </IonFab>
  );
};

export default QRScannerNav;
