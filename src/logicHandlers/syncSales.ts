import { getOfflineSales, getOfflineSaleItems, markSaleAsSynced } from "../repositories/salesRepository";
import { syncSales, SaleSyncRequest } from "./apiSyncSales";

/**
 * syncOfflineSales
 * 
 * Logic to find all unsynced local sales, format them for the API,
 * and mark them as synced in the local database upon success.
 */
export const syncOfflineSales = async () => {
  try {
    // 1. Fetch unsynced sales from SQLite
    const unsyncedSales = await getOfflineSales();

    if (!unsyncedSales || unsyncedSales.length === 0) {
      console.log("No offline sales to sync.");
      return 0;
    }

    console.log(`Found ${unsyncedSales.length} offline sales to sync...`);

    const syncRequests: SaleSyncRequest[] = [];

    // 2. For each sale, fetch its items and format it
    for (const sale of unsyncedSales) {
      const items = await getOfflineSaleItems(sale.sale_id);

      syncRequests.push({
        idempotency_key: sale.sale_id, // Using the local sale_id as idempotency key
        payload: {
          sold_by: String(sale.sold_by),
          payment_method: sale.payment_method,
          amount_given: sale.amount_given,
          items: items.map((i: any) => ({
            item_id: i.item_id,
            item_name: i.item_name,
            quantity: i.quantity,
            unit_price: i.unit_price,
          })),
        },
      });
    }

    // 3. Call the API
    console.log("Sending sales to server:", JSON.stringify(syncRequests, null, 2));
    const result = await syncSales(syncRequests);
    console.log("Sync sales API result:", result);

    // 4. Mark as synced locally
    for (const request of syncRequests) {
        await markSaleAsSynced(request.idempotency_key);
        console.log(`Sale ${request.idempotency_key} marked as synced locally.`);
    }

    console.log(`Successfully synced ${unsyncedSales.length} sales to the server.`);
    return unsyncedSales.length;

  } catch (error) {
    console.error("Failed to sync offline sales:", error);
    throw error;
  }
};
