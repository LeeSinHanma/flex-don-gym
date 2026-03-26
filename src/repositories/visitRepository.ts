import { sqliteService } from "../localdb/sqliteService";

export interface PendingSyncItem {
    entity_type: string;
    action_type: string;
    payload_json: string;
    created_at: string;
}

export async function saveOfflineVisit(params: {
    member_id: string | null;
    qr_code: string;
    access_granted: boolean;
    denial_reason?: string | null;
    direction?: string;
}) {
    await sqliteService.run(
        `
    INSERT INTO offline_visits (
      member_id, qr_code, direction, access_granted,
      denial_reason, scanned_at, synced
    )
    VALUES (?, ?, ?, ?, ?, ?, 0)
    `,
        [
            params.member_id,
            params.qr_code,
            params.direction ?? "inbound",
            params.access_granted ? 1 : 0,
            params.denial_reason ?? null,
            new Date().toISOString(),
        ]
    );
}

export async function addPendingSync(item: PendingSyncItem) {
    await sqliteService.run(
        `
    INSERT INTO pending_sync (
      entity_type, action_type, payload_json, status, retry_count, created_at
    )
    VALUES (?, ?, ?, 'pending', 0, ?)
    `,
        [item.entity_type, item.action_type, item.payload_json, item.created_at]
    );
}

export async function getPendingSyncItems() {
    return sqliteService.query<any>(
        `SELECT * FROM pending_sync WHERE status = 'pending' ORDER BY id ASC`
    );
}

export async function markPendingSyncDone(id: number) {
    await sqliteService.run(
        `UPDATE pending_sync SET status = 'synced' WHERE id = ?`,
        [id]
    );
}

export async function markPendingSyncFailed(id: number, error: string) {
    await sqliteService.run(
        `
    UPDATE pending_sync
    SET retry_count = retry_count + 1, last_error = ?
    WHERE id = ?
    `,
        [error, id]
    );
}