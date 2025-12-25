import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { SaveData } from "./types";

function getSaveDir(): string {
	const home = homedir();
	if (process.platform === "win32") {
		return join(
			process.env.APPDATA || join(home, "AppData", "Roaming"),
			"cookie-clicker-cli",
		);
	}
	return join(home, ".config", "cookie-clicker-cli");
}

function getSavePath(): string {
	return join(getSaveDir(), "save.json");
}

export function ensureSaveDir(): void {
	const dir = getSaveDir();
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
}

export function loadSave(): SaveData | null {
	const path = getSavePath();
	if (!existsSync(path)) {
		return null;
	}
	try {
		const data = readFileSync(path, "utf-8");
		return JSON.parse(data) as SaveData;
	} catch {
		return null;
	}
}

export function writeSave(data: SaveData): void {
	ensureSaveDir();
	const path = getSavePath();
	writeFileSync(path, JSON.stringify(data, null, 2));
}
