import api from "../api/axios";
import axios from "axios";

export type APIResponse = any;

export type Member = {
  member_id: string;
  email: string;
  contact_number: string;
  first_name: string;
  last_name: string;
  membership_type: number; // 0 = Member, 1 = Casual (based on your data)
  membership_plan_id: number;
  membership_expiry: string | null;
  credits: number;
  registered_by: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// ---------- Helpers ----------
function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = (err.response?.data as any)?.detail;
    return detail || err.message || "Request failed";
  }
  return "Unknown error";
}

// ✅ POST /members/create
export async function createMember(
  email: string,
  contact_number: string,
  first_name: string,
  last_name: string,
  membership_type: number,
  membership_plan_id: number,
  credits: number,
  registered_by: number
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

// ✅ GET /members/all  (returns Member[])
export async function getMembers(): Promise<Member[]> {
  try {
    const res = await api.get<Member[]>("/members/all");
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ GET /members/by-id/{member_id}  (returns Member[])
export async function getMemberById(memberId: string): Promise<Member> {
  try {
    const res = await api.get<Member>(`/members/by-id/${memberId}`);
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ DELETE /members/delete/{member_id}
export async function deleteMember(memberId: string): Promise<APIResponse> {
  try {
    const res = await api.delete<APIResponse>(
      `/members/delete/${memberId}`
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ UPDATE /members/update/{member_id}
export async function updateMember(member_id: string, payload: any) {
  const res = await api.put(
    `/members/update/${encodeURIComponent(member_id)}`,
    payload
  );

  return res.data;
}