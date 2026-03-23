import React from "react";
import { Modal } from "./Modals";
import { Button } from "./Button";
import { useHistory } from "react-router-dom";
import { logout } from "../../logicHandlers/userServices";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.replace("/");
  };

  return (
    <Modal
      className="modal-box"
      isOpen={isOpen}
      showCloseButton={false}
      title="Confirm Logout"
      onClose={onClose}
    >
      <p style={{ textAlign: "center", marginBottom: "20px" }}>
        Are you sure you want to logout?
      </p>

      <div className="modal-actions">
        <Button
          className="modal-action-btn modal-action-btn-primary"
          onClick={() => {
            handleLogout();
          }}
        >
          Yes
        </Button>

        <Button
          className="modal-action-btn modal-action-btn-danger"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default LogoutModal;
