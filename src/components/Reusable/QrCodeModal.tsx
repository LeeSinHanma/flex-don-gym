import React, { useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { EmailComposer } from "capacitor-email-composer";
import * as htmlToImage from "html-to-image";
import QRCode from "react-qr-code";
import { Modal } from "./Modals";
import { Button } from "./Button";
import { getEmailPreset, formatEmailBody } from "../../logicHandlers/emailPresetHandler";
import "./QrCodeModal.css";

type QrCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  qrValue?: string;
  memberName?: string;
  memberEmail?: string;
  showEmailButton?: boolean;
  logoSrc: string;
  title?: string;
  downloadFileName?: string;
};

const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  qrValue,
  memberName,
  memberEmail,
  showEmailButton = true,
  logoSrc,
  title = "DONDON'S FITNESS GYM",
  downloadFileName = "member-qr",
}) => {
  const qrCardRef = useRef<HTMLDivElement | null>(null);

  const renderQrImage = async () => {
    if (!qrCardRef.current || !qrValue) return null;

    const node = qrCardRef.current;

    return await htmlToImage.toPng(node, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: "#ffffff",
      canvasWidth: node.offsetWidth,
      canvasHeight: node.offsetHeight,
    });
  };

  const handleDownloadQr = async () => {
    if (!qrCardRef.current || !qrValue) return;

    try {
      const dataUrl = await renderQrImage();
      if (!dataUrl) return;

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

  const handleEmailQr = async () => {
    if (!qrCardRef.current || !qrValue) return;

    try {
      const dataUrl = await renderQrImage();
      if (!dataUrl) return;

      const base64Data = dataUrl.split(",")[1];
      const fileName = `${downloadFileName}.png`;
      
      const emailPreset = getEmailPreset();
      const subject = emailPreset.subject;
      const body = formatEmailBody(emailPreset.bodyTemplate, memberName || "Member");

      if (Capacitor.getPlatform() === "web") {
        const toPart = memberEmail ? encodeURIComponent(memberEmail) : "";
        const mailto = `mailto:${toPart}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        return;
      }

      await EmailComposer.open({
        to: memberEmail ? [memberEmail] : undefined,
        subject,
        body,
        attachments: [
          {
            type: "base64",
            path: base64Data,
            name: fileName,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to open email composer:", error);
      alert("Failed to open email composer.");
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
          <div ref={qrCardRef} className="qrm-card">
            <div className="qrm-header">
              <img src={logoSrc} alt="Logo" className="qrm-logo" />
              <h2>{title}</h2>
              <div className="qrm-divider" />
            </div>

            <div className="qrm-code-wrapper">
              <QRCode value={qrValue} size={250} />
            </div>

            <p className="qrm-member-name">{memberName || "No Name"}</p>
          </div>

          <div className="form-actions">
            {showEmailButton && (
              <Button type="button" onClick={handleEmailQr}>
                Email QR
              </Button>
            )}

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
