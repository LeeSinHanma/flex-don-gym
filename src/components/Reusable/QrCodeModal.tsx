import React, { useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import * as htmlToImage from "html-to-image";
import QRCode from "react-qr-code";
import { Modal } from "./Modals";
import { Button } from "./Button";

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
      const node = qrCardRef.current;

      const dataUrl = await htmlToImage.toPng(node, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        canvasWidth: 360,
        canvasHeight: node.offsetHeight,
      });

      const fileName = `${downloadFileName}.png`;
      const platform = Capacitor.getPlatform();

      // Web browser download
      if (platform === "web") {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        link.click();
        return;
      }

      // Android / iOS installed app
      const base64Data = dataUrl.split(",")[1];

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: "QR Code",
        text: memberName ? `${memberName} QR Code` : "QR Code",
        url: savedFile.uri,
        dialogTitle: "Save or share QR Code",
      });
    } catch (error) {
      console.error("Failed to export QR image:", error);
      alert("Failed to save QR image.");
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