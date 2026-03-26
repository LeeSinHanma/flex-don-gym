import {
    getPendingSyncItems,
    markPendingSyncDone,
    markPendingSyncFailed,
} from "../repositories/visitRepository";
import { scanVisit } from "./visits";

export async function syncPendingQueue() {
    const items = await getPendingSyncItems();

    for (const item of items) {
        try {
            const payload = JSON.parse(item.payload_json);

            if (item.entity_type === "visit" && item.action_type === "create") {
                if (payload.member_id) {
                    await scanVisit(payload.member_id);
                }
            }

            await markPendingSyncDone(item.id);
        } catch (error: any) {
            await markPendingSyncFailed(item.id, error?.message ?? "Sync failed");
        }
    }
}