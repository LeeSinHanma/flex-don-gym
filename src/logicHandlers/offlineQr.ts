// src/logicHandlers/processQrOffline.ts
import { getMemberById, deductMemberCredits } from "../repositories/memberRepository";
import { saveOfflineVisit, addPendingSync } from "../repositories/visitRepository";
import { getLocalGymPricing } from "../repositories/pricingRepository";
import { getLocalMembershipTypeById } from "../repositories/membershipRepository";
import { ManualAdmitInput } from "./visits";

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

  // ✅ New logic for Type 1 (Prepaid/Balance-based) members
  if (member.membership_type === 1) {
    const pricing = await getLocalGymPricing();
    const plan = await getLocalMembershipTypeById(member.membership_plan_id || 0);

    if (pricing && plan) {
      const dailyRate = pricing.base_day_pass_price;
      const discount = plan.discount_amount || 0;
      const entryFee = dailyRate - discount;

      // Logic: access granted only if credits > (daily entry - discount)
      if (member.credits === null || member.credits <= entryFee) {
        await saveOfflineVisit({
          member_id: member.member_id,
          direction: "inbound",
          access_granted: false,
          denial_reason: "No remaining credits",
          amount_paid: 0,
        });

        await addPendingSync({
          entity_type: "visit",
          action_type: "create",
          payload_json: JSON.stringify({
            member_id: member.member_id,
            direction: "inbound",
            denied: true,
            reason: "No remaining credits",
          }),
          created_at: new Date().toISOString(),
        });

        return {
          success: false,
          message: "No remaining credits",
          member,
        };
      }

      // If sufficient credits, deduct balance locally for immediate consistency
      await deductMemberCredits(member.member_id, entryFee);
      // Update the local member object for the return result
      member.credits -= entryFee;
    }
  }

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

export async function processManualAdmitOffline(payload: ManualAdmitInput) {
  await saveOfflineVisit({
    member_id: payload.member_id,
    direction: "inbound",
    access_granted: true,
    denial_reason: null,
    amount_paid: payload.amount_given,
  });

  await addPendingSync({
    entity_type: "visit",
    action_type: "manual_admit",
    payload_json: JSON.stringify(payload),
    created_at: new Date().toISOString(),
  });

  return {
    success: true,
    visit_id: `OFFLINE-${Math.random()
      .toString(36)
      .substring(2, 9)
      .toUpperCase()}`,
  };
}