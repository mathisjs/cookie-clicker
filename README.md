# 🍪 Cookie Clicker

A fun terminal-based Cookie Clicker game.

![npm](https://img.shields.io/npm/v/cookie-clicker-cli)
![license](https://img.shields.io/npm/l/cookie-clicker-cli)

## Installation

```bash
npm install -g cookie-clicker-cli
```

## Usage

```bash
cookie-clicker
```
## Controls

| Key | Action |
|-----|--------|
| `Enter` | Click cookie / Buy item |
| `E` | Open/close shop |
| `↑` `↓` | Navigate shop |
| `Q` | Quit game |

## Features

- 🖱️ Click cookies to earn points
- 🛒 Shop with 8 upgrades (Cursor, Grandma, Farm, Mine, Factory, Bank, Temple, Wizard Tower)
- 💾 Auto-save on every action
- 🌙 Offline earnings (up to 8 hours)
- 🎨 Colorful terminal UI (with `--no-color` option)

## Options

```bash
cookie-clicker --help       # Show help
cookie-clicker --no-color   # Disable colors
```

## Save Location

| Platform | Path |
|----------|------|
| Windows | `%APPDATA%/cookie-clicker-cli/save.json` |
| Linux | `~/.config/cookie-clicker-cli/save.json` |

## Development

```bash
# Install dependencies
bun install

# Run in development
bun run dev

# Build for production
bun run build

# Lint
bun run check

# Auto-fix lint issues
bun run check:fix
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Run linter (`bun run check`)
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feat/amazing-feature`)
6. Open a Pull Request

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Language**: TypeScript
- **Linter**: [Biome](https://biomejs.dev)

## License

MIT © [mathisjs](https://github.com/mathisjs)

## Links

- [GitHub Repository](https://github.com/mathisjs/cookie-clicker)
- [npm Package](https://www.npmjs.com/package/cookie-clicker-cli)
- [Report Issues](https://github.com/mathisjs/cookie-clicker/issues)
