# GitBadge Hub ⚡

> **The Ultimate Polyglot GitHub Achievement Speedrunner & Architecture Lab**  
> Menggabungkan spektrum lengkap pemrograman komputer: dari **Hardware Machine Code (Assembly x86-64)**, **Low-Level Manual Memory (Zig)**, hingga **High-Level Concurrency (Elixir)** dan **Systems Transpilation (Nim & Vlang)**.

---

🔗 **Live Platform Demo:** [https://code-lab-five-cyan.vercel.app/](https://code-lab-five-cyan.vercel.app/)

---

## 🏗️ Spektrum Arsitektur Polyglot (Low-Level ke High-Level)

Repository ini dirancang secara modular dengan membagi tugas ke bahasa yang paling optimal sesuai tingkatannya:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SPEKTRUM ARSITEKTUR                              │
├──────────────────────────┬──────────────┬──────────────────────────────┤
│ Tingkatan Bahasa         │ Bahasa       │ Tugas / Tanggung Jawab       │
├──────────────────────────┼──────────────┼──────────────────────────────┤
│ 1. Machine Instructions  │ ⚙️ Assembly   │ x86-64 register SHA-1 & bit  │
│    (Tingkat Paling Rendah)│    (NASM)    │ popcount verification        │
│ 2. Manual Memory Systems │ ⚡ Zig       │ Zero-overhead memory buffer  │
│                          │              │ & signature validation       │
│ 3. Native Fast CLI       │ 🔵 V (Vlang) │ Utilitas terminal kilat      │
│ 4. Transpiled Systems    │ 🟡 Nim       │ Core generator & compiled    │
│                          │              │ Web Engine (Vercel deploy)   │
│ 5. Distributed / Concur. │ 🟣 Elixir    │ BEAM VM orchestrator & batch │
│    (Tingkat Paling Tinggi)│   (OTP)      │ sync window calculator       │
└──────────────────────────┴──────────────┴──────────────────────────────┘
```

---

## 🌟 Fitur Utama Platform

1. **🤝 Co-Author Commit Generator:**  
   Generate trailer `Co-authored-by:` standar GitHub secara instan untuk membuka medali **Pair Extraordinaire**.
2. **🎯 Interactive Progress Tracker & Confetti Effect:**  
   Lacak progres koleksi medali kamu secara visual dengan persistensi browser (*Local Storage*) dan animasi confetti real-time.
3. **🎚️ Achievement Tier Simulator:**  
   Hitung progres real-time menuju Bronze, Silver (x2), dan Gold (x3) untuk medali **Pull Shark** dan **Galaxy Brain**.
4. **🏆 Direktori Speedrun Medali GitHub:**  
   Panduan praktis tercepat untuk membuka:
   - 🤠 **Quickdraw** (< 5 Menit)
   - 🦈 **Pull Shark** (Level 1, 2, 3)
   - 🧠 **Galaxy Brain** (Q&A Discussions)
   - 🤝 **Pair Extraordinaire** (Co-Author)
   - 🚀 **YOLO** (Merge tanpa review)
   - 💖 **Public Sponsor** ($1 Tier)
   - ⭐ **Starstruck** (16 Stars)

---

## 📁 Struktur Direktori Proyek

```text
code-lab/
├── 📁 asm_core/              # x86-64 Assembly Machine Instructions
│   └── badge_verifier.asm    # Bitwise permutation & POPCNT verification
├── 📁 zig_engine/            # Low-Level Zig Memory Management
│   └── badge_memory_engine.zig
├── 📁 cli_tool/              # High-Speed Terminal CLI
│   └── main.v                # Vlang CLI binary source
├── 📁 elixir_core/           # BEAM High Concurrency Orchestrator
│   ├── mix.exs
│   └── lib/gitbadge/orchestrator.ex
├── 📁 src/                   # Nim Systems Web Engine
│   ├── app.nim               # Frontend interactive logic
│   └── badge_engine.nim      # Tier evaluation rules
├── 📁 public/                # Static Web Assets (Deployed to Vercel)
│   ├── index.html            # Dark Glassmorphism interface
│   ├── style.css             # Ambient glow mesh & animations
│   └── app.js                # Compiled interactive engine
└── vercel.json               # Vercel deployment configuration
```

---

## 🚀 Menjalankan Secara Lokal

### 1. Web Platform
```bash
# Jalankan web server lokal
npx serve public
```

### 2. Mengompilasi Kode Nim ke Web JavaScript
```bash
nim js -d:release -o:public/app.js src/app.nim
```

---

## 👥 Kolaborator & Kontributor
- **Bryan Yogie Saputra** ([@Yogiexc](https://github.com/Yogiexc))
- **Ranu Prasetya** ([@Aytsrp](https://github.com/Aytsrp))
- **GitHub Actions Bot** ([`github-actions[bot]`](https://github.com/apps/github-actions))
