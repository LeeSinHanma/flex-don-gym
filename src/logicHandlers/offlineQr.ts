// src/logicHandlers/processQrOffline.ts
import { getMemberById } from "../repositories/memberRepository";
import { saveOfflineVisit, addPendingSync } from "../repositories/visitRepository";

export async function processQrOffline(qrCode: string) {
  const member = await getMemberById(qrCode);

  if (!member) {
    await addPendingSync({
      entity_type: "visit",
      action_type: "create",
      payload_json: JSON.stringify({
        member_id: null,
        direction: "inbound",
        denied: true,
        reason: "Member not found",
        scanned_value: qrCode,
      }),
      created_at: new Date().toISOString(),
    });

    return {
      success: false,
      message: "Member not found",
      member: null,
    };
  }

  const now = new Date();
  const isActive = member.is_active === 1;
  const isExpired = member.membership_expiry
    ? new Date(member.membership_expiry) < now
    : false;

  if (!isActive) {
    await saveOfflineVisit({
      member_id: member.member_id,
      direction: "inbound",
      access_granted: false,
      denial_reason: "Member inactive",
      amount_paid: 0,
    });

    await addPendingSync({
      entity_type: "visit",
      action_type: "create",
      payload_json: JSON.stringify({
        member_id: member.member_id,
        direction: "inbound",
        denied: true,
        reason: "Member inactive",
      }),
      created_at: new Date().toISOString(),
    });

    return {
      success: false,
      message: "Member inactive",
      member,
    };
  }

  if (isExpired) {
    await saveOfflineVisit({
      member_id: member.member_id,
      direction: "inbound",
      access_granted: false,
      denial_reason: "Membership expired",
      amount_paid: 0,
    });

    await addPendingSync({
      entity_type: "visit",
      action_type: "create",
      payload_json: JSON.stringify({
        member_id: member.member_id,
        direction: "inbound",
        denied: true,
        reason: "Membership expired",
      }),
      created_at: new Date().toISOString(),
    });

    return {
      success: false,
      message: "Membership expired",
      member,
    };
  }

  await saveOfflineVisit({
    member_id: member.member_id,
    direction: "inbound",
    access_granted: true,
    denial_reason: null,
    amount_paid: 0,
  });

  await addPendingSync({
    entity_type: "visit",
    action_type: "create",
    payload_json: JSON.stringify({
      member_id: member.member_id,
      direction: "inbound",
    }),
    created_at: new Date().toISOString(),
  });

  return {
    success: true,
    message: "Access granted",
    member,
  };
}