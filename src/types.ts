export type ShopCategory = "producers" | "upgrades";

export interface ShopItem {
	id: string;
	name: string;
	description: string;
	baseCost: number;
	cps: number;
	clickPower: number;
	category: ShopCategory;
	owned: number;
}

export interface GameState {
	cookies: number;
	totalCookies: number;
	totalClicks: number;
	cps: number;
	clickPower: number;
	shopItems: ShopItem[];
	startedAt: number;
	lastSaved: number;
}

export interface SaveData {
	cookies: number;
	totalCookies: number;
	totalClicks: number;
	clickPower: number;
	ownedItems: Record<string, number>;
	startedAt: number;
	lastSaved: number;
}
