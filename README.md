# GitBadge Hub

> **Polyglot Systems Architecture, Nokia Retro Gaming Lab & UNIX Console Platform**  
> A full-spectrum computational lab integrating hardware machine instructions (x86-64 Assembly), manual memory control (Zig), native systems compilation (Nim, V), and distributed concurrency (Elixir).

---

[Live Platform (Vercel)](https://code-lab-five-cyan.vercel.app/) • [Source Code (GitHub)](https://github.com/Yogiexc/code-lab)

---

## Architectural Matrix (Low-Level to High-Level)

The project structure organizes computational responsibilities by abstraction layer, allocating tasks to the most suitable compiler and runtime environment:

| Layer | Language / Toolchain | Module Path | Responsibility |
| :--- | :--- | :--- | :--- |
| **Hardware / Machine** | x86-64 Assembly (NASM) | `asm_core/nokia_games_core.asm` | Low-level ALU bitwise state machines for retro arcade engines & commit verification |
| **Manual Systems** | Zig (0.13+) | `zig_engine/badge_memory_engine.zig` | Manual memory allocation, zero-overhead buffers, signature verification |
| **Native Fast CLI** | V (Vlang) | `cli_tool/main.v` | High-speed standalone terminal utility for querying badge criteria |
| **Transpiled Systems** | Nim (2.0+) | `src/app.nim`, `src/badge_engine.nim` | Core mathematical evaluation logic transpiled directly to web JavaScript |
| **Distributed / OTP** | Elixir (BEAM VM) | `elixir_core/` | Asynchronous queue orchestration, regex validation, batch window estimation |

---

## Platform Features

### 1. Retro Monochrome Gaming Suite (6-in-1)
Embedded retro gaming machine strictly adhering to a 1-bit monochrome black-and-white LCD display matrix:
- **Snake II (Snake Xenzia)** — Wall-wrapping coordinate logic with body collision detection.
- **Space Impact** — Side-scrolling retro shooter with laser raycasting against alien waves.
- **Bounce Classic** — Gravity-driven ball physics with restitution bounce mechanics and golden ring collection.
- **Pocket Carrom** — 2D board friction deceleration, angular aiming, and corner pocket boundary checks.
- **Cricket** — Bat-swing timing evaluation window for boundary scoring (Four & Six runs).
- **Retro Pong** — Two-paddle table tennis arcade game with automated paddle tracking.

### 2. Audio & Visual Authenticity
- **Nokia 3310 Monophonic Synthesizer:** Pure Web Audio API square-wave oscillator generating 8-bit sound FX and the legendary *Nokia Tune (Gran Vals)* without external audio dependencies.
- **LCD Display Filter:** Real-time toggle between Pure Monochrome (`#000000`/`#ffffff`) and Classic Nokia 3310 Phosphor Green LCD matrix mode.

### 3. Live GitHub Profile Inspector & ASCII Receipt
- Real-time GitHub REST API audit inspecting repositories, stars, and achievement eligibility.
- Built-in ASCII receipt printer formatting a retro terminal verification slip.

### 4. Interactive UNIX Terminal Console
- Global Quake-style drop-down console triggered by pressing the backquote key (` ` `) or via the navigation bar.
- Interactive commands: `help`, `arch`, `games`, `badges`, `tune`, `whoami`, `clear`, and `exit`.

### 5. Signature & Milestone Workbench
- **Co-Authored-By Generator:** Produces RFC-compliant Git trailers for collaborative achievements.
- **Milestone Threshold Calculator:** Real-time progression estimation for tiered badges (Bronze, Silver, Gold).

---

## Repository Directory Layout

```text
code-lab/
├── asm_core/
│   ├── nokia_games_core.asm          # Hardware Assembly logic for 6 retro titles
│   ├── metal_slug_core.asm           # Side-scrolling ballistics routines
│   ├── flappy_core.asm               # Fixed-point physics routines
│   └── badge_verifier.asm            # Low-level commit verification routines
├── zig_engine/
│   └── badge_memory_engine.zig       # Manual memory safety layer
├── cli_tool/
│   └── main.v                        # Standalone terminal executable source
├── elixir_core/
│   ├── mix.exs                       # OTP application configuration
│   └── lib/gitbadge/orchestrator.ex  # Distributed pipeline module
├── src/
│   ├── app.nim                       # Core client logic
│   └── badge_engine.nim              # Achievement rule definitions
├── public/
│   ├── index.html                    # Interface layout
│   ├── style.css                     # Strict monochrome design system
│   ├── app.js                        # Client execution bundle
│   ├── nokia_audio.js                # Web Audio API 8-bit synthesizer
│   ├── nokia_suite.js                # 6-in-1 retro gaming runtime
│   ├── profile_inspector.js          # REST API audit & ASCII receipt printer
│   └── terminal_console.js           # Interactive UNIX shell overlay
└── vercel.json                       # Static deployment configuration
```

---

## Local Development & Compilation

### Web Application
```bash
# Serve public distribution folder locally
npx serve public
```

### Compile Nim to Web Target
```bash
nim js -d:release -o:public/app.js src/app.nim
```

---

## Authors & Maintainers
- **Bryan Yogie Saputra** ([@Yogiexc](https://github.com/Yogiexc))
- **Ranu Prasetya** ([@Aytsrp](https://github.com/Aytsrp))
- **GitHub Actions Automation** ([`github-actions[bot]`](https://github.com/apps/github-actions))
