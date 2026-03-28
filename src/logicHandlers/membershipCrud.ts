import api from "../api/axios";

export interface MembershipTypeResponse {
  membership_id: number;
  name: string | null;
  type: number | null;
  price: number | null;
  discount_amount: number | null;
  duration_months: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface APIResponse {
  success: boolean;
  message: string;
}

// ✅ POST /membership-types/create
export const createMembershipType = async (
  membership: Omit<MembershipTypeResponse, 'membership_id' | 'created_at' | 'updated_at'>
): Promise<APIResponse> => {
  const res = await api.post<APIResponse>(
    "/membership-types/create",
    membership
  );

  return res.data;
};

// ✅ GET /membership-types/ (all membership types)
export const getMembershipTypes = async (): Promise<MembershipTypeResponse[]> => {
  const res = await api.get<MembershipTypeResponse[]>("/membership-types/");
  return res.data;
};

// ✅ GET /membership-types/{membership_id} (specific membership type)
export const getMembershipTypeById = async (
  membership_id: number
): Promise<MembershipTypeResponse> => {
  const res = await api.get<MembershipTypeResponse>(
    `/membership-types/${membership_id}`
  );

  return res.data;
};

// ✅ GET /membership-types/by-type/{type_id}
export const getMembershipTypesByType = async (
  type_id: number
): Promise<MembershipTypeResponse[]> => {
  const res = await api.get<MembershipTypeResponse[]>(
    `/membership-types/by-type/${type_id}`
  );

  return res.data;
};

// ✅ PUT /membership-types/update/{membership_id}
export const updateMembershipType = async (
  membershipId: number,
  payload: {
    name: string;
    type: number;
    price: number;
    discount_amount: number;
    duration_months: number;
  }
): Promise<APIResponse> => {
  const res = await api.put<APIResponse>(
    `/membership-types/update/${membershipId}`,
    payload
  );

  return res.data;
};

// ✅ DELETE /membership-types/delete/{membership_id}
export const deleteMembershipType = async (
  membershipId: number
): Promise<APIResponse> => {
  const res = await api.delete<APIResponse>(
    `/membership-types/delete/${membershipId}`
  );

  return res.data;
};