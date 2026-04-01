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

export async function syncInventoryLocal(items: LocalInventoryItem[]) {
    try {
        await sqliteService.beginTransaction();

        // 1. Wipe existing data (Mirror strategy)
        await sqliteService.run(`DELETE FROM inventory_items`);

        // 2. Insert fresh data
        for (const item of items) {
            await sqliteService.run(
                `
          INSERT INTO inventory_items (
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

        await sqliteService.commitTransaction();
    } catch (error) {
        await sqliteService.rollbackTransaction();
        throw error;
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

export async function decrementLocalInventoryQuantity(itemId: string, quantity: number) {
    await sqliteService.run(
        `UPDATE inventory_items SET quantity = quantity - ? WHERE item_id = ?`,
        [quantity, itemId]
    );
}