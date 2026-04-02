import { Capacitor } from "@capacitor/core";
import {
    SQLiteConnection,
    CapacitorSQLite,
    SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import { CREATE_TABLES_SQL } from "./schema";

class SQLiteService {
    private sqlite!: SQLiteConnection;
    private db!: SQLiteDBConnection;
    private readonly dbName = "dondon_gym_offline";
    private initialized = false;

    async init() {
        if (this.initialized) return;

        if (Capacitor.getPlatform() === "web") {
            console.warn("SQLite native plugin is mainly for Android/iOS. Skipping native init on web.");
            this.initialized = true;
            return;
        }

        this.sqlite = new SQLiteConnection(CapacitorSQLite);

        try {
            const consistency = await this.sqlite.checkConnectionsConsistency();
            const isConn = (await this.sqlite.isConnection(this.dbName, false)).result;

            if (consistency.result && isConn) {
                this.db = await this.sqlite.retrieveConnection(this.dbName, false);
            } else {
                this.db = await this.sqlite.createConnection(
                    this.dbName,
                    false,
                    "no-encryption",
                    1,
                    false
                );
            }
        } catch (err) {
            console.log("Connection check failed, creating a new connection:", err);
            try {
                this.db = await this.sqlite.createConnection(
                    this.dbName,
                    false,
                    "no-encryption",
                    1,
                    false
                );
            } catch (createErr) {
                console.log("Connection might already exist, retrieving:", createErr);
                this.db = await this.sqlite.retrieveConnection(this.dbName, false);
            }
        }

        await this.db.open();
        await this.execute(CREATE_TABLES_SQL, false);
        this.initialized = true;
    }

    get isInitialized() {
        return this.initialized;
    }

    getConnection() {
        if (!this.db) {
            throw new Error("Database not initialized.");
        }
        return this.db;
    }

    async close() {
        if (this.db) {
            await this.db.close();
            await this.sqlite.closeConnection(this.dbName, false);
        }
    }

    async run(sql: string, values: any[] = []) {
        const db = this.getConnection();
        return db.run(sql, values, false);
    }

    async query<T = any>(sql: string, values: any[] = []): Promise<T[]> {
        const db = this.getConnection();
        const result = await db.query(sql, values);
        return (result.values ?? []) as T[];
    }

    async execute(sql: string, transaction: boolean = true) {
        const db = this.getConnection();
        return db.execute(sql, transaction);
    }

    /**
     * Execute a set of SQL statements atomically in a single transaction.
     * This is the proper Capacitor SQLite way to batch multiple parameterized
     * statements without conflicting with db.run()'s internal transaction.
     */
    async executeSet(statements: Array<{ statement: string; values: any[] }>, transaction: boolean = true) {
        const db = this.getConnection();
        return db.executeSet(statements, transaction);
    }
}

export const sqliteService = new SQLiteService();