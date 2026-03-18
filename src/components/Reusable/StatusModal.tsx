import React from "react";
import "./StatusModal.css";
import { Button } from "./Button";

interface StatusModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  title,
  message,
  type = "info",
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="status-modal-overlay">
      <div className={`status-modal-box ${type}`}>
        <h2 className="status-title">{title}</h2>
        <p className="status-message">{message}</p>

        <Button className="status-btn" onClick={onClose}>
          OK
        </Button>
      </div>
    </div>
  );
};

export default StatusModal;