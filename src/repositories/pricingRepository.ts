// src/repositories/pricingRepository.ts
import { sqliteService } from "../localdb/sqliteService";

export interface LocalGymPricing {
    id: number;
    base_day_pass_price: number;
    created_at: string | null;
    updated_at: string | null;
}

export async function syncGymPricingLocal(item: LocalGymPricing) {
    try {
        await sqliteService.beginTransaction();

        // 1. Wipe existing data (Mirror strategy)
        await sqliteService.run(`DELETE FROM gym_pricing`);

        // 2. Insert fresh data
        await sqliteService.run(
            `
          INSERT INTO gym_pricing (
            id,
            base_day_pass_price,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?)
          `,
            [
                item.id,
                item.base_day_pass_price,
                item.created_at,
                item.updated_at,
            ]
        );

        await sqliteService.commitTransaction();
    } catch (error) {
        await sqliteService.rollbackTransaction();
        throw error;
    }
}

export async function getLocalGymPricing() {
    const rows = await sqliteService.query<LocalGymPricing>(
        `SELECT * FROM gym_pricing LIMIT 1`
    );
    return rows[0] ?? null;
}