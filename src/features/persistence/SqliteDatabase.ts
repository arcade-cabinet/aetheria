import initSqlJs, { type Database } from "sql.js";
import type { LayoutItem } from "../gen/LayoutGenerator";

class SqliteWorldDatabase {
    private db: Database | null = null;
    private initPromise: Promise<void>;

    constructor() {
        this.initPromise = this.init();
    }

    private async init() {
        try {
            const SQL = await initSqlJs({
                locateFile: (file: string) => `/wasm/${file}`
            });
            
            this.db = new SQL.Database();
            
            this.db.run(`
                CREATE TABLE IF NOT EXISTS chunks (
                    key TEXT PRIMARY KEY,
                    x INTEGER,
                    z INTEGER,
                    data TEXT
                );
            `);
            console.log("SQLite DB Initialized");
        } catch (e) {
            console.error("Failed to init SQLite", e);
        }
    }

    async getChunkLayout(x: number, z: number): Promise<LayoutItem[] | null> {
        await this.initPromise;
        if (!this.db) return null;

        const stmt = this.db.prepare("SELECT data FROM chunks WHERE x=:x AND z=:z");
        const result = stmt.getAsObject({':x': x, ':z': z});
        stmt.free();

        if (result && result.data) {
            return JSON.parse(result.data as string);
        }
        return null;
    }

    async saveChunkLayout(x: number, z: number, items: LayoutItem[]) {
        await this.initPromise;
        if (!this.db) return;

        const data = JSON.stringify(items);
        this.db.run(`
            INSERT OR REPLACE INTO chunks (key, x, z, data) 
            VALUES (:key, :x, :z, :data)
        `, {
            ':key': `${x},${z}`,
            ':x': x,
            ':z': z,
            ':data': data
        });
    }
}

export const worldDB = new SqliteWorldDatabase();
