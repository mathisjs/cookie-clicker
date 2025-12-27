import type { ShopCategory, ShopItem } from "./types";

export function createShopItems(): ShopItem[] {
	return [
		{
			id: "cursor",
			name: "Cursor",
			description: "Auto-clicks once every 10 seconds",
			baseCost: 15,
			cps: 0.1,
			clickPower: 0,
			category: "producers",
			owned: 0,
		},
		{
			id: "grandma",
			name: "Grandma",
			description: "A nice grandma to bake cookies",
			baseCost: 100,
			cps: 1,
			clickPower: 0,
			category: "producers",
			owned: 0,
		},
		{
			id: "farm",
			name: "Farm",
			description: "Grows cookie plants",
			baseCost: 1100,
			cps: 8,
			clickPower: 0,
			category: "producers",
			owned: 0,
		},
		{
			id: "mine",
			name: "Mine",
			description: "Mines cookie dough",
			baseCost: 12000,
			cps: 47,
			clickPower: 0,
			category: "producers",
			owned: 0,
		},
		{
			id: "factory",
			name: "Factory",
			description: "Mass produces cookies",
			baseCost: 130000,
			cps: 260,
			clickPower: 0,
			category: "producers",
			owned: 0,
		},
		{
			id: "bank",
			name: "Bank",
			description: "Generates cookies from interest",
			baseCost: 1400000,
			cps: 1400,
			clickPower: 0,
			category: "producers",
			owned: 0,
		},
		{
			id: "temple",
			name: "Temple",
			description: "Converts prayers into cookies",
			baseCost: 20000000,
			cps: 7800,
			clickPower: 0,
			category: "producers",
			owned: 0,
		},
		{
			id: "wizard",
			name: "Wizard Tower",
			description: "Conjures cookies with magic",
			baseCost: 330000000,
			cps: 44000,
			clickPower: 0,
			category: "producers",
			owned: 0,
		},
		{
			id: "reinforced_finger",
			name: "Reinforced Finger",
			description: "Clicks are worth +1 cookie",
			baseCost: 100,
			cps: 0,
			clickPower: 1,
			category: "upgrades",
			owned: 0,
		},
		{
			id: "carpal_tunnel",
			name: "Carpal Tunnel",
			description: "Clicks are worth +2 cookies",
			baseCost: 500,
			cps: 0,
			clickPower: 2,
			category: "upgrades",
			owned: 0,
		},
		{
			id: "ambidextrous",
			name: "Ambidextrous",
			description: "Clicks are worth +5 cookies",
			baseCost: 5000,
			cps: 0,
			clickPower: 5,
			category: "upgrades",
			owned: 0,
		},
		{
			id: "thousand_fingers",
			name: "Thousand Fingers",
			description: "Clicks are worth +10 cookies",
			baseCost: 50000,
			cps: 0,
			clickPower: 10,
			category: "upgrades",
			owned: 0,
		},
		{
			id: "million_fingers",
			name: "Million Fingers",
			description: "Clicks are worth +25 cookies",
			baseCost: 500000,
			cps: 0,
			clickPower: 25,
			category: "upgrades",
			owned: 0,
		},
		{
			id: "billion_fingers",
			name: "Billion Fingers",
			description: "Clicks are worth +50 cookies",
			baseCost: 5000000,
			cps: 0,
			clickPower: 50,
			category: "upgrades",
			owned: 0,
		},
		{
			id: "trillion_fingers",
			name: "Trillion Fingers",
			description: "Clicks are worth +100 cookies",
			baseCost: 50000000,
			cps: 0,
			clickPower: 100,
			category: "upgrades",
			owned: 0,
		},
		{
			id: "infinity_fingers",
			name: "Infinity Fingers",
			description: "Clicks are worth +500 cookies",
			baseCost: 500000000,
			cps: 0,
			clickPower: 500,
			category: "upgrades",
			owned: 0,
		},
	];
}

export function getItemsByCategory(
	items: ShopItem[],
	category: ShopCategory,
): ShopItem[] {
	return items.filter((item) => item.category === category);
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
