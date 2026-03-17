import React, { useRef } from "react";
import { Modal } from "./Modals";
import { Button } from "./Button";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";

type QrCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  qrValue?: string;
  memberName?: string;
  logoSrc: string;
  title?: string;
  downloadFileName?: string;
};

const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  qrValue,
  memberName,
  logoSrc,
  title = "DONDON'S FITNESS GYM",
  downloadFileName = "member-qr",
}) => {
  const qrCardRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadQr = async () => {
    if (!qrCardRef.current || !qrValue) return;

    try {
      const dataUrl = await htmlToImage.toPng(qrCardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        canvasWidth: 360,
        canvasHeight: qrCardRef.current.offsetHeight,
      });

      const link = document.createElement("a");
      link.download = `${downloadFileName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download QR image:", error);
      alert("Failed to download QR image.");
    }
  };

  return (
    <Modal
      className="modal-box"
      isOpen={isOpen}
      showCloseButton={false}
      onClose={onClose}
    >
      {qrValue ? (
        <>
          <div ref={qrCardRef} className="qr-download-card">
            <div className="qr-header">
              <img src={logoSrc} alt="Logo" className="qr-logo" />
              <h2>{title}</h2>
              <div className="qr-divider" />
            </div>

            <div className="qr-wrapper">
              <QRCode value={qrValue} size={220} />
            </div>

            <p className="qr-member-name">{memberName || "No Name"}</p>
          </div>

          <div
            className="form-actions"
            style={{ display: "flex", gap: 10, marginTop: 15 }}
          >
            <Button type="button" onClick={handleDownloadQr}>
              Download
            </Button>

            <Button type="button" onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center", margin: 0 }}>No QR data.</p>
      )}
    </Modal>
  );
};

export default QrCodeModal;