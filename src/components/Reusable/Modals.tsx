// Modal.tsx
import "./Modals.css";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;

  // ✅ NEW (optional)
  showCloseButton?: boolean;   // default true
  closeText?: string;          // default "Close"
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
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
        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-body">{children}</div>

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