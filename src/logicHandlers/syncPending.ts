import {
  getPendingSyncItems,
  markPendingSyncDone,
  markPendingSyncFailed,
} from "../repositories/visitRepository";
import { syncVisits, VisitSyncRequest } from "./apiSyncVisits";
import { manualAdmitVisit, walkInVisit } from "./visits";

export async function syncPendingQueue() {
  const items = await getPendingSyncItems();
  const visitSyncRequests: VisitSyncRequest[] = [];
  const visitScanItemsToSync: any[] = []; // To keep track for marking as done

  // First pass: group only scan actions for bulk sync endpoint
  for (const item of items) {
    if (item.entity_type === "visit") {
      try {
        const payload = JSON.parse(item.payload_json);

        if (item.action_type === "create" && payload.member_id) {
          visitSyncRequests.push({
            idempotency_key: item.idempotency_key || `visit_sync_${item.id}`,
            payload: {
              operation: "scan",
              payload: payload,
            },
          });
          visitScanItemsToSync.push(item);
        }
      } catch (error) {
        console.error("Failed to parse visit queue item JSON", item);
      }
    }
  }

  // Call the bulk scan sync API if there are scans to sync
  if (visitSyncRequests.length > 0) {
    try {
      await syncVisits(visitSyncRequests);
      // If successful, mark all as done
      for (const item of visitScanItemsToSync) {
        await markPendingSyncDone(item.id);
      }
    } catch (error: any) {
      console.error("Failed bulk syncing visits:", error);
      // Mark all as failed in this batch
      for (const item of visitScanItemsToSync) {
        await markPendingSyncFailed(
          item.id,
          error?.message ?? "Bulk sync failed",
        );
      }
    }
  }

  // Second pass: sync manual admits and walk-ins via dedicated endpoints
  for (const item of items) {
    if (item.entity_type !== "visit") continue;
    if (item.action_type !== "manual_admit" && item.action_type !== "walk_in")
      continue;

    try {
      const payload = JSON.parse(item.payload_json);

      if (item.action_type === "manual_admit") {
        await manualAdmitVisit(payload);
      } else {
        await walkInVisit(payload);
      }

      await markPendingSyncDone(item.id);
    } catch (error: any) {
      console.error(`Failed syncing ${item.action_type}:`, error);
      await markPendingSyncFailed(item.id, error?.message ?? "Sync failed");
    }
  }
}
