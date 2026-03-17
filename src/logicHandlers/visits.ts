import api from "../api/axios";

// Request body
export type ScanVisitInput = {
  member_id: string;
  direction: "inbound" | "outbound";
};

// Visit object
export type Visit = {
  visit_id: number;
  member_id: string;
  direction: string;
  access_granted: boolean;
  denial_reason: string;
  amount_paid: number;
  created_at: string;
};

// Full response
export type ScanVisitResponse = {
  visit: Visit;
  member_name: string;
  membership_type: number;
  message: string;
};

// POST /visits/scan
export async function scanVisit(
  data: ScanVisitInput,
): Promise<ScanVisitResponse> {
  try {
    const response = await api.post<ScanVisitResponse>("/visits/scan", data);
    return response.data;
  } catch (error) {
    console.error("Error scanning visit:", error);
    throw error;
  }
}

// ✅ GET /visits/member/{member_id}
export async function getVisitsByMemberId(member_id: string): Promise<Visit[]> {
  const res = await api.get(`/visits/member/${encodeURIComponent(member_id)}`);
  return res.data;
}