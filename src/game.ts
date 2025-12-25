import { loadSave, writeSave } from "./save";
import { createShopItems, getItemCost } from "./shop";
import type { GameState, SaveData } from "./types";

export function createGame(): GameState {
	const items = createShopItems();
	const savedData = loadSave();

	if (savedData) {
		for (const item of items) {
			item.owned = savedData.ownedItems[item.id] || 0;
		}

		const cps = items.reduce((sum, item) => sum + item.cps * item.owned, 0);

		const now = Date.now();
		const offlineTime = Math.min(
			(now - savedData.lastSaved) / 1000,
			8 * 60 * 60,
		);
		const offlineEarnings = Math.floor(cps * offlineTime);

		return {
			cookies: savedData.cookies + offlineEarnings,
			totalCookies: savedData.totalCookies + offlineEarnings,
			cps,
			clickPower: savedData.clickPower,
			shopItems: items,
			startedAt: savedData.startedAt,
			lastSaved: now,
		};
	}

	return {
		cookies: 0,
		totalCookies: 0,
		cps: 0,
		clickPower: 1,
		shopItems: items,
		startedAt: Date.now(),
		lastSaved: Date.now(),
	};
}

export function clickCookie(state: GameState): void {
	state.cookies += state.clickPower;
	state.totalCookies += state.clickPower;
	saveGame(state);
}

export function tick(state: GameState): void {
	if (state.cps > 0) {
		const earned = state.cps / 10;
		state.cookies += earned;
		state.totalCookies += earned;
	}
}

export function buyItem(state: GameState, index: number): boolean {
	const item = state.shopItems[index];
	if (!item) return false;

	const cost = getItemCost(item);
	if (state.cookies < cost) return false;

	state.cookies -= cost;
	item.owned++;
	state.cps = state.shopItems.reduce((sum, i) => sum + i.cps * i.owned, 0);
	saveGame(state);
	return true;
}

export function saveGame(state: GameState): void {
	const data: SaveData = {
		cookies: state.cookies,
		totalCookies: state.totalCookies,
		clickPower: state.clickPower,
		ownedItems: {},
		startedAt: state.startedAt,
		lastSaved: Date.now(),
	};

	for (const item of state.shopItems) {
		data.ownedItems[item.id] = item.owned;
	}

	writeSave(data);
}
