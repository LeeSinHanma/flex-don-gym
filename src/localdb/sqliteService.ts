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

        await this.db.open();
        await this.db.execute(CREATE_TABLES_SQL);
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
        return db.run(sql, values);
    }

    async query<T = any>(sql: string, values: any[] = []): Promise<T[]> {
        const db = this.getConnection();
        const result = await db.query(sql, values);
        return (result.values ?? []) as T[];
    }

    async execute(sql: string) {
        const db = this.getConnection();
        return db.execute(sql);
    }
}

export const sqliteService = new SQLiteService();