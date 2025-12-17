
# 🌌 Binance 2026 Luminous Almanac (光之年鉴)

> "In the crypto universe, time crystallizes into light."

**Repository**: [https://github.com/ls569333469/binance-2026-almanac](https://github.com/ls569333469/binance-2026-almanac)

A high-fidelity digital almanac collecting daily crypto history as luminous crystal cards, featuring **Neo-Chinese Futurism** aesthetics and **Swiss International Style** layouts.

## 🌟 Project Philosophy (设计理念)

This project envisions every day of 2026 as a "Luminous Crystal" suspended in the dark void of the crypto universe.

- **Visual Style**: Glassmorphism, Ray-tracing effects, Official Binance Gold (#F0B90B).
- **Core Concept**: Deterministic History. Every date holds a unique piece of memory or knowledge from the blockchain world.

## 🛠 Contribution Guide (如何参与共建)

We invite the community to co-create the history of crypto. The content engine is designed to be **Open Source Friendly**.

The data source is located in: `src/data/staticEvents.ts`.

It is separated into two parts:

### 1. Historical Events (历史节点)
Real-world milestones (e.g., Bitcoin Genesis Block, Binance Founding, Ethereum Merge).
- **Location**: `HISTORICAL_EVENTS` object.
- **Key Format**: `"MonthIndex-Day"` (e.g., `"0-3"` for Jan 3rd, `"11-25"` for Dec 25th).

### 2. Knowledge Base (知识库)
High-quality crypto concepts used to deterministically fill days without specific historical events.
- **Location**: `KNOWLEDGE_BASE` array.
- **Format**: Add a new object with `tag`, `title`, and `description`.

### Workflow
1. Fork this repository.
2. Edit `src/data/staticEvents.ts`.
3. Add your event following the `StaticEventContent` interface.
4. Submit a Pull Request.

## 📦 Installation & Run

This project uses **Vite** + **React**.

```bash
# 1. Clone the repository
git clone https://github.com/ls569333469/binance-2026-almanac.git

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

## 🎨 Tech Stack

- **React 19**: UI Rendering
- **TailwindCSS**: Styling Engine
- **Vite**: Build Tool
- **SVG**: Vector Graphics (Official Binance Logo Paths)
- **TypeScript**: Type Safety

## 📄 License

MIT License.
