import api from "../api/axios";
import axios from "axios";

export type APIResponse = any;

export type Member = {
  member_id: string;
  email: string;
  contact_number: string;
  first_name: string;
  last_name: string;
  membership_type: number;
  membership_plan_id: number;
  membership_expiry: string | null;
  credits: number;
  registered_by: string | number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateMemberPayload = {
  email: string;
  contact_number: string;
  first_name: string;
  last_name: string;
  membership_plan_id: number;
  credits: number;
  registered_by: string | number;
  payment_method: string;
  amount_given: number;
  amount_to_pay?: number;
  created_at: string;
  note: string;
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
  payload: CreateMemberPayload,
): Promise<APIResponse> {
  try {
    const res = await api.post<APIResponse>("/members/create", payload);
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ GET /members/all
export async function getMembers(): Promise<Member[]> {
  try {
    const res = await api.get<Member[]>("/members/all");
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ GET /members/search?name_query=...
export async function getMemberByName(name: string): Promise<Member[]> {
  try {
    const res = await api.get<Member[]>("/members/search", {
      params: {
        name_query: name,
      },
    });

    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ GET /members/by-id/{member_id}
export async function getMemberById(memberId: string): Promise<Member> {
  try {
    const res = await api.get<Member>(
      `/members/by-id/${encodeURIComponent(memberId)}`,
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ DELETE /members/delete/{member_id}
export async function deleteMember(memberId: string): Promise<APIResponse> {
  try {
    const res = await api.delete<APIResponse>(
      `/members/delete/${encodeURIComponent(memberId)}`,
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ PUT /members/update/{member_id}
export async function updateMember(
  member_id: string,
  payload: any,
): Promise<APIResponse> {
  try {
    const res = await api.put<APIResponse>(
      `/members/update/${encodeURIComponent(member_id)}`,
      payload,
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export type AddCreditPayload = {
  credits: number;
  transacted_by: string;
  payment_method: string;
  amount_given: number;
  note: string;
};

// ✅ POST /members/{member_id}/add-credit
export async function addMemberCredit(
  memberId: string,
  payload: AddCreditPayload,
): Promise<APIResponse> {
  try {
    const res = await api.post<APIResponse>(
      `/members/${encodeURIComponent(memberId)}/add-credit`,
      payload,
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}