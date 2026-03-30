// src/repositories/salesRepository.ts
import { sqliteService } from "../localdb/sqliteService";
import { CreateSalePayload } from "../logicHandlers/salesHandler";
import { decrementLocalInventoryQuantity } from "./inventoryRepository";

export async function saveOfflineSale(payload: CreateSalePayload, temporaryId: string) {
    // 1. Save main sale
    await sqliteService.run(
        `INSERT INTO offline_sales (
      sale_id,
      sold_by,
      total_price,
      payment_method,
      amount_given,
      created_at,
      synced
    ) VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [
            temporaryId,
            payload.sold_by,
            payload.items.reduce((sum, i) => sum + (i.unit_price * i.quantity), 0),
            payload.payment_method,
            payload.amount_given,
            new Date().toISOString()
        ]
    );

    // 2. Save items and decrement quantities
    for (const item of payload.items) {
        await sqliteService.run(
            `INSERT INTO offline_sale_items (
        sale_id,
        item_id,
        item_name,
        quantity,
        unit_price
      ) VALUES (?, ?, ?, ?, ?)`,
            [
                temporaryId,
                item.item_id,
                item.item_name,
                item.quantity,
                item.unit_price
            ]
        );

        // Update local inventory (offline consistency)
        await decrementLocalInventoryQuantity(item.item_id, item.quantity);
    }

    return temporaryId;
}

export async function getOfflineSales() {
    return sqliteService.query<any>(`SELECT * FROM offline_sales WHERE synced = 0`);
}
