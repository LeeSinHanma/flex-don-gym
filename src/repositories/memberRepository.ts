import { sqliteService } from "../localdb/sqliteService";

export interface LocalMember {
    id: string;
    qr_code: string;
    first_name: string;
    last_name: string;
    full_name: string;
    membership_type_id: string;
    membership_status: string;
    start_date: string;
    end_date: string;
    is_active: number;
    updated_at: string;
}

export async function upsertMembers(members: LocalMember[]) {
    for (const m of members) {
        await sqliteService.run(
            `
      INSERT OR REPLACE INTO members (
        id, qr_code, first_name, last_name, full_name,
        membership_type_id, membership_status, start_date,
        end_date, is_active, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
            [
                m.id,
                m.qr_code,
                m.first_name,
                m.last_name,
                m.full_name,
                m.membership_type_id,
                m.membership_status,
                m.start_date,
                m.end_date,
                m.is_active,
                m.updated_at,
            ]
        );
    }
}

export async function getMemberByQr(qrCode: string) {
    const rows = await sqliteService.query<LocalMember>(
        `SELECT * FROM members WHERE qr_code = ? LIMIT 1`,
        [qrCode]
    );
    return rows[0] ?? null;
}