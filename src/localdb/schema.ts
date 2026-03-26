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
  local_id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT,
  qr_code TEXT,
  direction TEXT DEFAULT 'inbound',
  access_granted INTEGER,
  denial_reason TEXT,
  scanned_at TEXT NOT NULL,
  synced INTEGER DEFAULT 0
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
`;