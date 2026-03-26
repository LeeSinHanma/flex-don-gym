// src/logicHandlers/syncMembers.ts
import { getMembers, Member } from "./memberCrud";
import { upsertMembers, LocalMember } from "../repositories/memberRepository";

export async function syncMembersFromServer() {
  const apiMembers: Member[] = await getMembers();

  const mappedMembers: LocalMember[] = apiMembers.map((member) => ({
    member_id: member.member_id,
    email: member.email ?? null,
    contact_number: member.contact_number ?? null,
    first_name: member.first_name ?? null,
    last_name: member.last_name ?? null,
    membership_type: member.membership_type ?? null,
    membership_plan_id: member.membership_plan_id ?? null,
    membership_expiry: member.membership_expiry ?? null,
    credits: member.credits ?? 0,
    registered_by:
      member.registered_by !== null && member.registered_by !== undefined
        ? String(member.registered_by)
        : null,
    is_active: Number(member.is_active ?? 0),
    created_at: member.created_at ?? null,
    updated_at: member.updated_at ?? null,
  }));

  await upsertMembers(mappedMembers);

  return mappedMembers.length;
}