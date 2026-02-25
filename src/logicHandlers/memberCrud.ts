import api from "../api/axios";
import axios from "axios";

export type APIResponse = any;

// ---------- Helpers ----------
function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = (err.response?.data as any)?.detail;
    return detail || err.message || "Request failed";
  }
  return "Unknown error";
}

// ---------- Services ----------

// ✅ POST /members/create  (JSON body)
export async function createMember(
  email: string,
  contact_number: string,
  first_name: string,
  last_name: string,
  membership_type: number,
  membership_plan_id: number,
  credits: number,
  registered_by: number,
): Promise<APIResponse> {
  try {
    const body = {
      email,
      contact_number,
      first_name,
      last_name,
      membership_type,
      membership_plan_id,
      credits,
      registered_by,
    };

    const res = await api.post<APIResponse>("/members/create", body);
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export {};
