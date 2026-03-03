// Modal.tsx
import "./Modals.css";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerImage?: React.ReactNode;
  showCloseButton?: boolean;
  closeText?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  headerImage,
  showCloseButton = true,
  closeText = "Close",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${className ?? ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {headerImage && <div className="modal-header-image">{headerImage}</div>}
        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-body">{children}</div>
        {showCloseButton && (
          <button className="modal-close-btn" onClick={onClose}>
            {closeText}
          </button>
        )}
      </div>
    </div>
  );
}
