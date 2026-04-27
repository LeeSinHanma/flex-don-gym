import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { IonIcon, IonSkeletonText } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import Menu from "../../components/Reusable/Menu";
import useResponsiveView from "../../hooks/useResponsiveView";
import { Modal } from "../../components/Reusable/Modals";
import StatusModal from "../../components/Reusable/StatusModal";
import ConfirmModal from "../../components/Reusable/ConfirmModal";
import { UsernameInput } from "../../components/Reusable/Username";
import "./ManageStatusMem.css";

import {
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  getCurrentUser,
  User,
} from "../../logicHandlers/userServices";

interface RouteParams {
  userId: string;
}

const EmployeeEdit: React.FC = () => {
  const history = useHistory();
  const { userId } = useParams<RouteParams>();
  const isMobileView = useResponsiveView();
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);

  const [employee, setEmployee] = useState<User | null>(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmType, setConfirmType] = useState<
    "update" | "delete" | "password" | null
  >(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editRole, setEditRole] = useState<number>(1);
  const [editIsActive, setEditIsActive] = useState(true);
  const [editAccess, setEditAccess] = useState<string[]>([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 0 || currentUser?.userType === 0;

  const accessOptions = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Employee Edit", value: "employees" },
    { label: "Products Edit", value: "products" },
    { label: "Membership Plan", value: "membership-plans" },
    { label: "Transactions", value: "transactions" },
    { label: "QR Scanner", value: "qr-scanner" },
    { label: "POS", value: "pos" },
    { label: "Members Page", value: "status" },
  ];

  const openStatusModal = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
  ) => {
    setStatusTitle(title);
    setStatusMessage(message);
    setStatusType(type);
    setShowStatusModal(true);
  };

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

  const handleEditAccessChange = (value: string) => {
    setEditAccess((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  useEffect(() => {
    if (editRole === 0) {
      setEditAccess(accessOptions.map((opt) => opt.value));
    }
  }, [editRole]);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);
        const data = await getUserById(userId);
        setEmployee(data);
      } catch (error) {
        console.error("Failed to load employee:", error);
      } finally {
        setLoading(false);
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
      setEditAccess(employee.access_list || []);
    }
  }, [employee]);

  const handleUpdate = async () => {
    if (!employee) return;

    setIsSubmitting(true);
    try {
      const updatedUser = await updateUser(employee.id, {
        username: editUsername,
        email: editEmail,
        first_name: editFirstName,
        last_name: editLastName,
        role: editRole,
        is_active: editIsActive,
        access_list: editAccess,
      });

      setEmployee(updatedUser);
      setEditAccess(updatedUser.access_list || editAccess);
      setShowUpdateModal(false);

      openStatusModal(
        "Update Successful",
        "Employee details were updated successfully.",
        "success",
      );
    } catch (error) {
      console.error("Failed to update employee:", error);
      openStatusModal("Update Failed", "Failed to update employee.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!employee) return;

    setIsSubmitting(true);
    try {
      console.log("Deleting user with ID:", employee.id);

      await deleteUser(employee.id);

      setShouldRedirect(true);

      openStatusModal(
        "Delete Successful",
        "Employee was deleted successfully.",
        "success",
      );
    } catch (error) {
      console.error("Failed to delete employee:", error);
      openStatusModal("Delete Failed", "Failed to delete employee.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!employee) return;

    if (!newPassword || !confirmNewPassword) {
      openStatusModal(
        "Validation Error",
        "Please fill in both password fields.",
        "warning",
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      openStatusModal(
        "Validation Error",
        "Passwords do not match.",
        "warning",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(employee.id, newPassword);

      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmNewPassword("");

      openStatusModal(
        "Password Updated",
        "Employee password has been updated successfully.",
        "success",
      );
    } catch (error) {
      console.error("Failed to change password:", error);
      openStatusModal(
        "Update Failed",
        "Failed to update employee password.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = async () => {
    setShowConfirmModal(false);

    if (confirmType === "update") {
      await handleUpdate();
    }

    if (confirmType === "delete") {
      await handleDelete();
    }

    if (confirmType === "password") {
      await handleChangePassword();
    }

    setConfirmType(null);
  };

  return (
    <>
      <Menu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
      />
      <div className="manage-member-container">
      <div className="main-container">
        <div className="admin-top-header">
          <BackButton
            className="btn"
            onClick={() => history.push("/employee-page")}
          >
            <IonIcon icon={arrowBack} />
          </BackButton>
          <h2>Edit Employee</h2>
          {isMobileView && (
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowEmployeeMenu(true)}
              aria-label="Open menu"
            >
              <IonIcon icon={menu} />
            </button>
          )}
        </div>

        <div className="member-container member-container-employee">
          <div className="member-info">
            <h2 className="member-name">
              {loading ? (
                <IonSkeletonText animated style={{ width: "150px" }} />
              ) : (
                `${employee?.first_name} ${employee?.last_name}`
              )}
            </h2>

            <div className="member-details member-details-employee">
              {loading ? (
                <>
                  <h4>
                    <IonSkeletonText animated style={{ width: "60%" }} />
                  </h4>
                  <h4>
                    <IonSkeletonText animated style={{ width: "60%" }} />
                  </h4>
                  <h4>
                    <IonSkeletonText animated style={{ width: "50%" }} />
                  </h4>
                  <h4>
                    <IonSkeletonText animated style={{ width: "40%" }} />
                  </h4>
                </>
              ) : (
                <>
                  <h4>
                    <strong>ID:</strong> {employee?.id}
                  </h4>
                  <h4>
                    <strong>Name:</strong> {employee?.first_name}{" "}
                    {employee?.last_name}
                  </h4>
                  <h4>
                    <strong>Username:</strong> {employee?.username}
                  </h4>
                  <h4>
                    <strong>Role:</strong>{" "}
                    {employee ? getRoleName(employee.role) : ""}
                  </h4>
                </>
              )}
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

            {isAdmin && (
              <Button
                type="button"
                className="edit-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            )}

            <Button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setConfirmType("delete");
                setShowConfirmModal(true);
              }}
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
            <UsernameInput
              className="employee-input"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <UsernameInput
              className="employee-input"
              value={editEmail}
              type="email"
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>First Name</label>
            <UsernameInput
              className="employee-input"
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <UsernameInput
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

          <div className="form-group">
            <label>Access</label>

            <div className="access-group">
              {accessOptions.map((item) => (
                <label key={item.value} className="access-toggle">
                  <input
                    type="checkbox"
                    checked={editAccess.includes(item.value)}
                    onChange={() => handleEditAccessChange(item.value)}
                  />
                  <span className="access-slider"></span>
                  <span className="access-text">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 10 }}>
            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={() => {
                setShowUpdateModal(false);
                setConfirmType("update");
                setShowConfirmModal(true);
              }}
            >
              Update
            </Button>

            <Button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowUpdateModal(false);
                openStatusModal(
                  "Update Cancelled",
                  "Employee update was cancelled.",
                  "info",
                );
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        className="modal-box"
        isOpen={showPasswordModal}
        title="Change Password"
        showCloseButton={false}
        onClose={() => setShowPasswordModal(false)}
      >
        <div className="employee-form">
          <div className="form-group">
            <label>New Password</label>
            <UsernameInput
              className="employee-input"
              value={newPassword}
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <UsernameInput
              className="employee-input"
              value={confirmNewPassword}
              type="password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>

          <div className="form-actions" style={{ display: "flex", gap: 10 }}>
            <Button
              type="button"
              className="btn-modal btn-submit-modal"
              onClick={() => {
                if (newPassword !== confirmNewPassword) {
                  openStatusModal(
                    "Validation Error",
                    "Passwords do not match.",
                    "warning",
                  );
                  return;
                }
                if (!newPassword) {
                  openStatusModal(
                    "Validation Error",
                    "Password cannot be empty.",
                    "warning",
                  );
                  return;
                }
                setShowPasswordModal(false);
                setConfirmType("password");
                setShowConfirmModal(true);
              }}
            >
              Update Password
            </Button>

            <Button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowPasswordModal(false);
                setNewPassword("");
                setConfirmNewPassword("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmModal}
        title={
          confirmType === "update"
            ? "Confirm Update"
            : confirmType === "delete"
              ? "Confirm Delete"
              : "Confirm Password Change"
        }
        message={
          confirmType === "update"
            ? "Are you sure you want to update this employee?"
            : confirmType === "delete"
              ? "Are you sure you want to delete this employee?"
              : "Are you sure you want to change the password for this employee?"
        }
        confirmText={
          confirmType === "update"
            ? "Update"
            : confirmType === "delete"
              ? "Delete"
              : "Change Password"
        }
        cancelText="Cancel"
        onCancel={() => {
          setShowConfirmModal(false);

          if (confirmType === "update") {
            openStatusModal(
              "Update Cancelled",
              "Employee update was cancelled.",
              "info",
            );
          }

          if (confirmType === "delete") {
            openStatusModal(
              "Delete Cancelled",
              "Employee deletion was cancelled.",
              "info",
            );
          }

          setConfirmType(null);
        }}
        onConfirm={handleConfirmAction}
        loading={isSubmitting}
      />

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);

          if (shouldRedirect) {
            setShouldRedirect(false);
            history.push("/employee-page");
          }
        }}
        title={statusTitle}
        message={statusMessage}
        type={statusType}
      />
    </div>
  </>
  );
};

export default EmployeeEdit;
