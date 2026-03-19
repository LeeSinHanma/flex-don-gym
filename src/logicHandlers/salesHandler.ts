import api from "../api/axios";

export interface SaleItem {
  sale_item_id: number;
  sale_id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface SaleResponse {
  sale_id: string;
  sold_by: string;
  total_price: number;
  payment_method: string;
  amount_given: number;
  change: number;
  items: SaleItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateSaleItemPayload {
  item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
}

export interface CreateSalePayload {
  sold_by: string;
  payment_method: string;
  amount_given: number;
  items: CreateSaleItemPayload[];
}

// ✅ CREATE /sales/create
export async function createSale(payload: CreateSalePayload) {
  const res = await api.post("/sales/create", payload);
  return res.data;
}

// ✅ GET /sales/by-id/{sale_id}
export async function getSaleById(sale_id: string): Promise<SaleResponse> {
  const res = await api.get(`/sales/by-id/${encodeURIComponent(sale_id)}`);
  return res.data;
}

// ✅ GET /sales/all
export async function getAllSales(): Promise<SaleResponse[]> {
  const res = await api.get("/sales/all");
  return res.data;
}

// ✅ GET /sales/by-sold-by/{sold_by}
export async function getSalesBySoldBy(
  sold_by: string
): Promise<SaleResponse[]> {
  const res = await api.get(
    `/sales/by-sold-by/${encodeURIComponent(sold_by)}`
  );
  return res.data;
}

// ✅ DELETE /sales/delete/{sale_id}
export async function deleteSale(sale_id: string) {
  const res = await api.delete(`/sales/delete/${encodeURIComponent(sale_id)}`);
  return res.data;
}