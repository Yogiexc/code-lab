# GitBadge Hub

> **Polyglot Systems Architecture & Nokia Retro Monochrome Gaming Suite**  
> A full-spectrum computational lab integrating hardware machine instructions (x86-64 Assembly), manual memory control (Zig), native systems compilation (Nim, V), and distributed concurrency (Elixir).

---

[Live Platform (Vercel)](https://code-lab-five-cyan.vercel.app/) • [Source Code (GitHub)](https://github.com/Yogiexc/code-lab)

---

## Architectural Matrix (Low-Level to High-Level)

The project structure organizes responsibilities by abstraction layer, allocating tasks to the most suitable compiler and runtime environment:

| Layer | Language / Toolchain | Module Path | Responsibility |
| :--- | :--- | :--- | :--- |
| **Hardware / Machine** | x86-64 Assembly (NASM) | `asm_core/nokia_games_core.asm` | Low-level ALU bitwise state machines for retro Nokia arcade games & commit verification |
| **Manual Systems** | Zig (0.13+) | `zig_engine/badge_memory_engine.zig` | Manual memory allocation, zero-overhead buffers, signature verification |
| **Native Fast CLI** | V (Vlang) | `cli_tool/main.v` | High-speed standalone terminal utility for querying badge criteria |
| **Transpiled Systems** | Nim (2.0+) | `src/app.nim`, `src/badge_engine.nim` | Core mathematical evaluation logic transpiled directly to web JavaScript |
| **Distributed / OTP** | Elixir (BEAM VM) | `elixir_core/` | Asynchronous queue orchestration, regex validation, batch window estimation |

---

## Nokia Retro 6-in-1 Monochrome Gaming Suite

An interactive retro pixel machine embedded directly into the developer platform, strictly adhering to a 1-bit monochrome black & white LCD display profile:

1. **Snake II (Snake Xenzia)** — Classic wall-wrapping snake logic with self-collision detection and food accumulation.
2. **Space Impact** — Side-scrolling retro space shooter with laser beam raycasting against alien drone waves.
3. **Bounce Classic** — Gravity-driven ball physics with restitution bounce mechanics and golden ring collection.
4. **Pocket Carrom** — 2D board friction physics, striker aiming angle, and pocket boundary collision.
5. **Cricket** — Precision sweetspot bat-swing timing and boundary run scoring (Four & Six runs).
6. **Retro Pong** — The ultimate 1970s paddle arcade game featuring algorithmic AI tracking.

---

## Core Platform Capabilities

1. **Co-Authored-By Signature Generator**  
   Produces strictly compliant Git commit trailer metadata according to GitHub contribution verification standards.
2. **Achievement Milestone Simulator**  
   Real-time progress calculation across Bronze, Silver (Tier 2), and Gold (Tier 3) milestones for Pull Request and Discussion answer thresholds.
3. **Speedrun Operational Guides**  
   Reference operational steps for unlocking public achievements:
   - Quickdraw
   - Pull Shark
   - Galaxy Brain
   - Pair Extraordinaire
   - YOLO
   - Public Sponsor
   - Starstruck

---

## Repository Directory Layout

```text
code-lab/
├── asm_core/
│   ├── nokia_games_core.asm          # Hardware Assembly logic for Nokia arcade titles
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
│   └── nokia_suite.js                # Nokia 6-in-1 retro monochrome runtime
└── vercel.json                       # Static deployment configuration
```

---

## Authors & Maintainers
- **Bryan Yogie Saputra** ([@Yogiexc](https://github.com/Yogiexc))
- **Ranu Prasetya** ([@Aytsrp](https://github.com/Aytsrp))
- **GitHub Actions Automation** ([`github-actions[bot]`](https://github.com/apps/github-actions))
