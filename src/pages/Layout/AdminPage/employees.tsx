import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonModal,
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
  closeOutline,
  searchOutline,
  peopleOutline,
  banOutline,
} from "ionicons/icons";
import AdminHeader from "../../../components/admincomponents/Layout/header";
import { EmployeeCard } from "../../../components/admincomponents/cards";
import { EmployeeForm } from "../../../components/admincomponents/forms";
import { StatCard, EmptyStateCard } from "../../../components/Reusable/cards";
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
          <StatCard
            icon={peopleOutline}
            value={employees.length}
            label="Total Staff"
            type="primary"
          />
          <StatCard
            icon={peopleOutline}
            value={employees.filter((e) => e.status === "active").length}
            label="Active"
            type="success"
          />
          <StatCard
            icon={peopleOutline}
            value={employees.filter((e) => e.status === "on-leave").length}
            label="On Leave"
            type="warning"
          />
          <StatCard
            icon={banOutline}
            value={employees.filter((e) => e.status === "inactive").length}
            label="Inactive"
            type="primary"
            iconColor="#E74C3C"
          />
        </div>

        {/* Search Bar */}
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder="Search by name, role, or email"
          className="employee-search"
        />

        {/* Employee List */}
        <div className="employee-list-container">
          {filteredEmployees.length === 0 ? (
            <EmptyStateCard
              icon={searchOutline}
              message={
                searchText
                  ? "No employees found. Try adjusting your search terms."
                  : "No employees yet. Start by adding your first employee."
              }
            />
          ) : (
            filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={() => openEditModal(employee)}
                onDelete={() => handleDelete(employee.id)}
              />
            ))
          )}
        </div>

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
            <EmployeeForm formData={formData} onChange={setFormData} />

            <div className="modal-actions" style={{ padding: '16px' }}>
              <IonButton expand="block" color="medium" fill="outline" onClick={() => setShowModal(false)}>
                Cancel
              </IonButton>
              <IonButton expand="block" color="primary" onClick={handleSave}>
                {isEditing ? "Update" : "Add"} Employee
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Employees;