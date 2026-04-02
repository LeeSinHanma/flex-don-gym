// src/repositories/pricingRepository.ts
import { sqliteService } from "../localdb/sqliteService";

export interface LocalGymPricing {
    id: number;
    base_day_pass_price: number;
    created_at: string | null;
    updated_at: string | null;
}

export async function syncGymPricingLocal(item: LocalGymPricing) {
    // Use executeSet with transaction=true for atomic wipe-and-reload
    await sqliteService.executeSet(
        [
            { statement: `DELETE FROM gym_pricing`, values: [] },
            {
                statement: `INSERT INTO gym_pricing (id, base_day_pass_price, created_at, updated_at) VALUES (?, ?, ?, ?)`,
                values: [
                    item.id,
                    item.base_day_pass_price,
                    item.created_at,
                    item.updated_at,
                ],
            },
        ],
        true
    );
}

export async function getLocalGymPricing() {
    const rows = await sqliteService.query<LocalGymPricing>(
        `SELECT * FROM gym_pricing LIMIT 1`
    );
    return rows[0] ?? null;
}