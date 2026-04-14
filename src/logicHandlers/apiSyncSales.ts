import api from "../api/axios";
import axios from "axios";

// Types (optional but recommended)
export interface SaleItem {
  item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
}

export interface SalePayload {
  sold_by: string;
  payment_method: string;
  amount_given: number;
  items: SaleItem[];
}

export interface SaleSyncRequest {
  idempotency_key: string;
  payload: SalePayload;
}

// ✅ Method
export const syncSales = async (sales: SaleSyncRequest[]) => {
  try {
    const response = await api.post(
      `/on-sync/sales`,
      sales
    );

    return response.data;
  } catch (error: any) {
    console.error("Error syncing sales:", error);
    throw error;
  }
};