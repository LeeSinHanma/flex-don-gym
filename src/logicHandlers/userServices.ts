import api from "../api/axios";
import axios from "axios";

export type APIResponse = any;

// ---------- Helpers ----------
function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    // FastAPI often uses { detail: "..." }
    const detail = (err.response?.data as any)?.detail;
    return detail || err.message || "Request failed";
  }
  return "Unknown error";
}

// ---------- Services ----------

// ✅ POST /users/login?username=...&password=...
export async function loginUser(username: string, password: string): Promise<APIResponse> {
  try {
    const res = await api.post<APIResponse>("/users/login", null, {
      params: { username, password },
    });
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ POST /users/create ... creation of user(cashier/staffs)
export async function createUser(username: string, email: string,password: string, firstName: string, lastName: string, role: number): Promise<APIResponse> {
  try {
    const res = await api.post<APIResponse>("/users/create", null, {
      params: { username, email, password, firstName, lastName, role},
    });
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
