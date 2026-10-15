> **Platform Speedrun & Panduan Lengkap Medali GitHub (GitHub Achievements)**  
> Ditenagai oleh **Nim Systems Programming Language** dan dideploy di **Vercel**.
> 
> 🔗 **Live Demo:** [https://code-lab-five-cyan.vercel.app/](https://code-lab-five-cyan.vercel.app/)

---

## 🌟 Fitur Utama
- **🤝 Co-Author Commit Generator (Nim-Powered):** Generate trailer `Co-authored-by:` standar GitHub secara instan untuk membuka medali **Pair Extraordinaire**.
- **🎚️ Achievement Tier Simulator:** Hitung progres real-time menuju Bronze, Silver (x2), dan Gold (x3) untuk **Pull Shark** dan **Galaxy Brain**.
- **🏆 Direktori Speedrun Medali:** Panduan langkah demi langkah tercepat untuk membuka seluruh medali:
  - 🤠 **Quickdraw** (< 5 Menit)
  - 🦈 **Pull Shark** (Level 1, 2, 3)
  - 🧠 **Galaxy Brain** (Q&A Discussions)
  - 🤝 **Pair Extraordinaire** (Co-Author)
  - 🚀 **YOLO** (Merge tanpa review)
  - 💖 **Public Sponsor** ($1 Tier)

---

## 🛠️ Tech Stack
- **Nim Compiler (2.0.8):** Logika utama ditulis dalam Nim (`src/app.nim` dan `src/badge_engine.nim`) lalu dikompilasi langsung ke JavaScript modern (`public/app.js`).
- **Styling:** Vanilla CSS dengan Dark Mode Glassmorphism & Animated Glow Mesh.
- **Deploy:** Siap satu klik ke [Vercel](https://vercel.com) melalui konfigurasi `vercel.json`.

---

## 🚀 Jalankan Secara Lokal
```bash
# 1. Compile Nim ke JavaScript
nim js -d:release -o:public/app.js src/app.nim

# 2. Jalankan server lokal
npx serve public
```

---

## 🌐 Deploy ke Vercel
1. Buka [vercel.com](https://vercel.com) $\rightarrow$ **Add New Project**.
2. Pilih repository `Yogiexc/code-lab`.
3. Set **Output Directory** ke `public`.
4. Klik **Deploy**! 🚀
