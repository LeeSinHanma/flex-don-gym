import api from "../api/axios";

export interface VisitOperationPayload {
  member_id: string;
  direction: "inbound" | "outbound" | string;
}

export interface VisitSyncPayload {
  operation: "scan" | string;
  payload: VisitOperationPayload;
}

export interface VisitSyncRequest {
  idempotency_key: string;
  payload: VisitSyncPayload;
}

export const syncVisits = async (visits: VisitSyncRequest[]) => {
  try {
    const response = await api.post("/on-sync/visits", visits);

    return response.data;
  } catch (error: any) {
    console.error("Error syncing visits:", error);
    throw error;
  }
};
