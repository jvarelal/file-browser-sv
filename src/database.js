import { Low, JSONFile } from "lowdb";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { platform } from 'node:process';
import secure from "./helpers/secure.js";

let db;

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function createConnection() {
  const file = join(__dirname, "../db.json");
  const adapter = new JSONFile(file);
  const windowsRoutes = ["C:/Users", "C:/Windows"]
  const linuxRoutes = ["/"]
  const isWin = platform === "win32";
  db = new Low(adapter);

  await db.read();

  db.data ||= {
    users: [
      {
        "user": "Admin",
        "key": "U2FsdGVkX18LkNaseXY2TCpJ/J95cF9mKijsQF1EH28=",
        "routes": (isWin ? windowsRoutes : linuxRoutes).map(r => secure.digest(r)),
        "bookmarksGroup": [
          {
            "name": "Global",
            "id": "0"
          }
        ],
        "sessionTime": "2h",
        "rol": "0",
        "actions": [
          "r",
          "w",
          "u",
          "d"
        ],
        "bookmarks": [],
        "creation": new Date().toISOString()
      }
    ]
  };
  await db.write()
}

export const getConnection = () => db;