import api from "../api/axios";
import axios from "axios";

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role: number;
  access_list: string[];
  created_at: string;
  updated_at: string;
}

export type UpdateUserInput = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: number;
  is_active: boolean;
  access_list: string[];
};

export type APIResponse = any;

// ---------- Helpers ----------
function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = (err.response?.data as any)?.detail;
    return detail || err.message || "Request failed";
  }
  return "Unknown error";
}

// ✅ POST /users/login?username=...&password=...
export async function loginUser(
  username: string,
  password: string
): Promise<APIResponse> {
  try {
    const res = await api.post<APIResponse>("/users/login", null, {
      params: { username, password },
    });
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ GET /users/by-id/{user_id} ... get user by id
export async function getUserById(userId: string): Promise<User> {
  try {
    const res = await api.get<User>(`/users/by-id/${userId}`);
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ GET /users/all ... get all users
export async function getUsers(): Promise<User[]> {
  try {
    const res = await api.get<User[]>("/users/all");
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ POST /users/create ... creation of user (cashier/staffs)
export async function createUser(
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: number,
  accessList: string[],
  isActive: boolean = true
): Promise<APIResponse> {
  try {
    const payload = {
      username,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role,
      access_list: accessList,
      is_active: isActive,
    };
    console.log("📤 POST /users/create payload:", JSON.stringify(payload, null, 2));
    const res = await api.post<APIResponse>("/users/create", payload);

    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ POST /users/by-username/{username} ... get user role by username
export async function getUserType(username: string): Promise<number> {
  try {
    const res = await api.get<APIResponse>(
      `/users/by-username/${encodeURIComponent(username)}`
    );

    return res.data.role;
  } catch (err) {
    throw new Error("Failed to get user role");
  }
}

// ✅ PUT /users/update/{user_id}
export async function updateUser(
  userId: string,
  data: UpdateUserInput
): Promise<User> {
  try {
    console.log(`📤 PUT /users/update/${userId} payload:`, JSON.stringify(data, null, 2));
    const res = await api.put<User>(`/users/update/${userId}`, data);
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    await api.delete(`/users/delete/${userId}`);
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export async function getUserByUsername(username: string): Promise<User> {
  try {
    const res = await api.get<User>(
      `/users/by-username/${encodeURIComponent(username)}`
    );
    return res.data;
  } catch (err) {
    throw new Error("Failed to get user details");
  }
}

export const setCurrentUser = (userData: any) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("user");
};