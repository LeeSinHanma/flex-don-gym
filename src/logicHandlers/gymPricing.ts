import api from "../api/axios";

// ✅ TYPE
export interface GymPricing {
  id: number;
  base_day_pass_price: number;
  created_at: string | null;
  updated_at: string | null;
}

// ✅ GET /gym-pricing/
export async function getGymPricing(): Promise<GymPricing> {
  const res = await api.get("/gym-pricing/");
  return res.data;
}

// ✅ PUT /gym-pricing/update
export async function updateGymPricing(
  base_day_pass_price: number,
): Promise<GymPricing> {
  const res = await api.put("/gym-pricing/update", {
    base_day_pass_price,
  });

  return res.data;
}
