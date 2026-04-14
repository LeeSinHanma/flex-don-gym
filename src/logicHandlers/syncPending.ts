import {
    getPendingSyncItems,
    markPendingSyncDone,
    markPendingSyncFailed,
} from "../repositories/visitRepository";
import { syncVisits, VisitSyncRequest } from "./apiSyncVisits";

export async function syncPendingQueue() {
    const items = await getPendingSyncItems();
    const visitSyncRequests: VisitSyncRequest[] = [];
    const visitItemsToSync: any[] = []; // To keep track for marking as done

    // First pass: Group all visits into a single bulk request
    for (const item of items) {
        if (item.entity_type === "visit") {
            try {
                const payload = JSON.parse(item.payload_json);
                let operation = "";

                if (item.action_type === "create" && payload.member_id) {
                    operation = "scan";
                } else if (item.action_type === "manual_admit") {
                    operation = "manual_admit";
                } else if (item.action_type === "walk_in") {
                    operation = "walk_in";
                }

                if (operation) {
                    visitSyncRequests.push({
                        idempotency_key: item.idempotency_key || `visit_sync_${item.id}`,
                        payload: {
                            operation,
                            payload: payload
                        }
                    });
                    visitItemsToSync.push(item);
                }
            } catch (error) {
                console.error("Failed to parse visit queue item JSON", item);
            }
        }
    }

    // Call the bulk sync API if there are visits to sync
    if (visitSyncRequests.length > 0) {
        try {
            await syncVisits(visitSyncRequests);
            // If successful, mark all as done
            for (const item of visitItemsToSync) {
                await markPendingSyncDone(item.id);
            }
        } catch (error: any) {
            console.error("Failed bulk syncing visits:", error);
            // Mark all as failed in this batch
            for (const item of visitItemsToSync) {
                await markPendingSyncFailed(item.id, error?.message ?? "Bulk sync failed");
            }
        }
    }
}
