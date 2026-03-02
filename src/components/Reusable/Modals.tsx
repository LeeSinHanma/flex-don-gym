// Modal.tsx
import "./Modals.css";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
<<<<<<< HEAD
  headerImage?: React.ReactNode;
=======
  headerImage?: React.ReactNode; // 👈 add this

  // ✅ NEW (optional)
  showCloseButton?: boolean;   // default true
  closeText?: string;          // default "Close"
>>>>>>> 1b7599676d9ead8d7a4619ec1c2674009652a5e8
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
<<<<<<< HEAD
  headerImage,
=======
  headerImage, // 👈 add this
  showCloseButton = true,
  closeText = "Close",
>>>>>>> 1b7599676d9ead8d7a4619ec1c2674009652a5e8
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${className ?? ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {headerImage && <div className="modal-header-image">{headerImage}</div>}{" "}
        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-body">{children}</div>
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>

        {/* ✅ only show this when you want */}
        {showCloseButton && (
          <button className="modal-close-btn" onClick={onClose}>
            {closeText}
          </button>
        )}
      </div>
    </div>
  );
}
