import {
    getPendingSyncItems,
    markPendingSyncDone,
    markPendingSyncFailed,
} from "../repositories/visitRepository";
import { scanVisit, manualAdmitVisit, walkInVisit } from "./visits";

export async function syncPendingQueue() {
    const items = await getPendingSyncItems();

    for (const item of items) {
        try {
            const payload = JSON.parse(item.payload_json);

            if (item.entity_type === "visit") {
                if (item.action_type === "create" && payload.member_id) {
                    await scanVisit(payload.member_id);
                } else if (item.action_type === "manual_admit") {
                    await manualAdmitVisit(payload);
                } else if (item.action_type === "walk_in") {
                    await walkInVisit(payload);
                }
            }

            await markPendingSyncDone(item.id);
        } catch (error: any) {
            await markPendingSyncFailed(item.id, error?.message ?? "Sync failed");
        }
    }
}