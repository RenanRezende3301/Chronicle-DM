import { mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import process from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDirectory = join(__dirname, '..', 'data')
const databasePath = process.env.VTM_DATABASE_PATH
  ? resolve(process.env.VTM_DATABASE_PATH)
  : join(dataDirectory, 'vtm.sqlite')

mkdirSync(dirname(databasePath), { recursive: true })

export const database = new DatabaseSync(databasePath)

database.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_state (
    user_id TEXT PRIMARY KEY,
    state_json TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS npc_images (
    user_id TEXT NOT NULL,
    npc_id TEXT NOT NULL,
    content_type TEXT NOT NULL,
    image_data BLOB NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, npc_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`)

export function getUserPublicProfile(user) {
  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    createdAt: user.created_at,
  }
}
