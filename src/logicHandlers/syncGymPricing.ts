// src/logicHandlers/syncGymPricing.ts
import { getGymPricing, GymPricing } from "./gymPricing";
import {
    upsertGymPricing,
    LocalGymPricing,
} from "../repositories/pricingRepository";

export async function syncGymPricingFromServer() {
    const apiItem: GymPricing = await getGymPricing();

    const mapped: LocalGymPricing = {
        id: apiItem.id,
        base_day_pass_price: apiItem.base_day_pass_price,
        created_at: apiItem.created_at ?? null,
        updated_at: apiItem.updated_at ?? null,
    };

    await upsertGymPricing(mapped);

    return mapped;
}