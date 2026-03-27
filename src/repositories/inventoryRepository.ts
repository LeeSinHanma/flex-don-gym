// src/repositories/inventoryRepository.ts
import { sqliteService } from "../localdb/sqliteService";

export interface LocalInventoryItem {
    item_id: string;
    item_name: string | null;
    description: string | null;
    price: number | null;
    quantity: number | null;
    added_by: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export async function upsertInventoryItems(items: LocalInventoryItem[]) {
    for (const item of items) {
        await sqliteService.run(
            `
      INSERT OR REPLACE INTO inventory_items (
        item_id,
        item_name,
        description,
        price,
        quantity,
        added_by,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
            [
                item.item_id,
                item.item_name,
                item.description,
                item.price,
                item.quantity,
                item.added_by,
                item.created_at,
                item.updated_at,
            ]
        );
    }
}

export async function getAllInventoryItems() {
    return sqliteService.query<LocalInventoryItem>(
        `SELECT * FROM inventory_items`
    );
}

export async function getLocalInventoryItemById(itemId: string) {
    const rows = await sqliteService.query<LocalInventoryItem>(
        `SELECT * FROM inventory_items WHERE item_id = ? LIMIT 1`,
        [itemId]
    );
    return rows[0] ?? null;
}