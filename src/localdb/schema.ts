export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS members (
  member_id TEXT PRIMARY KEY NOT NULL,
  email TEXT,
  contact_number TEXT,
  first_name TEXT,
  last_name TEXT,
  membership_type INTEGER,
  membership_plan_id INTEGER,
  membership_expiry TEXT,
  credits REAL,
  registered_by TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS membership_types (
  membership_id INTEGER PRIMARY KEY NOT NULL,
  name TEXT,
  type INTEGER,
  price REAL,
  discount_amount REAL,
  duration_months INTEGER,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS inventory_items (
  item_id TEXT PRIMARY KEY NOT NULL,
  item_name TEXT,
  description TEXT,
  price REAL,
  quantity INTEGER,
  added_by TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS gym_pricing (
  id INTEGER PRIMARY KEY NOT NULL,
  base_day_pass_price REAL,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS offline_visits (
  local_visit_id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  access_granted INTEGER,
  denial_reason TEXT,
  amount_paid REAL DEFAULT 0,
  created_at TEXT NOT NULL,
  synced INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS offline_sales (
  sale_id TEXT PRIMARY KEY NOT NULL,
  sold_by TEXT,
  total_price REAL,
  payment_method TEXT,
  amount_given REAL,
  created_at TEXT NOT NULL,
  synced INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS offline_sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_name TEXT,
  quantity INTEGER,
  unit_price REAL,
  FOREIGN KEY (sale_id) REFERENCES offline_sales (sale_id)
);

CREATE TABLE IF NOT EXISTS pending_sync (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  action_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_meta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT
);

CREATE INDEX IF NOT EXISTS idx_members_member_id ON members(member_id);
CREATE INDEX IF NOT EXISTS idx_pending_sync_status ON pending_sync(status);
CREATE INDEX IF NOT EXISTS idx_offline_visits_synced ON offline_visits(synced);
CREATE INDEX IF NOT EXISTS idx_offline_sales_synced ON offline_sales(synced);
`;