const BADGES_DATA = [
  {
    id: "quickdraw",
    title: "Quickdraw",
    icon: "🤠",
    speed: "< 5 Menit",
    pill: "Fast Solo",
    pillClass: "pill-fast",
    desc: "Menutup issue atau pull request dalam waktu kurang dari 5 menit setelah dibuat.",
    steps: [
      "Buka tab Issues di repositori publik.",
      "Klik New issue dan masukkan judul apa saja.",
      "Langsung klik tombol 'Close issue' dalam hitungan detik."
    ]
  },
  {
    id: "pull-shark",
    title: "Pull Shark",
    icon: "🦈",
    speed: "2 - 5 Menit",
    pill: "Fast Solo",
    pillClass: "pill-fast",
    desc: "Membuka dan menggabungkan (merge) Pull Request ke branch utama.",
    steps: [
      "Bronze (x1): Merge 2 PR ke main branch.",
      "Silver (x2): Merge 16 PR (Status kamu saat ini!).",
      "Gold (x3): Merge 128 PR menuju puncak level."
    ]
  },
  {
    id: "galaxy-brain",
    title: "Galaxy Brain",
    icon: "🧠",
    speed: "5 Menit",
    pill: "Kolaborasi",
    pillClass: "pill-community",
    desc: "Mendapatkan jawaban yang diterima (marked as answer) di GitHub Discussions.",
    steps: [
      "Aktifkan fitur Discussions di Settings repo.",
      "Minta akun kawan membuat diskusi kategori Q&A.",
      "Beri jawaban lalu temanmu klik tombol 'Mark as answer' (butuh 2x untuk Bronze)."
    ]
  },
  {
    id: "pair-extraordinaire",
    title: "Pair Extraordinaire",
    icon: "🤝",
    speed: "3 Menit",
    pill: "Co-Author",
    pillClass: "pill-community",
    desc: "Melakukan merge pull request yang memiliki trailer Co-authored-by:.",
    steps: [
      "Gunakan generator commit di atas untuk generate trailer.",
      "Pastikan email kolaborator terhubung dengan akun GitHub aktif.",
      "Merge pull request tersebut ke branch default (main)."
    ]
  },
  {
    id: "yolo",
    title: "YOLO",
    icon: "🚀",
    speed: "1 Menit",
    pill: "Tanpa Review",
    pillClass: "pill-elite",
    desc: "Melakukan merge pull request tanpa menunggu review atau persetujuan reviewer.",
    steps: [
      "Saat membuat PR, request review ke collaborator.",
      "Tanpa menunggu approval, langsung klik Merge pull request."
    ]
  },
  {
    id: "starstruck",
    title: "Starstruck",
    icon: "⭐",
    speed: "16 Stars",
    pill: "Popularitas",
    pillClass: "pill-elite",
    desc: "Memiliki repositori publik dengan minimal 16 Stars.",
    steps: [
      "Bagikan repositori publik ke komunitas atau media sosial.",
      "Bronze (x1): 16 Stars.",
      "Silver (x2): 128 Stars.",
      "Gold (x3): 512 Stars."
    ]
  },
  {
    id: "public-sponsor",
    title: "Public Sponsor",
    icon: "💖",
    speed: "Resmi ($1)",
    pill: "Sponsor",
    pillClass: "pill-elite",
    desc: "Mendukung kreator open-source secara publik via GitHub Sponsors.",
    steps: [
      "Buka developer open source dengan tier $1 (misal @rydmike).",
      "Pilih nominal $1/bulan dan pastikan visibilitas 'Public sponsor'.",
      "Badge hati pink akan menempel permanen di profil."
    ]
  }
];

// State
let checkedBadges = JSON.parse(localStorage.getItem("gitbadge_progress") || '["quickdraw", "pull-shark", "yolo", "galaxy-brain"]');

function updateProgressUI() {
  const total = BADGES_DATA.length;
  const unlocked = checkedBadges.length;
  const percent = Math.round((unlocked / total) * 100);

  const fillEl = document.getElementById("progress-fill");
  const countEl = document.getElementById("unlocked-count");
  const percentEl = document.getElementById("unlocked-percent");

  if (fillEl) fillEl.style.width = percent + "%";
  if (countEl) countEl.innerText = `${unlocked} / ${total} Unlocked`;
  if (percentEl) percentEl.innerText = `${percent}%`;

  // Update check states in DOM
  BADGES_DATA.forEach(b => {
    const card = document.getElementById(`card-${b.id}`);
    const btn = document.getElementById(`check-${b.id}`);
    if (card && btn) {
      if (checkedBadges.includes(b.id)) {
        card.classList.add("badge-card-unlocked");
        btn.innerHTML = "✓ Sudah Diklaim";
        btn.classList.add("btn-claimed");
      } else {
        card.classList.remove("badge-card-unlocked");
        btn.innerHTML = "Tandai Diklaim";
        btn.classList.remove("btn-claimed");
      }
    }
  });

  localStorage.setItem("gitbadge_progress", JSON.stringify(checkedBadges));
}

function toggleBadge(id) {
  if (checkedBadges.includes(id)) {
    checkedBadges = checkedBadges.filter(x => x !== id);
  } else {
    checkedBadges.push(id);
    createConfettiEffect();
  }
  updateProgressUI();
}

function renderBadges() {
  const container = document.getElementById("badge-grid-container");
  if (!container) return;

  container.innerHTML = BADGES_DATA.map(b => `
    <article class="badge-card" id="card-${b.id}">
      <div class="badge-header">
        <div class="badge-icon-box">${b.icon}</div>
        <div class="badge-info">
          <h3>${b.title}</h3>
          <span class="badge-pill ${b.pillClass}">${b.pill} • ${b.speed}</span>
        </div>
      </div>
      <div class="badge-body">
        <p>${b.desc}</p>
        <ul class="steps-list">
          ${b.steps.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      <div class="badge-card-footer">
        <button id="check-${b.id}" class="btn-toggle-badge" onclick="toggleBadge('${b.id}')">
          Tandai Diklaim
        </button>
      </div>
    </article>
  `).join('');

  updateProgressUI();
}

function setupCopyButton() {
  const copyBtn = document.getElementById("btn-copy-coauthor");
  const outputBox = document.getElementById("coauthor-output");
  if (copyBtn && outputBox) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputBox.innerText);
      copyBtn.innerText = "✓ Tersalin!";
      setTimeout(() => copyBtn.innerText = "Salin Kode", 2000);
    });
  }
}

function setupSimulator() {
  const prInput = document.getElementById("input-pr-count");
  const prBadge = document.getElementById("pr-tier-badge");
  const qaInput = document.getElementById("input-qa-count");
  const qaBadge = document.getElementById("qa-tier-badge");

  if (prInput && prBadge) {
    prInput.addEventListener("input", (e) => {
      const v = parseInt(e.target.value) || 0;
      if (v >= 128) {
        prBadge.innerText = "Gold Tier (x3) - Master Shark 🏆";
        prBadge.style.color = "#fbbf24";
      } else if (v >= 16) {
        prBadge.innerText = "Silver Tier (x2) - Hunter Shark 🦈";
        prBadge.style.color = "#93c5fd";
      } else if (v >= 2) {
        prBadge.innerText = "Bronze Tier (x1) - Baby Shark 🐟";
        prBadge.style.color = "#f472b6";
      } else {
        prBadge.innerText = `Kurang ${2 - v} PR lagi untuk Bronze`;
        prBadge.style.color = "#94a3b8";
      }
    });
  }

  if (qaInput && qaBadge) {
    qaInput.addEventListener("input", (e) => {
      const v = parseInt(e.target.value) || 0;
      if (v >= 16) {
        qaBadge.innerText = "Gold Tier (x3) - Cosmic Mind 🌌";
        qaBadge.style.color = "#fbbf24";
      } else if (v >= 8) {
        qaBadge.innerText = "Silver Tier (x2) - Super Brain 🧠";
        qaBadge.style.color = "#c084fc";
      } else if (v >= 2) {
        qaBadge.innerText = "Bronze Tier (x1) - Galaxy Novice 💡";
        qaBadge.style.color = "#34d399";
      } else {
        qaBadge.innerText = `Kurang ${2 - v} jawaban terjawab lagi`;
        qaBadge.style.color = "#94a3b8";
      }
    });
  }

  const nameInput = document.getElementById("coauthor-name");
  const emailInput = document.getElementById("coauthor-email");
  const genBtn = document.getElementById("btn-generate-coauthor");
  const outBox = document.getElementById("coauthor-output");

  if (genBtn && outBox) {
    genBtn.addEventListener("click", () => {
      const name = (nameInput?.value || "Aytsrp").trim();
      const email = (emailInput?.value || "Aytsrp@users.noreply.github.com").trim();
      outBox.innerText = `git commit -m "feat: implement pair collaboration" -m "Co-authored-by: ${name} <${email}>"\ngit push origin feature-branch`;
    });
  }
}

function createConfettiEffect() {
  const count = 30;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "confetti-particle";
    el.style.left = Math.random() * 100 + "vw";
    el.style.backgroundColor = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#fbbf24"][Math.floor(Math.random() * 5)];
    el.style.animationDuration = (Math.random() * 2 + 1) + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderBadges();
  setupSimulator();
  setupCopyButton();
});
