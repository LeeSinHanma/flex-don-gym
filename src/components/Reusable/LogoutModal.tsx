import React from "react";
import { Modal } from "./Modals";
import { Button } from "./Button";
import { useHistory } from "react-router-dom";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("user");
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <Button
          className="btn-confirm"
          onClick={() => {
            handleLogout();
          }}
        >
          Yes
        </Button>

        <Button className="btn-cancel" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default LogoutModal;