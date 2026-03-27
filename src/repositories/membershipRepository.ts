// src/repositories/membershipRepository.ts
import { sqliteService } from "../localdb/sqliteService";

export interface LocalMembershipType {
    membership_id: number;
    name: string | null;
    type: number | null;
    price: number | null;
    discount_amount: number | null;
    duration_months: number | null;
    created_at: string | null;
    updated_at: string | null;
}

export async function upsertMembershipTypes(items: LocalMembershipType[]) {
    for (const item of items) {
        await sqliteService.run(
            `
      INSERT OR REPLACE INTO membership_types (
        membership_id,
        name,
        type,
        price,
        discount_amount,
        duration_months,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
            [
                item.membership_id,
                item.name,
                item.type,
                item.price,
                item.discount_amount,
                item.duration_months,
                item.created_at,
                item.updated_at,
            ]
        );
    }
}

export async function getAllMembershipTypes() {
    return sqliteService.query<LocalMembershipType>(
        `SELECT * FROM membership_types`
    );
}

export async function getLocalMembershipTypeById(membershipId: number) {
    const rows = await sqliteService.query<LocalMembershipType>(
        `SELECT * FROM membership_types WHERE membership_id = ? LIMIT 1`,
        [membershipId]
    );
    return rows[0] ?? null;
}