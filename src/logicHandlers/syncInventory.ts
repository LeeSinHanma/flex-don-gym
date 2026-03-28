// src/logicHandlers/syncInventory.ts
import { getInventoryItems, InventoryItem } from "./itemInvCrud";
import {
    upsertInventoryItems,
    LocalInventoryItem,
} from "../repositories/inventoryRepository";

export async function syncInventoryFromServer() {
    const apiItems: InventoryItem[] = await getInventoryItems();

    const mappedItems: LocalInventoryItem[] = apiItems.map((item) => ({
        item_id: item.item_id,
        item_name: item.item_name ?? null,
        description: item.description ?? null,
        price: item.price ?? 0,
        quantity: item.quantity ?? 0,
        added_by:
            item.added_by !== null && item.added_by !== undefined
                ? String(item.added_by)
                : null,
        created_at: item.created_at ?? null,
        updated_at: item.updated_at ?? null,
    }));

    await upsertInventoryItems(mappedItems);

    return mappedItems.length;
}