import api from "../api/axios";
import axios from "axios";

// ✅ Type for creating
export type CreateInventoryItem = {
  item_id: string;
  item_name: string;
  description: string;
  price: number;
  quantity: number;
  added_by: string;
};

// ✅ Type for updating
export type UpdateInventoryItemInput = {
  item_name: string;
  description: string;
  price: number;
  quantity: number;
};

// ✅ Full type (returned from backend)
export type InventoryItem = CreateInventoryItem & {
  created_at: string;
  updated_at: string;
};

// ✅ POST /inventory-items/create
export async function createInventoryItem(
  item: CreateInventoryItem,
): Promise<InventoryItem> {
  try {
    const res = await api.post<InventoryItem>("/inventory-items/create", item);
    return res.data; // backend returns InventoryItem (with created_at, updated_at)
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ GET /inventory-items/
export async function getInventoryItems(): Promise<InventoryItem[]> {
  try {
    const res = await api.get<InventoryItem[]>("/inventory-items/");
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ PUT /inventory-items/update/{item_id}
export async function updateInventoryItem(
  itemId: string,
  item: UpdateInventoryItemInput,
): Promise<InventoryItem> {
  try {
    const res = await api.put<InventoryItem>(
      `/inventory-items/update/${itemId}`,
      item,
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

// ✅ DELETE /inventory-items/delete/{item_id}
export async function deleteInventoryItem(itemId: string): Promise<void> {
  try {
    await api.delete(`/inventory-items/delete/${itemId}`);
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = (err.response?.data as any)?.detail;
    return detail || err.message || "Request failed";
  }
  return "Unknown error";
}
