import api from "../api/axios";

// ✅ TRANSACTION RESPONSE
export interface TransactionResponse {
  transaction_id: string;
  member_id: string;
  sale_id: string;
  transacted_by: string;
  transaction_type: string;
  total_price: number;
  payment_method: string;
  amount_given: number;
  change: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

// ✅ CREATE /transactions/create
export interface CreateTransactionPayload {
  member_id: string;
  sale_id: string;
  transacted_by: string;
  transaction_type: string;
  total_price: number;
  payment_method: string;
  amount_given: number;
  change: number;
}

// ✅ TRANSACTION RESPONSE
export interface TransactionResponse {
  transaction_id: string;
  member_id: string;
  sale_id: string;
  transacted_by: string;
  transaction_type: string;
  total_price: number;
  payment_method: string;
  amount_given: number;
  change: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

// ✅ OPTIONAL FILTERS FOR /transactions/all
export interface GetAllTransactionsParams {
  skip?: number;
  limit?: number;
  member_id?: string;
  sale_id?: string;
  transaction_type?: string;
  month?: number;
  year?: number;
}

// ✅ DATE RANGE FILTERS FOR /transactions/date-range
export interface GetTransactionsByDateRangeParams {
  start_date: string;
  end_date: string;
  transaction_type?: string;
}

// ✅ UPDATE /transactions/update/{transaction_id}
export interface UpdateTransactionPayload {
  member_id: string;
  sale_id: string;
  transacted_by: string;
  transaction_type: string;
  total_price: number;
  payment_method: string;
  amount_given: number;
  change: number;
}

// ✅ CREATE /transactions/create
export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<TransactionResponse> {
  const res = await api.post("/transactions/create", payload);
  return res.data;
}

// ✅ GET /transactions/all
export async function getAllTransactions(
  params?: GetAllTransactionsParams
): Promise<TransactionResponse[]> {
  const res = await api.get("/transactions/all", { params });
  return res.data;
}

// ✅ GET /transactions/date-range
export async function getTransactionsByDateRange(
  params: GetTransactionsByDateRangeParams
): Promise<TransactionResponse[]> {
  const res = await api.get("/transactions/date-range", { params });
  return res.data;
}

// ✅ GET /transactions/by-id/{transaction_id}
export async function getTransactionById(
  transaction_id: string
): Promise<TransactionResponse> {
  const res = await api.get(
    `/transactions/by-id/${encodeURIComponent(transaction_id)}`
  );

  return res.data;
}

// ✅ UPDATE /transactions/update/{transaction_id}
export async function updateTransaction(
  transaction_id: string,
  payload: UpdateTransactionPayload
): Promise<TransactionResponse> {
  const res = await api.put(
    `/transactions/update/${encodeURIComponent(transaction_id)}`,
    payload
  );

  return res.data;
}

// ✅ DELETE /transactions/delete/{transaction_id}
export async function deleteTransaction(transaction_id: string) {
  const res = await api.delete(
    `/transactions/delete/${encodeURIComponent(transaction_id)}`
  );

  return res.data;
}