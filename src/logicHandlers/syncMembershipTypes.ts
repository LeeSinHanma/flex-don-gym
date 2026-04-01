// src/logicHandlers/syncMembershipTypes.ts
import {
    getMembershipTypes,
    MembershipTypeResponse,
} from "./membershipCrud";
import {
    syncMembershipTypesLocal,
    LocalMembershipType,
} from "../repositories/membershipRepository";

export async function syncMembershipTypesFromServer() {
    const apiItems: MembershipTypeResponse[] = await getMembershipTypes();

    const mappedItems: LocalMembershipType[] = apiItems.map((item) => ({
        membership_id: Number(item.membership_id),
        name: item.name ?? null,
        type: item.type ?? null,
        price: item.price ?? 0,
        discount_amount: item.discount_amount ?? 0,
        duration_months: item.duration_months ?? null,
        created_at: item.created_at ?? null,
        updated_at: item.updated_at ?? null,
    }));

    await syncMembershipTypesLocal(mappedItems);

    return mappedItems.length;
}