import { getMemberByQr } from "../repositories/memberRepository";
import { saveOfflineVisit, addPendingSync } from "../repositories/visitRepository";

export async function processQrOffline(qrCode: string) {
    const member = await getMemberByQr(qrCode);

    if (!member) {
        await saveOfflineVisit({
            member_id: null,
            qr_code: qrCode,
            access_granted: false,
            denial_reason: "Member not found",
        });

        await addPendingSync({
            entity_type: "visit",
            action_type: "create",
            payload_json: JSON.stringify({
                member_id: null,
                qr_code: qrCode,
                direction: "inbound",
                denied: true,
                reason: "Member not found",
            }),
            created_at: new Date().toISOString(),
        });

        return {
            success: false,
            message: "Member not found",
        };
    }

    const now = new Date();
    const isActive = member.is_active === 1;
    const isExpired = member.end_date ? new Date(member.end_date) < now : false;

    if (!isActive) {
        await saveOfflineVisit({
            member_id: member.id,
            qr_code: qrCode,
            access_granted: false,
            denial_reason: "Member inactive",
        });

        await addPendingSync({
            entity_type: "visit",
            action_type: "create",
            payload_json: JSON.stringify({
                member_id: member.id,
                qr_code: qrCode,
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
            member_id: member.id,
            qr_code: qrCode,
            access_granted: false,
            denial_reason: "Membership expired",
        });

        await addPendingSync({
            entity_type: "visit",
            action_type: "create",
            payload_json: JSON.stringify({
                member_id: member.id,
                qr_code: qrCode,
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
        member_id: member.id,
        qr_code: qrCode,
        access_granted: true,
    });

    await addPendingSync({
        entity_type: "visit",
        action_type: "create",
        payload_json: JSON.stringify({
            member_id: member.id,
            qr_code: qrCode,
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