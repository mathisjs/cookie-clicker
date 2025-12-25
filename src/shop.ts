import type { ShopItem } from "./types";

export function createShopItems(): ShopItem[] {
	return [
		{
			id: "cursor",
			name: "Cursor",
			description: "Auto-clicks once every 10 seconds",
			baseCost: 15,
			cps: 0.1,
			owned: 0,
		},
		{
			id: "grandma",
			name: "Grandma",
			description: "A nice grandma to bake cookies",
			baseCost: 100,
			cps: 1,
			owned: 0,
		},
		{
			id: "farm",
			name: "Farm",
			description: "Grows cookie plants",
			baseCost: 1100,
			cps: 8,
			owned: 0,
		},
		{
			id: "mine",
			name: "Mine",
			description: "Mines cookie dough",
			baseCost: 12000,
			cps: 47,
			owned: 0,
		},
		{
			id: "factory",
			name: "Factory",
			description: "Mass produces cookies",
			baseCost: 130000,
			cps: 260,
			owned: 0,
		},
		{
			id: "bank",
			name: "Bank",
			description: "Generates cookies from interest",
			baseCost: 1400000,
			cps: 1400,
			owned: 0,
		},
		{
			id: "temple",
			name: "Temple",
			description: "Converts prayers into cookies",
			baseCost: 20000000,
			cps: 7800,
			owned: 0,
		},
		{
			id: "wizard",
			name: "Wizard Tower",
			description: "Conjures cookies with magic",
			baseCost: 330000000,
			cps: 44000,
			owned: 0,
		},
	];
}

export function getItemCost(item: ShopItem): number {
	return Math.floor(item.baseCost * 1.15 ** item.owned);
}

export function formatNumber(n: number): string {
	if (n >= 1e15) return `${(n / 1e15).toFixed(2)} Qa`;
	if (n >= 1e12) return `${(n / 1e12).toFixed(2)} T`;
	if (n >= 1e9) return `${(n / 1e9).toFixed(2)} B`;
	if (n >= 1e6) return `${(n / 1e6).toFixed(2)} M`;
	if (n >= 1e3) return `${(n / 1e3).toFixed(2)} K`;
	if (n < 1000 && n > 0) {
		return n % 1 === 0 ? n.toString() : n.toFixed(1);
	}
	return Math.floor(n).toString();
}
