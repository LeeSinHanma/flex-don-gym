import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Reusable/Button";
import { Modal } from "../../components/Reusable/Modals";
import { UsernameInput } from "../../components/Reusable/Username";
import { PasswordInput } from "../../components/Reusable/Password";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { menuOutline } from "ionicons/icons";
import "./AdminDashboard.css";
import "./Employee.css";

import { createUser, getUsers, User } from "../../logicHandlers/userCrud";

const EmployeeMenu: React.FC = () => {
  const history = useHistory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<number>(1);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return users;

    return users.filter((u) => {
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
    setFirstName("");
    setLastName("");
    setRole(1);
  };

  const handleSubmit = async () => {
    try {
      await createUser(username, email, password, firstName, lastName, role);
      await loadUsers();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="main-container">
        <div className="admin-top-header">
          <h1>Employee</h1>
          <IonIcon
            icon={menuOutline}
            className="menu-icon"
            onClick={() => history.push("/admin-dashboard")}
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

        <div className="cards-container">
          {filteredUsers.length === 0 && (
            <p style={{ textAlign: "center" }}>No users found.</p>
          )}

          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="status-card"
              onClick={() => history.push(`/employee/${u.id}`)}
            >
              <div className="status-info">
                <div className="left-info">
                  <h2 className="client-name">
                    {u.first_name} {u.last_name}
                  </h2>

                  <div className="client-details">
                    <p className="client-type">{u.username}</p>
                  </div>
                </div>
              </div>

              <div className="client-status">
                {u.role === 0 ? "Admin" : "User"}
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-container">
          <Button
            className="btn btn-submit"
            type="button"
            onClick={handleAddEmployee}
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
            <label htmlFor="role">Role</label>
            <select
              id="role"
              className="employee-input"
              value={role}
              onChange={(e) => setRole(Number(e.target.value))}
            >
              <option value={0}>Admin</option>
              <option value={1}>User</option>
            </select>
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
    </div>
  );
};

export default EmployeeMenu;
