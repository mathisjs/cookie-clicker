import { formatNumber, getItemCost } from "./shop";
import type { GameState, ShopItem } from "./types";

export interface UIState {
	shopOpen: boolean;
	selectedItem: number;
	noColor: boolean;
	clickAnim: number;
	particles: Particle[];
}

interface Particle {
	x: number;
	y: number;
	text: string;
	life: number;
}

const COOKIE_SMALL = [
	"    ████████    ",
	"  ██░░██░░░░██  ",
	" ██░░████░░░░██ ",
	"██░░░░░░██░░░░██",
	"██░░██░░░░░░░░██",
	"██░░░░░░██░░░░██",
	" ██░░░░██░░░░██ ",
	"  ██░░░░░░░░██  ",
	"    ████████    ",
];

const COOKIE_SMALL_CLICKED = [
	"   ██████████   ",
	"  ██░░██░░░░██  ",
	" ██░░████░░░░██ ",
	" ██░░░░░░██░░██ ",
	"██░░░██░░░░░░░██",
	" ██░░░░░░██░░██ ",
	" ██░░░░██░░░░██ ",
	"  ██░░░░░░░░██  ",
	"   ██████████   ",
];

const COOKIE_LARGE = [
	"          ██████████████          ",
	"      ████░░░░░░██░░░░░░████      ",
	"    ██░░░░░░██░░░░░░██░░░░░░██    ",
	"  ██░░░░██░░░░░░░░░░░░░░██░░░░██  ",
	"  ██░░░░░░░░░░██░░░░░░░░░░░░░░██  ",
	" ██░░░░░░░░░░░░░░░░░░██░░░░░░░░██ ",
	"██░░░░██░░░░░░░░░░░░░░░░░░██░░░░██",
	"██░░░░░░░░░░██░░░░░░░░░░░░░░░░░░██",
	"██░░░░░░░░░░░░░░░░██░░░░░░░░░░░░██",
	"██░░░░░░██░░░░░░░░░░░░░░██░░░░░░██",
	" ██░░░░░░░░░░░░██░░░░░░░░░░░░░░██ ",
	"  ██░░░░░░░░░░░░░░░░░░░░░░░░░░██  ",
	"  ██░░░░██░░░░░░░░░░██░░░░░░░░██  ",
	"    ██░░░░░░░░██░░░░░░░░░░░░██    ",
	"      ████░░░░░░░░░░░░░░████      ",
	"          ██████████████          ",
];

const COOKIE_LARGE_CLICKED = [
	"         ████████████████         ",
	"      ████░░░░░░██░░░░░░████      ",
	"    ██░░░░░░██░░░░░░██░░░░░░██    ",
	"   ██░░░██░░░░░░░░░░░░░░██░░░██   ",
	"  ██░░░░░░░░░░██░░░░░░░░░░░░░░██  ",
	"  ██░░░░░░░░░░░░░░░░██░░░░░░░░██  ",
	" ██░░░██░░░░░░░░░░░░░░░░░░██░░░██ ",
	"██░░░░░░░░░░██░░░░░░░░░░░░░░░░░░██",
	"██░░░░░░░░░░░░░░░░██░░░░░░░░░░░░██",
	" ██░░░░░██░░░░░░░░░░░░░░██░░░░░██ ",
	"  ██░░░░░░░░░░░██░░░░░░░░░░░░░██  ",
	"  ██░░░░░░░░░░░░░░░░░░░░░░░░░░██  ",
	"   ██░░░██░░░░░░░░░░██░░░░░░░██   ",
	"    ██░░░░░░░░██░░░░░░░░░░░░██    ",
	"      ████░░░░░░░░░░░░░░████      ",
	"         ████████████████         ",
];

const PARTICLE_TEXTS = ["+1", "+1!", "🍪", "*", "·"];

function createColors(noColor: boolean) {
	if (noColor) {
		return {
			reset: "",
			bold: "",
			dim: "",
			black: "",
			red: "",
			green: "",
			yellow: "",
			blue: "",
			magenta: "",
			cyan: "",
			white: "",
			bgBlack: "",
			bgRed: "",
			bgGreen: "",
			bgYellow: "",
			bgBlue: "",
			bgMagenta: "",
			bgCyan: "",
			bgWhite: "",
			cookie: "",
			gold: "",
			brown: "",
		};
	}

	return {
		reset: "\x1B[0m",
		bold: "\x1B[1m",
		dim: "\x1B[2m",
		black: "\x1B[30m",
		red: "\x1B[31m",
		green: "\x1B[32m",
		yellow: "\x1B[33m",
		blue: "\x1B[34m",
		magenta: "\x1B[35m",
		cyan: "\x1B[36m",
		white: "\x1B[37m",
		bgBlack: "\x1B[40m",
		bgRed: "\x1B[41m",
		bgGreen: "\x1B[42m",
		bgYellow: "\x1B[43m",
		bgBlue: "\x1B[44m",
		bgMagenta: "\x1B[45m",
		bgCyan: "\x1B[46m",
		bgWhite: "\x1B[47m",
		cookie: "\x1B[38;5;208m",
		gold: "\x1B[38;5;220m",
		brown: "\x1B[38;5;130m",
	};
}

export function clearScreen(): void {
	process.stdout.write("\x1B[2J\x1B[H");
}

export function hideCursor(): void {
	process.stdout.write("\x1B[?25l");
}

export function showCursor(): void {
	process.stdout.write("\x1B[?25h");
}

export function enterAltScreen(): void {
	process.stdout.write("\x1B[?1049h");
}

export function exitAltScreen(): void {
	process.stdout.write("\x1B[?1049l");
}

function getTerminalSize(): { width: number; height: number } {
	return {
		width: process.stdout.columns || 80,
		height: process.stdout.rows || 24,
	};
}

function centerText(text: string, width: number): string {
	const plainText = text.replace(/\x1B\[[0-9;]*m/g, "");
	const padding = Math.max(0, Math.floor((width - plainText.length) / 2));
	return " ".repeat(padding) + text;
}

function createBox(content: string[], width: number, title?: string): string[] {
	const lines: string[] = [];
	const innerWidth = width - 4;

	let topBorder = `╔${"═".repeat(width - 2)}╗`;
	if (title) {
		const titleText = ` ${title} `;
		const pos = Math.floor((width - 2 - titleText.length) / 2);
		topBorder =
			"╔" +
			"═".repeat(pos) +
			titleText +
			"═".repeat(width - 2 - pos - titleText.length) +
			"╗";
	}
	lines.push(topBorder);

	for (const line of content) {
		const plainLine = line.replace(/\x1B\[[0-9;]*m/g, "");
		const padding = innerWidth - plainLine.length;
		lines.push(`║ ${line}${" ".repeat(Math.max(0, padding))} ║`);
	}

	lines.push(`╚${"═".repeat(width - 2)}╝`);

	return lines;
}

export function triggerClickAnimation(ui: UIState, clickPower: number): void {
	ui.clickAnim = 6;

	const { width, height } = getTerminalSize();
	const centerX = Math.floor(width / 2);
	const centerY = Math.floor(height / 2);

	const count = 2 + Math.floor(Math.random() * 3);
	for (let i = 0; i < count; i++) {
		const offsetX = Math.floor(Math.random() * 16) - 8;
		const text =
			clickPower > 1
				? `+${clickPower}`
				: (PARTICLE_TEXTS[
						Math.floor(Math.random() * PARTICLE_TEXTS.length)
					] as string);
		ui.particles.push({
			x: centerX + offsetX,
			y: centerY - 2,
			text,
			life: 8 + Math.floor(Math.random() * 4),
		});
	}
}

export function updateAnimations(ui: UIState): void {
	if (ui.clickAnim > 0) {
		ui.clickAnim--;
	}

	for (const p of ui.particles) {
		p.life--;
		p.y--;
	}

	ui.particles = ui.particles.filter((p) => p.life > 0);
}

function renderGameView(state: GameState, ui: UIState): string[] {
	const { width, height } = getTerminalSize();
	const C = createColors(ui.noColor);
	const lines: string[] = [];

	const isClicked = ui.clickAnim > 3;
	let cookieArt: string[];
	if (height > 30) {
		cookieArt = isClicked ? COOKIE_LARGE_CLICKED : COOKIE_LARGE;
	} else {
		cookieArt = isClicked ? COOKIE_SMALL_CLICKED : COOKIE_SMALL;
	}

	lines.push("");
	const title = ui.noColor
		? "=== COOKIE CLICKER ==="
		: `${C.gold}${C.bold}🍪 COOKIE CLICKER 🍪${C.reset}`;
	lines.push(centerText(title, width));
	lines.push(
		centerText(
			`${C.dim}${"─".repeat(Math.min(40, width - 10))}${C.reset}`,
			width,
		),
	);
	lines.push("");

	const statsContent = [
		`${C.cookie}${C.bold}${formatNumber(state.cookies)}${C.reset} cookies`,
		`${C.dim}per second: ${C.green}${formatNumber(state.cps)}${C.reset}`,
	];
	const statsBox = createBox(statsContent, Math.min(36, width - 4), "COOKIES");
	for (const line of statsBox) {
		lines.push(centerText(line, width));
	}

	lines.push("");

	for (const line of cookieArt) {
		const coloredLine = isClicked
			? `${C.gold}${line}${C.reset}`
			: `${C.cookie}${line}${C.reset}`;
		lines.push(centerText(coloredLine, width));
	}

	lines.push("");

	const clickText =
		ui.clickAnim > 0
			? `${C.gold}${C.bold}>>> CLICK! <<<${C.reset}`
			: `${C.bold}[ Press ENTER to click! ]${C.reset}`;
	lines.push(centerText(clickText, width));
	lines.push("");

	lines.push(centerText(`${C.dim}[E] Shop  •  [Q] Quit${C.reset}`, width));

	lines.push("");
	lines.push(
		centerText(
			`${C.dim}Total baked: ${formatNumber(state.totalCookies)} • Click power: +${state.clickPower}${C.reset}`,
			width,
		),
	);

	return lines;
}

function renderShopView(state: GameState, ui: UIState): string[] {
	const { width } = getTerminalSize();
	const C = createColors(ui.noColor);
	const lines: string[] = [];

	lines.push("");
	const title = ui.noColor
		? "=== SHOP ==="
		: `${C.gold}${C.bold}🛒 SHOP 🛒${C.reset}`;
	lines.push(centerText(title, width));
	lines.push(
		centerText(
			`${C.dim}${"─".repeat(Math.min(40, width - 10))}${C.reset}`,
			width,
		),
	);
	lines.push("");

	lines.push(
		centerText(
			`${C.cookie}${formatNumber(state.cookies)}${C.reset} cookies available`,
			width,
		),
	);
	lines.push("");

	const shopWidth = Math.min(60, width - 4);
	const itemLines: string[] = [];

	for (let i = 0; i < state.shopItems.length; i++) {
		const item = state.shopItems[i] as ShopItem;
		const cost = getItemCost(item);
		const canBuy = state.cookies >= cost;
		const isSelected = i === ui.selectedItem;

		const selector = isSelected ? `${C.yellow}▶${C.reset}` : " ";
		const costColor = canBuy ? C.green : C.red;
		const nameColor = isSelected ? C.bold : "";

		const costStr = formatNumber(cost).padStart(8);
		const cpsStr = `+${item.cps}/s`.padStart(8);
		const ownedStr = `x${item.owned}`.padStart(4);

		itemLines.push(
			`${selector} ${nameColor}${item.name.padEnd(14)}${C.reset} │ ${costColor}${costStr}${C.reset} │ ${C.cyan}${cpsStr}${C.reset} │ ${ownedStr}`,
		);

		if (isSelected && shopWidth > 50) {
			itemLines.push(`  ${C.dim}${item.description}${C.reset}`);
		}
	}

	const shopBox = createBox(itemLines, shopWidth, "ITEMS");
	for (const line of shopBox) {
		lines.push(centerText(line, width));
	}

	lines.push("");
	lines.push(
		centerText(
			`${C.dim}[↑↓] Select  •  [ENTER] Buy  •  [E] Close${C.reset}`,
			width,
		),
	);

	return lines;
}

export function render(state: GameState, ui: UIState): void {
	const { width, height } = getTerminalSize();
	const C = createColors(ui.noColor);

	const contentLines = ui.shopOpen
		? renderShopView(state, ui)
		: renderGameView(state, ui);

	let output = "\x1B[H";

	const totalContentHeight = contentLines.length;
	const topPadding = Math.max(0, Math.floor((height - totalContentHeight) / 2));

	const buffer: string[] = [];

	for (let i = 0; i < topPadding; i++) {
		buffer.push(" ".repeat(width));
	}

	for (const line of contentLines) {
		const plainLine = line.replace(/\x1B\[[0-9;]*m/g, "");
		buffer.push(line + " ".repeat(Math.max(0, width - plainLine.length)));
	}

	const bottomPadding = height - topPadding - totalContentHeight;
	for (let i = 0; i < bottomPadding; i++) {
		buffer.push(" ".repeat(width));
	}

	for (let y = 0; y < buffer.length; y++) {
		output += `${buffer[y]}\n`;
	}

	for (const p of ui.particles) {
		if (p.y >= 0 && p.y < height && p.x >= 0 && p.x < width) {
			const alpha = p.life > 4 ? 1 : p.life / 4;
			const color = alpha > 0.5 ? C.gold : C.yellow;
			output += `\x1B[${p.y + 1};${p.x + 1}H${color}${p.text}${C.reset}`;
		}
	}

	process.stdout.write(output);
}

export function createUIState(noColor: boolean = false): UIState {
	return {
		shopOpen: false,
		selectedItem: 0,
		noColor,
		clickAnim: 0,
		particles: [],
	};
}
