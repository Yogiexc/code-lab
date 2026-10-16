# GitBadge Hub

> **Polyglot Systems Architecture & GitHub Achievement Reference Platform**  
> A full-spectrum computational lab integrating hardware machine instructions (x86-64 Assembly), manual memory control (Zig), native systems compilation (Nim, V), and distributed concurrency (Elixir).

---

[Live Deployment (Vercel)](https://code-lab-five-cyan.vercel.app/) • [Source Code (GitHub)](https://github.com/Yogiexc/code-lab)

---

## Architectural Matrix (Low-Level to High-Level)

The project structure organizes responsibilities by abstraction layer, allocating tasks to the most suitable compiler and runtime environment:

| Layer | Language / Toolchain | Module Path | Responsibility |
| :--- | :--- | :--- | :--- |
| **Hardware / Machine** | x86-64 Assembly (NASM) | `asm_core/badge_verifier.asm` | Direct CPU register operations, fast SHA-1 parsing, hardware POPCNT instructions |
| **Manual Systems** | Zig (0.13+) | `zig_engine/badge_memory_engine.zig` | Manual memory allocation, zero-overhead buffers, signature verification |
| **Native Fast CLI** | V (Vlang) | `cli_tool/main.v` | High-speed standalone terminal utility for querying badge criteria |
| **Transpiled Systems** | Nim (2.0+) | `src/app.nim`, `src/badge_engine.nim` | Core mathematical evaluation logic transpiled directly to web JavaScript |
| **Distributed / OTP** | Elixir (BEAM VM) | `elixir_core/` | Asynchronous queue orchestration, regex validation, batch window estimation |

---

## Core Capabilities

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
│   └── badge_verifier.asm            # Low-level assembly routines
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
│   ├── style.css                     # Design system and layout tokens
│   └── app.js                        # Client execution bundle
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
