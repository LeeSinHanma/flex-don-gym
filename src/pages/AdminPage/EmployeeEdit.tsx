import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { Modal } from "../../components/Reusable/Modals";
import "./ManageStatusMem.css";

import { getUserById, updateUser } from "../../logicHandlers/userCrud";

interface RouteParams {
  userId: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role: number | string;
  created_at: string;
  updated_at: string;
}

const EmployeeEdit: React.FC = () => {
  const history = useHistory();
  const { userId } = useParams<RouteParams>();

  const [employee, setEmployee] = useState<User | null>(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editRole, setEditRole] = useState<number>(1);
  const [editIsActive, setEditIsActive] = useState(true);

  const getRoleName = (role: number | string) => {
    switch (role) {
      case 0:
      case "0":
        return "Admin";
      case 1:
      case "1":
        return "Employee";
      default:
        return String(role);
    }
  };

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await getUserById(userId);
        setEmployee(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadEmployee();
  }, [userId]);

  useEffect(() => {
    if (employee) {
      setEditUsername(employee.username);
      setEditEmail(employee.email);
      setEditFirstName(employee.first_name);
      setEditLastName(employee.last_name);
      setEditRole(Number(employee.role));
      setEditIsActive(employee.is_active);
    }
  }, [employee]);

  const handleUpdate = async () => {
    if (!employee) return;

    try {
      const updatedUser = await updateUser(employee.id, {
        username: editUsername,
        email: editEmail,
        first_name: editFirstName,
        last_name: editLastName,
        role: editRole,
        is_active: editIsActive,
      });

      setEmployee(updatedUser);
      setShowUpdateModal(false);
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!employee) return;

    try {
      console.log("Deleting user with ID:", employee.id);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="manage-member-container">
      <div className="main-container">
        <div className="status-top-header">
          <BackButton
            className="btn status-btn-back"
            onClick={() => history.push("/employee-page")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>
          <h2>Edit Employee</h2>
        </div>

        <div className="member-container member-container-employee">
          <div className="member-info">
            <h2 className="member-name">
              {employee
                ? `${employee.first_name} ${employee.last_name}`
                : "Loading..."}
            </h2>

            <div className="member-details member-details-employee">
              <h4>
                <strong>Name:</strong>{" "}
                {employee
                  ? `${employee.first_name} ${employee.last_name}`
                  : "Loading..."}
              </h4>
              <h4>
                <strong>Username:</strong> {employee?.username || "Loading..."}
              </h4>
              <h4>
                <strong>Role:</strong>{" "}
                {employee ? getRoleName(employee.role) : "Loading..."}
              </h4>
            </div>
          </div>
        </div>

        <div className="status-button-container">
          <div className="status-button">
            <Button
              type="button"
              className="renew-btn"
              onClick={() => setShowUpdateModal(true)}
            >
              Update
            </Button>

            <Button
              type="button"
              className="cancel-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <Modal
        className="modal-box"
        isOpen={showUpdateModal}
        title="Update Employee"
        showCloseButton={false}
        onClose={() => setShowUpdateModal(false)}
      >
        <div className="employee-form">
          <div className="form-group">
            <label>Username</label>
            <input
              className="employee-input"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="employee-input"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input
              className="employee-input"
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              className="employee-input"
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              className="employee-input"
              value={editRole}
              onChange={(e) => setEditRole(Number(e.target.value))}
            >
              <option value={0}>Admin</option>
              <option value={1}>Employee</option>
            </select>
          </div>

          <div className="form-group">
            <label>Active</label>
            <select
              className="employee-input"
              value={editIsActive ? "true" : "false"}
              onChange={(e) => setEditIsActive(e.target.value === "true")}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 10 }}>
            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={handleUpdate}
            >
              Update
            </Button>

            <Button
              type="button"
              className="cancel-btn"
              onClick={() => setShowUpdateModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        showCloseButton={false}
        className="confirm-modal"
      >
        <p>Are you sure you want to delete this employee?</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <Button
            type="button"
            className="renew-btn"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>

          <Button type="button" className="cancel-btn" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          history.push("/employee");
        }}
        showCloseButton={false}
        title="Employee Deleted"
      >
        <p style={{ textAlign: "center" }}>
          The employee has been successfully deleted.
        </p>

        <div className="success-actions">
          <Button
            type="button"
            className="renew-btn"
            onClick={() => {
              setShowSuccessModal(false);
              history.push("/employee");
            }}
          >
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeEdit;
