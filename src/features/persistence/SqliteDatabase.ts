import * as SQLite from 'expo-sqlite';
import type { LayoutItem } from "../gen/LayoutGenerator";

class SqliteWorldDatabase {
    private db: SQLite.SQLiteDatabase | null = null;
    private initPromise: Promise<void>;

    constructor() {
        this.initPromise = this.init();
    }

    private async init() {
        try {
            this.db = await SQLite.openDatabaseAsync('aetheria.db');
            
            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS chunks (
                    key TEXT PRIMARY KEY,
                    x INTEGER,
                    z INTEGER,
                    data TEXT
                );
                CREATE TABLE IF NOT EXISTS gamestate (
                    key TEXT PRIMARY KEY,
                    value TEXT
                );
            `);
            console.log("SQLite DB Initialized (Native)");
        } catch (e) {
            console.error("Failed to init SQLite", e);
        }
    }

    async getChunkLayout(x: number, z: number): Promise<LayoutItem[] | null> {
        await this.initPromise;
        if (!this.db) return null;

        const result = await this.db.getFirstAsync<{ data: string }>(
            "SELECT data FROM chunks WHERE x = ? AND z = ?",
            [x, z]
        );

        if (result && result.data) {
            return JSON.parse(result.data);
        }
        return null;
    }

    async saveChunkLayout(x: number, z: number, items: LayoutItem[]) {
        await this.initPromise;
        if (!this.db) return;

        const data = JSON.stringify(items);
        await this.db.runAsync(
            "INSERT OR REPLACE INTO chunks (key, x, z, data) VALUES (?, ?, ?, ?)",
            [`${x},${z}`, x, z, data]
        );
    }

    async getGameState(key: string): Promise<any | null> {
        await this.initPromise;
        if (!this.db) return null;

        const result = await this.db.getFirstAsync<{ value: string }>(
            "SELECT value FROM gamestate WHERE key = ?",
            [key]
        );

        if (result && result.value) {
            return JSON.parse(result.value);
        }
        return null;
    }

    async saveGameState(key: string, value: any) {
        await this.initPromise;
        if (!this.db) return;

        await this.db.runAsync(
            "INSERT OR REPLACE INTO gamestate (key, value) VALUES (?, ?)",
            [key, JSON.stringify(value)]
        );
    }
}

export const worldDB = new SqliteWorldDatabase();