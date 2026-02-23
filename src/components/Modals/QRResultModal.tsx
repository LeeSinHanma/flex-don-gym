import React from "react";
import {
  IonModal,
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";

interface QRResultModalProps {
  isOpen: boolean;
  qrText: string;
  onConfirm: () => void;
  onClose: () => void;
}

const QRResultModal: React.FC<QRResultModalProps> = ({
  isOpen,
  qrText,
  onConfirm,
  onClose,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="qr-modal">
      <IonHeader>
        <IonToolbar>
          <IonTitle>QR Result</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <p>{qrText}</p>

        <IonButton expand="block" onClick={onConfirm}>
          Confirm
        </IonButton>

        <IonButton expand="block" fill="outline" onClick={onClose}>
          Cancel
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default QRResultModal;