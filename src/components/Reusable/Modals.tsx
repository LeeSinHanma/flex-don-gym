interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerImage?: React.ReactNode; // 👈 add this
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  headerImage, // 👈 add this
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${className ?? ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {headerImage && <div className="modal-header-image">{headerImage}</div>}{" "}
        {/* 👈 add this */}
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
