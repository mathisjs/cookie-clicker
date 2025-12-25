export interface ShopItem {
	id: string;
	name: string;
	description: string;
	baseCost: number;
	cps: number;
	owned: number;
}

export interface GameState {
	cookies: number;
	totalCookies: number;
	cps: number;
	clickPower: number;
	shopItems: ShopItem[];
	startedAt: number;
	lastSaved: number;
}

export interface SaveData {
	cookies: number;
	totalCookies: number;
	clickPower: number;
	ownedItems: Record<string, number>;
	startedAt: number;
	lastSaved: number;
}
