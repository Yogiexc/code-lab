# GitBadge Hub

> Polyglot Systems Architecture, Nokia Retro Gaming Lab, and UNIX Console Platform.  
> A full-spectrum computational laboratory integrating hardware machine instructions (x86-64 Assembly), manual memory control (Zig), native systems compilation (Nim, V), and distributed concurrency (Elixir).

---

[Live Platform (Vercel)](https://code-lab-five-cyan.vercel.app/) | [Source Code (GitHub)](https://github.com/Yogiexc/code-lab) | [Package Registry](https://github.com/Yogiexc/code-lab/packages)

---

## Architectural Matrix

The platform architecture organizes computational responsibilities by abstraction layer, allocating tasks to the most suitable compiler and runtime environment:

| Layer | Language / Toolchain | Module Path | Responsibility |
| :--- | :--- | :--- | :--- |
| **Hardware / Machine** | x86-64 Assembly (NASM) | `asm_core/nokia_games_core.asm` | Low-level ALU bitwise state machines for retro arcade engines and commit verification routines |
| **Manual Systems** | Zig (0.13+) | `zig_engine/badge_memory_engine.zig` | Manual memory allocation, zero-overhead buffers, and signature verification |
| **Native Fast CLI** | V (Vlang 0.4+) | `cli_tool/main.v` | High-speed standalone terminal utility for querying badge criteria |
| **Transpiled Systems** | Nim (2.0+) | `src/app.nim`, `src/badge_engine.nim` | Core mathematical evaluation logic transpiled directly to client-side JavaScript |
| **Distributed / OTP** | Elixir (BEAM VM 1.14+) | `elixir_core/` | Asynchronous queue orchestration, regex validation, and batch window estimation |

---

## Platform Features

### 1. Retro Monochrome Gaming Suite
Embedded gaming engine strictly adhering to a 1-bit monochrome black-and-white LCD display matrix:
- **Snake II (Snake Xenzia)**: Wall-wrapping coordinate logic with self-collision detection algorithms.
- **Space Impact**: Side-scrolling projectile engine with raycasting against alien waves.
- **Bounce Classic**: Gravity-driven ball physics with restitution bounce mechanics and golden ring collection.
- **Pocket Carrom**: Two-dimensional board friction deceleration, angular aiming, and pocket boundary checks.
- **Cricket**: Bat-swing timing evaluation window for boundary scoring calculation.
- **Retro Pong**: Dual-paddle table tennis arcade game with automated tracking logic.

### 2. Audio and Visual Authenticity
- **Nokia 3310 Monophonic Synthesizer**: Pure Web Audio API square-wave oscillator generating 8-bit sound effects and the authentic Gran Vals ringtone without external audio asset dependencies.
- **Display Matrix Filter**: Real-time switchable viewport supporting both pure monochrome high-contrast mode and classic Nokia 3310 phosphor green LCD illumination.

### 3. Live GitHub Profile Inspector and ASCII Receipt
- Real-time GitHub REST API audit inspecting repositories, stars, and achievement eligibility.
- Built-in ASCII receipt printer generating structured terminal verification records.

### 4. Interactive UNIX Terminal Console
- Global Quake-style drop-down console accessible via the backquote key or navigation bar trigger.
- Internal commands: `help`, `neofetch`, `cowsay`, `fortune`, `matrix`, `uptime`, `ls`, `arch`, `games`, `badges`, `tune`, `whoami`, `clear`, and `exit`.

### 5. Signature and Milestone Workbench
- **Co-Authored-By Generator**: Produces RFC-compliant Git trailers for collaborative achievements such as Pair Extraordinaire.
- **Milestone Threshold Calculator**: Real-time progression estimation for tiered badges (Bronze, Silver, Gold).

---

## Repository Structure

```text
code-lab/
├── .github/
│   └── workflows/
│       └── publish-package.yml       # GitHub Actions workflow for npm package publishing
├── asm_core/
│   ├── nokia_games_core.asm          # Hardware Assembly logic for retro arcade engines
│   ├── metal_slug_core.asm           # Side-scrolling ballistics routines
│   ├── flappy_core.asm               # Fixed-point physics routines
│   └── badge_verifier.asm            # Low-level commit verification routines
├── zig_engine/
│   └── badge_memory_engine.zig       # Manual memory safety and buffer management layer
├── cli_tool/
│   └── main.v                        # Standalone terminal executable source code
├── elixir_core/
│   ├── mix.exs                       # OTP application configuration
│   └── lib/gitbadge/orchestrator.ex  # Distributed pipeline concurrency module
├── src/
│   ├── app.nim                       # Core client execution logic
│   └── badge_engine.nim              # Achievement rule definitions
├── public/
│   ├── index.html                    # Interface layout
│   ├── style.css                     # Monochrome design system
│   ├── app.js                        # Client execution bundle
│   ├── nokia_audio.js                # Web Audio API 8-bit synthesizer
│   ├── nokia_suite.js                # Retro gaming suite runtime
│   ├── profile_inspector.js          # REST API audit and ASCII receipt printer
│   └── terminal_console.js           # Interactive UNIX shell overlay
├── package.json                      # GitHub Packages registry configuration
└── vercel.json                       # Production deployment specification
```

---

## Local Development

### Serve Web Application
```bash
npx serve public
```

### Compile Nim to Web Target
```bash
nim js -d:release -o:public/app.js src/app.nim
```

---

## Package Installation

The platform package is distributed via GitHub Packages:

```bash
npm install @yogiexc/code-lab --registry=https://npm.pkg.github.com
```

---

## Authors and Maintainers

- **Bryan Yogie Saputra** ([@Yogiexc](https://github.com/Yogiexc))
- **Ranu Prasetya** ([@Aytsrp](https://github.com/Aytsrp))
- **GitHub Actions Automation** ([github-actions[bot]](https://github.com/apps/github-actions))
