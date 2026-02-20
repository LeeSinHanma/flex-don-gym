import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonBadge,
  IonIcon,
  IonButtons,
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
} from "@ionic/react";
import {
  addOutline,
  createOutline,
  trashOutline,
  closeOutline,
  searchOutline,
  peopleOutline,
  banOutline,
} from "ionicons/icons";
import AdminHeader from "../../components/admincomponents/Layout/header";
import "./common.css";
import "./employees.css";

interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  status: "active" | "inactive" | "on-leave";
  phone?: string;
  hireDate?: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "John Smith",
      role: "Manager",
      email: "john.smith@flexdongym.com",
      status: "active",
      phone: "+1 234-567-8901",
      hireDate: "2022-01-15",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Trainer",
      email: "sarah.j@flexdongym.com",
      status: "active",
      phone: "+1 234-567-8902",
      hireDate: "2022-03-20",
    },
    {
      id: 3,
      name: "Mike Davis",
      role: "Receptionist",
      email: "mike.d@flexdongym.com",
      status: "active",
      phone: "+1 234-567-8903",
      hireDate: "2023-06-10",
    },
    {
      id: 4,
      name: "Emily Brown",
      role: "Trainer",
      email: "emily.b@flexdongym.com",
      status: "on-leave",
      phone: "+1 234-567-8904",
      hireDate: "2021-11-05",
    },
    {
      id: 5,
      name: "Robert Wilson",
      role: "Maintenance",
      email: "robert.w@flexdongym.com",
      status: "inactive",
      phone: "+1 234-567-8905",
      hireDate: "2020-08-22",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [searchText, setSearchText] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    status: "active" as "active" | "inactive" | "on-leave",
    phone: "",
    hireDate: "",
  });

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: "", role: "", email: "", status: "active", phone: "", hireDate: "" });
    setShowModal(true);
  };

  const openEditModal = (employee: Employee) => {
    setIsEditing(true);
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name,
      role: employee.role,
      email: employee.email,
      status: employee.status,
      phone: employee.phone || "",
      hireDate: employee.hireDate || "",
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.role || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    if (isEditing && currentEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === currentEmployee.id ? { ...currentEmployee, ...formData } : emp
        )
      );
    } else {
      const newEmployee: Employee = {
        id: Math.max(...employees.map((e) => e.id)) + 1,
        ...formData,
      };
      setEmployees([...employees, newEmployee]);
    }

    setShowModal(false);
    setCurrentEmployee(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "danger";
      case "on-leave": return "warning";
      default: return "medium";
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage className="admin-page">
      <AdminHeader title="Employee Management" />

      <IonContent className="ion-padding">
        {/* Header Card */}
        <IonCard className="employee-header-card">
          <IonCardHeader>
            <div className="employee-header-content">
              <div>
                <IonCardTitle>Employee Management</IonCardTitle>
                <IonText color="medium">
                  <p className="employee-subtitle">
                    Manage staff accounts, roles, and status
                  </p>
                </IonText>
              </div>
              <IonButton onClick={openAddModal} color="primary">
                <IonIcon
                  slot="start"
                  icon={addOutline}
                  style={{ fontSize: "20px", color: "#ffffff", display: "block" }}
                />
                Add Employee
              </IonButton>
            </div>
          </IonCardHeader>
        </IonCard>

        {/* Stats Cards — Total, Active, On Leave, Inactive */}
        <div className="employee-stats">
          {/* Total Staff */}
          <IonCard className="stat-card">
            <IonCardContent>
              <div className="stat-icon-wrapper default">
                <IonIcon
                  icon={peopleOutline}
                  style={{ fontSize: "28px", color: "#1B2E4B", display: "block" }}
                />
              </div>
              <div className="stat-value">{employees.length}</div>
              <div className="stat-label">Total Staff</div>
            </IonCardContent>
          </IonCard>

          {/* Active */}
          <IonCard className="stat-card">
            <IonCardContent>
              <div className="stat-icon-wrapper success">
                <IonIcon
                  icon={peopleOutline}
                  style={{ fontSize: "28px", color: "#2ECC71", display: "block" }}
                />
              </div>
              <div className="stat-value">
                {employees.filter((e) => e.status === "active").length}
              </div>
              <div className="stat-label">Active</div>
            </IonCardContent>
          </IonCard>

          {/* On Leave */}
          <IonCard className="stat-card">
            <IonCardContent>
              <div className="stat-icon-wrapper warning">
                <IonIcon
                  icon={peopleOutline}
                  style={{ fontSize: "28px", color: "#F39C12", display: "block" }}
                />
              </div>
              <div className="stat-value">
                {employees.filter((e) => e.status === "on-leave").length}
              </div>
              <div className="stat-label">On Leave</div>
            </IonCardContent>
          </IonCard>

          {/* Inactive */}
          <IonCard className="stat-card">
            <IonCardContent>
              <div className="stat-icon-wrapper danger">
                <IonIcon
                  icon={banOutline}
                  style={{ fontSize: "28px", color: "#E74C3C", display: "block" }}
                />
              </div>
              <div className="stat-value">
                {employees.filter((e) => e.status === "inactive").length}
              </div>
              <div className="stat-label">Inactive</div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Search Bar */}
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder="Search by name, role, or email"
          className="employee-search"
        />

        {/* Employee List */}
        <IonCard className="employee-list-card">
          <IonList className="employee-list">
            {filteredEmployees.length === 0 ? (
              <div className="empty-state">
                <IonIcon
                  icon={searchOutline}
                  style={{ fontSize: "64px", color: "#adb5bd", display: "block", margin: "0 auto 16px" }}
                />
                <div className="empty-state-title">No employees found</div>
                <div className="empty-state-text">
                  {searchText
                    ? "Try adjusting your search terms"
                    : "Start by adding your first employee"}
                </div>
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <IonItem key={employee.id} className="employee-item">
                  <IonLabel>
                    <div className="employee-info">
                      <div className="employee-main">
                        <h2 className="employee-name">{employee.name}</h2>
                        <p className="employee-role">{employee.role}</p>
                      </div>
                      <div className="employee-contact">
                        <p className="employee-email">{employee.email}</p>
                        {employee.phone && (
                          <p className="employee-phone">{employee.phone}</p>
                        )}
                      </div>
                      <div className="employee-status-container">
                        <IonBadge color={getStatusColor(employee.status)}>
                          {employee.status.replace("-", " ").toUpperCase()}
                        </IonBadge>
                      </div>
                    </div>
                  </IonLabel>
                  <div className="employee-actions">
                    <IonButton fill="clear" color="primary" onClick={() => openEditModal(employee)}>
                      <IonIcon
                        slot="icon-only"
                        icon={createOutline}
                        style={{ fontSize: "20px", color: "#1B2E4B", display: "block" }}
                      />
                    </IonButton>
                    <IonButton fill="clear" color="danger" onClick={() => handleDelete(employee.id)}>
                      <IonIcon
                        slot="icon-only"
                        icon={trashOutline}
                        style={{ fontSize: "20px", color: "#E74C3C", display: "block" }}
                      />
                    </IonButton>
                  </div>
                </IonItem>
              ))
            )}
          </IonList>
        </IonCard>

        {/* Add/Edit Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{isEditing ? "Edit Employee" : "Add Employee"}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  <IonIcon
                    icon={closeOutline}
                    style={{ fontSize: "24px", color: "#ffffff", display: "block" }}
                  />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="employee-form">
              <IonItem>
                <IonLabel position="stacked">Name *</IonLabel>
                <IonInput
                  value={formData.name}
                  onIonInput={(e) => setFormData({ ...formData, name: e.detail.value! })}
                  placeholder="Enter employee name"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Role *</IonLabel>
                <IonSelect
                  value={formData.role}
                  onIonChange={(e) => setFormData({ ...formData, role: e.detail.value })}
                  placeholder="Select role"
                >
                  <IonSelectOption value="Manager">Manager</IonSelectOption>
                  <IonSelectOption value="Trainer">Trainer</IonSelectOption>
                  <IonSelectOption value="Receptionist">Receptionist</IonSelectOption>
                  <IonSelectOption value="Maintenance">Maintenance</IonSelectOption>
                  <IonSelectOption value="Cleaner">Cleaner</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Email *</IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonInput={(e) => setFormData({ ...formData, email: e.detail.value! })}
                  placeholder="employee@flexdongym.com"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Phone</IonLabel>
                <IonInput
                  type="tel"
                  value={formData.phone}
                  onIonInput={(e) => setFormData({ ...formData, phone: e.detail.value! })}
                  placeholder="+1 234-567-8900"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Status *</IonLabel>
                <IonSelect
                  value={formData.status}
                  onIonChange={(e) => setFormData({ ...formData, status: e.detail.value })}
                >
                  <IonSelectOption value="active">Active</IonSelectOption>
                  <IonSelectOption value="inactive">Inactive</IonSelectOption>
                  <IonSelectOption value="on-leave">On Leave</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Hire Date</IonLabel>
                <IonInput
                  type="date"
                  value={formData.hireDate}
                  onIonInput={(e) => setFormData({ ...formData, hireDate: e.detail.value! })}
                />
              </IonItem>

              <div className="modal-actions">
                <IonButton expand="block" color="medium" fill="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </IonButton>
                <IonButton expand="block" color="primary" onClick={handleSave}>
                  {isEditing ? "Update" : "Add"} Employee
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Employees;