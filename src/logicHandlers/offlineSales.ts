// src/logicHandlers/offlineSales.ts
import { CreateSalePayload } from "./salesHandler";
import { saveOfflineSale } from "../repositories/salesRepository";
import { addPendingSync } from "../repositories/visitRepository";

export async function processSaleOffline(payload: CreateSalePayload) {
    const temporaryId = `OFFLINE-SALE-${Math.random()
        .toString(36)
        .substring(2, 9)
        .toUpperCase()}`;

    // 1. Save to local tables
    await saveOfflineSale(payload, temporaryId);

    // 2. Add to pending sync queue
    await addPendingSync({
        entity_type: "sale",
        action_type: "create",
        payload_json: JSON.stringify(payload),
        created_at: new Date().toISOString(),
    });

    return {
        success: true,
        sale_id: temporaryId,
    };
}
