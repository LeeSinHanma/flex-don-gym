// src/repositories/memberRepository.ts
import { sqliteService } from "../localdb/sqliteService";

export interface LocalMember {
  member_id: string;
  email: string | null;
  contact_number: string | null;
  first_name: string | null;
  last_name: string | null;
  membership_type: number | null;
  membership_plan_id: number | null;
  membership_expiry: string | null;
  credits: number | null;
  registered_by: string | null;
  is_active: number;
  created_at: string | null;
  updated_at: string | null;
}

export async function syncMembersLocal(members: LocalMember[]) {
  const statements: Array<{ statement: string; values: any[] }> = [];

  // 1. Wipe existing data (Mirror strategy)
  statements.push({ statement: `DELETE FROM members`, values: [] });

  // 2. Insert fresh data
  for (const member of members) {
    statements.push({
      statement: `
        INSERT INTO members (
          member_id,
          email,
          contact_number,
          first_name,
          last_name,
          membership_type,
          membership_plan_id,
          membership_expiry,
          credits,
          registered_by,
          is_active,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      values: [
        member.member_id,
        member.email,
        member.contact_number,
        member.first_name,
        member.last_name,
        member.membership_type,
        member.membership_plan_id,
        member.membership_expiry,
        member.credits,
        member.registered_by,
        member.is_active,
        member.created_at,
        member.updated_at,
      ],
    });
  }

  await sqliteService.executeSet(statements);
}

export async function getMemberById(memberId: string) {
  const rows = await sqliteService.query<LocalMember>(
    `SELECT * FROM members WHERE member_id = ? LIMIT 1`,
    [memberId]
  );
  return rows[0] ?? null;
}

export async function getAllMembers() {
  return sqliteService.query<LocalMember>(`SELECT * FROM members`);
}

export async function deductMemberCredits(memberId: string, amount: number) {
  await sqliteService.run(
    `UPDATE members SET credits = credits - ? WHERE member_id = ?`,
    [amount, memberId]
  );
}

export async function getMembershipDistribution() {
  return sqliteService.query<{ label: string; count: number }>(
    `SELECT mt.name as label, COUNT(m.member_id) as count 
     FROM membership_types mt 
     LEFT JOIN members m ON m.membership_plan_id = mt.membership_id 
     GROUP BY mt.membership_id, mt.name`
  );
}