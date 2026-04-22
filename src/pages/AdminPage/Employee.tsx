import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Reusable/Button";
import { BackButton } from "../../components/Reusable/BackButton";
import { Modal } from "../../components/Reusable/Modals";
import { UsernameInput } from "../../components/Reusable/Username";
import { PasswordInput } from "../../components/Reusable/Password";
import { useHistory } from "react-router-dom";
import { IonIcon, IonSkeletonText } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import Menu from "../../components/Reusable/Menu";
import ConfirmModal from "../../components/Reusable/ConfirmModal";
import StatusModal from "../../components/Reusable/StatusModal";
import "./AdminDashboard.css";
import "./Employee.css";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

import {
  createUser,
  getUsers,
  getCurrentUser,
  User,
} from "../../logicHandlers/userServices";

const EmployeeMenu: React.FC = () => {
  const history = useHistory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { isOffline } = useNetworkStatus();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [access, setAccess] = useState<string[]>([]);

  // Modals state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAccessChange = (value: string) => {
    setAccess((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  useEffect(() => {
    if (role === 0) {
      setAccess(accessOptions.map((opt) => opt.value));
    }
  }, [role]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();
    const currentUser = getCurrentUser();

    let result = users;

    // Hide the logged-in user's own account
    if (currentUser?.userID) {
      result = result.filter((u) => u.id !== currentUser.userID);
    }

    if (!term) return result;

    return result.filter((u) => {
      const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
      return (
        fullName.includes(term) ||
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  const handleAddEmployee = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setRole(1);
    setIsActive(true);
    setAccess([]);
  };

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

  const handleSubmit = () => {
    if (!username || !email || !password || !confirmPassword || !firstName || !lastName) {
      openStatusModal(
        "Missing Fields",
        "Please fill in all fields.",
        "warning",
      );
      return;
    }

    if (password !== confirmPassword) {
      openStatusModal(
        "Password Mismatch",
        "Passwords do not match.",
        "warning",
      );
      return;
    }

    if (role === 1 && access.length === 0) {
      openStatusModal(
        "Missing Access",
        "Please select at least one access.",
        "warning",
      );
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmCreate = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      await createUser(
        username,
        email,
        password,
        firstName,
        lastName,
        role,
        access,
        isActive,
      );

      await loadUsers();
      handleCloseModal();
      openStatusModal("Success", "Employee created successfully.", "success");
    } catch (error: any) {
      console.error("Failed to create user:", error);
      openStatusModal(
        "Error",
        error.message || "Failed to create user.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="main-container">
        <div className="admin-top-header">
          <BackButton
            className="btn"
            type="button"
            onClick={() => history.push("/admin-dashboard")}
          >
            <IonIcon icon={arrowBack} />
          </BackButton>

          <h1>Employee</h1>
          <IonIcon
            icon={menu}
            className="menu-icon"
            onClick={handleMenuClick}
          />
        </div>

        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search employee"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isOffline && (
          <div className="offline-notice-container">
            <p className="offline-notice-text">
              Offline Mode: Actions are currently restricted.
            </p>
          </div>
        )}

        <div className="cards-container">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="status-card">
                <div className="status-info">
                  <div className="left-info">
                    <h2 className="client-name">
                      <IonSkeletonText animated style={{ width: "60%" }} />
                    </h2>
                    <div className="client-details">
                      <p className="client-type">
                        <IonSkeletonText animated style={{ width: "40%" }} />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="client-status">
                  <IonSkeletonText animated style={{ width: "50px" }} />
                </div>
              </div>
            ))
          ) : filteredUsers.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              {isOffline ? "Currently Offline" : "No users found."}
            </p>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                className={`status-card ${isOffline ? "disabled-card" : ""}`}
                onClick={() =>
                  !isOffline && history.push(`/employee/edit/${u.id}`)
                }
              >
                <div className="status-info">
                  <div className="left-info">
                    <h2 className="client-name">
                      {u.first_name} {u.last_name}
                    </h2>
                    <div className="client-details">
                      <p className="client-type">{u.id}</p>
                    </div>
                  </div>
                </div>
                <div className="client-status">
                  {u.role === 0 ? "Admin" : "Employee"}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bottom-container">
          <Button
            className="btn btn-submit"
            type="button"
            onClick={handleAddEmployee}
            disabled={isOffline}
          >
            Add employee
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Employee"
        showCloseButton={false}
      >
        <div className="employee-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <UsernameInput
              id="username"
              className="employee-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <UsernameInput
              id="email"
              className="employee-input"
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="first-name">First Name</label>
            <UsernameInput
              id="first-name"
              className="employee-input"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="last-name">Last Name</label>
            <UsernameInput
              id="last-name"
              className="employee-input"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <PasswordInput
              id="password"
              className="employee-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <PasswordInput
              id="confirm-password"
              className="employee-input"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              className="employee-input"
              value={role}
              onChange={(e) => setRole(Number(e.target.value))}
            >
              <option value={0}>Admin</option>
              <option value={1}>Employee</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              className="employee-input"
              value={isActive ? "true" : "false"}
              onChange={(e) => setIsActive(e.target.value === "true")}
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
                    checked={access.includes(item.value)}
                    onChange={() => handleAccessChange(item.value)}
                  />
                  <span className="access-slider"></span>
                  <span className="access-text">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <Button
              className="btn-modal btn-submit-modal"
              onClick={handleSubmit}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <Menu isOpen={isMenuOpen} onClose={handleCloseMenu} />

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirm Creation"
        message={`Are you sure you want to create employee ${firstName} ${lastName}?`}
        confirmText="Create"
        cancelText="Cancel"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmCreate}
        loading={isSubmitting}
      />

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={statusTitle}
        message={statusMessage}
        type={statusType}
      />
    </div>
  );
};

export default EmployeeMenu;
