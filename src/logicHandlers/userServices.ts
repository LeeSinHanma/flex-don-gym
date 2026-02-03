import api from "../api/axios";
import axios from "axios";

export type LoginResponse = any;

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
export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  try {
    const res = await api.post<LoginResponse>("/users/login", null, {
      params: { username, password },
    });
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ POST /users/create ... creation of user(cashier/staffs)
export async function createUser(username: string, email: string,password: string, firstName: string, lastName: string, role: number): Promise<LoginResponse> {
  try {
    const res = await api.post<LoginResponse>("/users/create", null, {
      params: { username, email, password, firstName, lastName, role},
    });
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}