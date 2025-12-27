#!/usr/bin/env node
import { buyItem, clickCookie, createGame, saveGame, tick } from "./game";
import { getItemsByCategory } from "./shop";
import {
	clearScreen,
	createUIState,
	enterAltScreen,
	exitAltScreen,
	hideCursor,
	render,
	showCursor,
	triggerClickAnimation,
	updateAnimations,
} from "./ui";

function parseArgs(): { noColor: boolean; help: boolean } {
	const args = process.argv.slice(2);
	return {
		noColor: args.includes("--no-color") || args.includes("--no-colors"),
		help: args.includes("--help") || args.includes("-h"),
	};
}

const options = parseArgs();

if (options.help) {
	console.log(`
Cookie Clicker - A fun terminal-based game
https://github.com/mathisjs/cookie-clicker

Usage: cookie-clicker [options]

Options:
  --no-color    Disable colors (for terminals without color support)
  --help, -h    Show this help message

Controls:
  ENTER         Click the cookie / Buy item in shop
  E             Open/close the shop
  S             Open/close statistics
  ↑/↓           Navigate shop items
  ←/→           Switch shop category
  Q             Quit the game

Your progress is automatically saved.
`);
	process.exit(0);
}

const state = createGame();
const ui = createUIState(options.noColor);
const running = true;

let lastClickTime = 0;
const CLICK_DEBOUNCE_MS = 100;

function cleanup(): void {
	showCursor();
	exitAltScreen();
	console.log("Thanks for playing Cookie Clicker!");
	console.log("https://github.com/mathisjs/cookie-clicker");
	console.log(`You baked ${Math.floor(state.totalCookies)} cookies in total.`);
	saveGame(state);
	process.exit(0);
}

function handleInput(key: Buffer): void {
	const now = Date.now();

	if (key.length === 1 && key[0] === 3) {
		cleanup();
		return;
	}

	if (key.length === 3 && key[0] === 27 && key[1] === 91) {
		if (ui.shopOpen) {
			const categoryItems = getItemsByCategory(
				state.shopItems,
				ui.shopCategory,
			);
			if (key[2] === 65) {
				ui.selectedItem = Math.max(0, ui.selectedItem - 1);
				render(state, ui);
			} else if (key[2] === 66) {
				ui.selectedItem = Math.min(
					categoryItems.length - 1,
					ui.selectedItem + 1,
				);
				render(state, ui);
			} else if (key[2] === 68) {
				ui.shopCategory =
					ui.shopCategory === "producers" ? "upgrades" : "producers";
				ui.selectedItem = 0;
				render(state, ui);
			} else if (key[2] === 67) {
				ui.shopCategory =
					ui.shopCategory === "producers" ? "upgrades" : "producers";
				ui.selectedItem = 0;
				render(state, ui);
			}
		}
		return;
	}

	if (key.length !== 1) {
		return;
	}

	const byte = key[0] as number;

	if (byte === 13 || byte === 10) {
		if (now - lastClickTime < CLICK_DEBOUNCE_MS) {
			return;
		}
		lastClickTime = now;

		if (ui.shopOpen && !ui.statsOpen) {
			const categoryItems = getItemsByCategory(
				state.shopItems,
				ui.shopCategory,
			);
			const selectedItem = categoryItems[ui.selectedItem];
			if (selectedItem) {
				buyItem(state, selectedItem.id);
			}
		} else if (!ui.statsOpen) {
			clickCookie(state);
			triggerClickAnimation(ui, state.clickPower);
		}
		render(state, ui);
		return;
	}

	const char = String.fromCharCode(byte).toLowerCase();

	if (char === "e") {
		if (ui.statsOpen) {
			return;
		}
		ui.shopOpen = !ui.shopOpen;
		if (ui.shopOpen) {
			ui.selectedItem = 0;
			ui.shopCategory = "producers";
		}
		render(state, ui);
		return;
	}

	if (char === "s") {
		if (ui.shopOpen) {
			return;
		}
		ui.statsOpen = !ui.statsOpen;
		render(state, ui);
		return;
	}

	if (char === "q") {
		cleanup();
		return;
	}
}

async function main(): Promise<void> {
	if (process.stdin.isTTY) {
		process.stdin.setRawMode(true);
	}
	process.stdin.resume();
	process.stdin.on("data", handleInput);

	process.on("SIGINT", cleanup);
	process.on("SIGTERM", cleanup);

	process.stdout.on("resize", () => {
		clearScreen();
		render(state, ui);
	});

	enterAltScreen();
	clearScreen();
	hideCursor();
	render(state, ui);

	setInterval(() => {
		if (running) {
			tick(state);
			updateAnimations(ui);
			render(state, ui);
		}
	}, 100);

	setInterval(() => {
		if (running) {
			saveGame(state);
		}
	}, 30000);
}

main().catch((err) => {
	showCursor();
	console.error("Error:", err);
	process.exit(1);
});
